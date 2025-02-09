import { z } from 'zod'

// Input schema for form validation
export const sampleInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  sampleType: z.string(),
  measurements: z.object({
    Copper: z.number(),
    Lead: z.number(),
    Nickel: z.number(),
    Mercury: z.number(),
  }),
})

// Database schema for GeoJSON structure
export const sampleSchema = z.object({
  id: z.string().optional(), // Optional for new samples
  type: z.literal('Feature'),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  properties: z.object({
    date: z.date(),
    type: z.string(),
    measurements: z.object({
      Copper: z.number(),
      Lead: z.number(),
      Nickel: z.number(),
      Mercury: z.number(),
    }),
  }),
})

// Helper schema for MongoDB documents
const documentSchema = z
  .object({
    _id: z.instanceof(Object),
  })
  .passthrough()

export const fromDocumentSchema = documentSchema.transform(
  ({ _id, ...doc }) => ({
    id: String(_id), // Place id at top level
    ...doc,
  }),
)

export type SampleInput = z.infer<typeof sampleInputSchema>
export type Sample = z.infer<typeof sampleSchema>
