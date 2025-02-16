import { z } from 'zod'

const documentSchema = z
  .object({
    _id: z.instanceof(Object),
  })
  .passthrough()

export const fromDocumentSchema = documentSchema.transform(
  ({ _id, ...doc }) => ({
    ...doc,
    id: String(_id),
  }),
)

export type Image = z.infer<typeof imageSchema>
export const imageSchema = z.object({
  url: z.string(),
  filename: z.string(),
})

export type Sample = z.infer<typeof sampleSchema>
export const sampleSchema = z.object({
  id: z.string(),
  images: imageSchema.array(),
})
