import { Waterguardian } from '@/app/api/samples/types'
import client from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch all samples from MongoDB
    const samples = await client.collection('samples').find({}).toArray()
    console.log('MongoDB samples:', JSON.stringify(samples, null, 2))

    // Transform into FeatureCollection format
    const featureCollection: Waterguardian.FeatureCollection = {
      type: 'FeatureCollection',
      features: samples.map((sample) => ({
        type: 'Feature',
        geometry: sample.geometry,
        properties: {
          id: sample._id.toString(),
          date: sample.properties.date,
          type: sample.properties.type,
          measurements: sample.properties.measurements,
        },
      })),
    }

    return NextResponse.json(featureCollection)
  } catch (error) {
    console.error('Error fetching samples:', error)
    return NextResponse.json(
      { error: 'Failed to fetch samples' },
      { status: 500 },
    )
  }
}
