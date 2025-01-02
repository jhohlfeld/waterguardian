import { graphItemShareUrl } from '@/config'
import { hasGraphErrorCause } from '@/util/error'
import { fetchWorksheet } from './actions'
import { toMapData } from './toMapData'

export async function GET() {
  try {
    const data = await fetchWorksheet(graphItemShareUrl)
    return Response.json(toMapData(data))
  } catch (e) {
    if (hasGraphErrorCause(e)) {
      console.error(JSON.stringify(e.cause, null, 2))
      return Response.json(
        {
          type: 'FeatureCollection',
          features: [],
        },
        { status: e.cause.status },
      )
    } else {
      throw e
    }
  }
}
