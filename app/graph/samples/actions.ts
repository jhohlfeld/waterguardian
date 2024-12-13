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
  value: number
  unit: string
  group: string
}

interface WaterGuardianProperties {
  id: string
  date: string
  type: string
  measurements: Record<string, MeasurementData>
  measurementGroups: string[]
}

type WaterGuardianFeature = Feature<Point, WaterGuardianProperties>

interface ColumnGroup {
  name: string
  startIndex: number
  endIndex: number
}

function parseColumnGroups(groupRow: Array<string | number>): ColumnGroup[] {
  const groups: ColumnGroup[] = []
  let currentGroup: ColumnGroup | null = null

  for (let index = 0; index < groupRow.length; index++) {
    const cellValue = String(groupRow[index]).trim()

    if (cellValue) {
      // End previous group if exists
      if (currentGroup) {
        currentGroup.endIndex = index - 1
        groups.push(currentGroup)
      }
      // Start new group
      currentGroup = {
        name: cellValue,
        startIndex: index,
        endIndex: index,
      }
    } else if (currentGroup) {
      // Extend current group
      currentGroup.endIndex = index
    }
  }

  // Add last group if exists
  if (currentGroup) {
    currentGroup.endIndex = groupRow.length - 1
    groups.push(currentGroup)
  }

  return groups
}

function toFeatureCollection(
  data: WorksheetData,
): FeatureCollection<Point, WaterGuardianProperties> {
  if (data.length < 4) {
    console.log('Not enough data rows')
    return {
      type: 'FeatureCollection' as const,
      features: [],
    }
  }

  // Parse column groups from first row
  const columnGroups = parseColumnGroups(data[0])

  // Get column headers and units
  const columnHeaders = data[1].map((h) => String(h).trim())
  const unitRow = data[2].map((u) => String(u).trim())

  // Find required field indices
  const lngIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'lng')
  const latIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'lat')
  const idIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'id')
  const dateIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'date')
  const typeIndex = columnHeaders.findIndex((h) => h.toLowerCase() === 'type')

  // Find measurement columns with their units and groups
  const measurementColumns = columnHeaders.reduce<
    { name: string; index: number; unit: string; group: string }[]
  >((acc, header, index) => {
    const headerLower = header.toLowerCase()
    if (header && !['lng', 'lat', 'id', 'date', 'type'].includes(headerLower)) {
      // Find which group this column belongs to
      const group = columnGroups.find(
        (g) => index >= g.startIndex && index <= g.endIndex,
      )
      return [
        ...acc,
        {
          name: header,
          index,
          unit: unitRow[index],
          group: group?.name || 'Other',
        },
      ]
    }
    return acc
  }, [])

  // Process data rows
  const features = data
    .slice(3)
    .map((row) => {
      // Get coordinates and properties
      const lng = Number(row[lngIndex])
      const lat = Number(row[latIndex])
      const id = String(row[idIndex])
      const date = String(row[dateIndex])
      const type = String(row[typeIndex])

      // Extract measurements with units and groups
      const measurements: Record<string, MeasurementData> = {}
      const measurementGroups = new Set<string>()

      measurementColumns.forEach(({ name, index, unit, group }) => {
        const value = row[index]
        if (value !== undefined && value !== '') {
          const numValue = Number(value)
          if (!isNaN(numValue)) {
            measurements[name] = {
              value: numValue,
              unit,
              group,
            }
            measurementGroups.add(group)
          }
        }
      })

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
          measurementGroups: Array.from(measurementGroups),
        },
      }

      return feature
    })
    .filter((feature): feature is WaterGuardianFeature => feature !== null)

  return {
    type: 'FeatureCollection',
    features,
  }
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
