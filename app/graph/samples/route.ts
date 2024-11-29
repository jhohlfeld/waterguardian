import { graphItemShareUrl } from '@/config'
import { hasGraphErrorCause } from '@/util/error'
import { fetchWorksheet } from './actions'

export async function GET() {
  try {
    const data = await fetchWorksheet(graphItemShareUrl)
    return Response.json(data)
  } catch (e) {
    if (hasGraphErrorCause(e)) {
      console.error(JSON.stringify(e.cause, null, 2))
      return Response.json({ error: e.cause.error }, { status: e.cause.status })
    } else {
      throw e
    }
  }
}
