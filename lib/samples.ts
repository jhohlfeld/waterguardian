'use server'

import { ObjectId } from 'mongodb'
import client from './mongodb'
import { fromDocumentSchema, Sample, sampleSchema } from './schema'

export async function loadAllSamples() {
  const data = await client
    .collection<Sample>('samples')
    .aggregate([{ $project: { images: { $ifNull: ['$images', []] } } }])
    .toArray()
  return sampleSchema.array().parse(fromDocumentSchema.array().parse(data))
}

export async function loadSample(id: string) {
  try {
    const data = await client
      .collection('samples')
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $project: { images: { $ifNull: ['$images', []] } } },
      ])
      .next()

    if (!data) {
      return
    }

    return sampleSchema.parse(fromDocumentSchema.parse(data))
  } catch (error) {
    console.error(error)
  }
}
