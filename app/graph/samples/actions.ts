'use server'

import { graphClientId, graphClientSecret, graphTenantId } from '@/config'
import { encodeShareUrl } from '@/util/encodeShareUrl'
import { createCache } from 'simple-in-memory-cache'
import { WorksheetData } from './types'

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

export async function fetchWorksheet(
  worksheetUrl: string,
): Promise<WorksheetData> {
  const { driveId, itemId } = await fetchShareItem(encodeShareUrl(worksheetUrl))
  const worksheetId = await fetchWorksheetId(driveId, itemId)
  return fetchRangeFromWorksheet(driveId, itemId, worksheetId)
}
