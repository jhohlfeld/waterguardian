import { Waterguardian } from '@/app/api/samples/types'
import client from '@/lib/mongodb'
import { sampleInputSchema, sampleSchema } from '@/lib/schema'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input data
    const parseResult = sampleInputSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0].message },
        { status: 400 },
      )
    }

    // Transform and validate as GeoJSON Feature
    const sampleDocument = sampleSchema.parse({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [body.longitude, body.latitude],
      },
      properties: {
        date: new Date(body.date),
        type: body.sampleType,
        measurements: body.measurements,
      },
    })

    // Insert into MongoDB
    const result = await client.collection('samples').insertOne(sampleDocument)

    if (result.acknowledged) {
      return NextResponse.json(
        { success: true, id: result.insertedId.toString() },
        { status: 201 },
      )
    } else {
      return NextResponse.json(
        { error: 'Failed to save sample' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error saving sample:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Fetch all samples from MongoDB
    const samples = await client.collection('samples').find({}).toArray()
    console.log('MongoDB samples:', JSON.stringify(samples, null, 2))

    // Transform samples into GeoJSON features
    const features: Waterguardian.Feature[] = samples.map((sample) => {
      const { _id, geometry, properties } = sample
      return {
        type: 'Feature',
        geometry,
        properties: {
          id: _id.toString(),
          date: properties.date,
          type: properties.type,
          measurements: properties.measurements,
        },
      }
    })

    // Create FeatureCollection
    const featureCollection: Waterguardian.FeatureCollection = {
      type: 'FeatureCollection',
      features,
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
