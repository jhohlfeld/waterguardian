import { Feature, FeatureCollection, Point } from 'geojson'
import { Waterguardian, WorksheetData } from './types'

function findIndices(row: Array<string>, names: Array<string>) {
  return names.reduce(
    (all, key) => ({
      ...all,
      [key]: row.findIndex((name) => String(name).trim().toLowerCase() === key),
    }),
    {},
  )
}

export function toMapData(
  data: WorksheetData,
): FeatureCollection<Point, Waterguardian.FeatureProperties> {
  // extract first 3 rows as descriptive headers
  const header = data
    .slice(0, 3)
    .map((row) => row.map((name) => String(name).trim().toLowerCase()))
  const [, columnNames, unitNames] = header

  // form key groups
  const coordinateNames = ['lng', 'lat']
  const propertyNames = ['id', 'date', 'type'] as const
  const sampleNames = columnNames.filter(
    (name) => ![...coordinateNames, ...propertyNames].includes(name),
  )

  // find all indices
  const indices: Record<string, number> = findIndices(columnNames, [
    ...coordinateNames,
    ...propertyNames,
    ...sampleNames,
  ])

  // process each data row - excluding header rows
  const features = data.slice(3).map((row) => {
    // get coordinates
    const coordinates = coordinateNames
      .map((name) => row[indices[name]])
      .filter((value) => typeof value === 'number')

    // get properties
    const properties = propertyNames.reduce(
      (all, name) => ({ ...all, [name]: row[indices[name]] }),
      {} as Record<(typeof propertyNames)[number], string>,
    )

    // extract measurements with units
    const measurements: Record<string, Waterguardian.MeasurementData> =
      sampleNames.reduce((all, name) => {
        const value = row[indices[name]]
        if (typeof value !== 'number') {
          return all
        }
        const index = Object.keys(indices).indexOf(name)
        return {
          ...all,
          [name]: {
            value,
            unit: unitNames[index],
          },
        }
      }, {})

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates,
      },
      properties: {
        ...properties,
        measurements,
      },
    } satisfies Feature<Point, Waterguardian.FeatureProperties>
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}
