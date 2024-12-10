'use server'

import { graphClientId, graphClientSecret, graphTenantId } from '@/config'
import { encodeShareUrl } from '@/util/encodeShareUrl'
import { Feature, FeatureCollection, Point } from 'geojson'
import { createCache } from 'simple-in-memory-cache'

const { set, get } = createCache<string>()

async function fetchFromApi(path: string) {
  const token =
    get('auth_token') ??
    (await (async () => {
      const { token, expires } = await fetchToken()
      set('auth_token', token, { seconds: expires - 60 })
      return token
    })())

  return fetch(new URL(path, 'https://graph.microsoft.com/v1.0/'), {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

async function fetchToken() {
  const response = await fetch(
    new URL(
      `${graphTenantId}/oauth2/v2.0/token`,
      'https://login.microsoftonline.com/',
    ),
    {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: graphClientId,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: graphClientSecret,
        grant_type: 'client_credentials',
      }),
    },
  )

  if (!response.ok) {
    throw new Error('Error creating token', {
      cause: { status: response.status, error: (await response.json()).error },
    })
  }

  const { access_token: token, expires_in: expires } =
    (await response.json()) as { access_token: string; expires_in: number }

  return { token, expires }
}

async function fetchShareItem(shareUrl: string) {
  const response = await fetchFromApi(`shares/${shareUrl}/driveItem`)

  if (!response.ok) {
    throw new Error('Error looking up share url', {
      cause: { status: response.status, error: (await response.json()).error },
    })
  }

  const {
    parentReference: { driveId },
    id: itemId,
  } = await response.json()

  return { driveId, itemId }
}

async function fetchWorksheetId(driveId: string, itemId: string) {
  const response = await fetchFromApi(
    `drives/${driveId}/items/${itemId}/workbook/worksheets`,
  )

  if (!response.ok) {
    throw new Error('Error looking up worksheets', {
      cause: { status: response.status, error: (await response.json()).error },
    })
  }

  const {
    value: [{ id }],
  } = (await response.json()) as {
    value: Array<{ id: string }>
  }

  return id
}

async function fetchRangeFromWorksheet<T>(
  driveId: string,
  itemId: string,
  worksheetId: string,
) {
  const response = await fetchFromApi(
    `drives/${driveId}/items/${itemId}/workbook/worksheets/${encodeURIComponent(worksheetId)}/usedRange`,
  )

  if (!response.ok) {
    throw new Error('Error getting worksheet values', {
      cause: { status: response.status, error: (await response.json()).error },
    })
  }

  const { values } = (await response.json()) as { values: T }
  return values
}

export type WorksheetData = Array<Array<string | number>>

interface MeasurementData {
  [key: string]: number
}

interface WaterGuardianProperties {
  id: string
  date: string
  type: string
  measurements: MeasurementData
}

type WaterGuardianFeature = Feature<Point, WaterGuardianProperties>

function toFeatureCollection(
  data: WorksheetData,
): FeatureCollection<Point, WaterGuardianProperties> {
  console.log('Raw worksheet data:', JSON.stringify(data, null, 2))

  if (data.length < 3) {
    // Need group headers, column headers, and at least one data row
    console.log('Not enough data rows')
    return {
      type: 'FeatureCollection' as const,
      features: [],
    }
  }

  // Get column headers from second row
  const columnHeaders = data[1].map((h) => String(h).trim())
  console.log('Column headers:', columnHeaders)

  // Find column indices for required fields
  const lngIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'lng')
  const latIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'lat')
  const idIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'id')
  const dateIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'date')
  const typeIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'type')

  console.log('Required column indices:', {
    lng: lngIndex,
    lat: latIndex,
    id: idIndex,
    date: dateIndex,
    type: typeIndex,
  })

  // Find measurement columns (Copper, Lead, Nickel, Mercury, ph)
  const measurementColumns = columnHeaders.reduce<
    { name: string; index: number }[]
  >((acc, header, index) => {
    const headerLower = header.toLowerCase()
    if (header && !['lng', 'lat', 'id', 'date', 'type'].includes(headerLower)) {
      return [...acc, { name: header, index }]
    }
    return acc
  }, [])

  console.log('Measurement columns:', measurementColumns)

  // Process data rows (skip first two rows - group headers and column headers)
  const features = data
    .slice(2)
    .map((row, rowIndex) => {
      // Get coordinates and properties
      const lng = Number(row[lngIndex])
      const lat = Number(row[latIndex])
      const id = String(row[idIndex])
      const date = String(row[dateIndex])
      const type = String(row[typeIndex])

      console.log(`Row ${rowIndex + 1} base values:`, {
        lng,
        lat,
        id,
        date,
        type,
      })

      // Extract measurements
      const measurements: MeasurementData = {}
      measurementColumns.forEach(({ name, index }) => {
        const value = row[index]
        if (value !== undefined && value !== '') {
          const numValue = Number(value)
          if (!isNaN(numValue)) {
            measurements[name] = numValue
          }
        }
      })

      console.log(`Row ${rowIndex + 1} measurements:`, measurements)

      // Validate coordinates
      if (isNaN(lng) || isNaN(lat)) {
        console.warn(`Invalid coordinates for id ${id}: [${lng}, ${lat}]`)
        return null
      }

      const feature: WaterGuardianFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          id,
          date,
          type,
          measurements,
        },
      }

      console.log(
        `Row ${rowIndex + 1} feature:`,
        JSON.stringify(feature, null, 2),
      )
      return feature
    })
    .filter((feature): feature is WaterGuardianFeature => feature !== null)

  const result: FeatureCollection<Point, WaterGuardianProperties> = {
    type: 'FeatureCollection',
    features,
  }

  console.log('Final GeoJSON:', JSON.stringify(result, null, 2))
  return result
}

export async function fetchWorksheet(
  worksheetUrl: string,
): Promise<FeatureCollection<Point, WaterGuardianProperties>> {
  const { driveId, itemId } = await fetchShareItem(encodeShareUrl(worksheetUrl))
  const worksheetId = await fetchWorksheetId(driveId, itemId)
  return toFeatureCollection(
    await fetchRangeFromWorksheet<WorksheetData>(driveId, itemId, worksheetId),
  )
}
