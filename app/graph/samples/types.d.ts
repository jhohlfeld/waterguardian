export type WorksheetData = Array<Array<string | number>>

export namespace Waterguardian {
  export interface MeasurementData {
    value: number
    unit: string
  }

  export interface FeatureProperties {
    id: string
    date: string
    type: string
    measurements: Record<string, MeasurementData>
  }

  export type FeatureCollection = GeoJSON.FeatureCollection<
    Point,
    Waterguardian.FeatureProperties
  >
  export type Feature = GeoJSON.Feature<
    GeoJSON.Point,
    Waterguardian.FeatureProperties
  >
}
