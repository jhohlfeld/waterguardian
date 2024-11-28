import { describe, expect, it } from 'bun:test'
import { encodeShareUrl } from './encodeShareUrl'

describe('encodeShareUrl', () => {
  it('should encode a share url', () => {
    expect(
      encodeShareUrl(
        'https://netronaut-my.sharepoint.com/:x:/g/personal/jakob_hohlfeld_netronaut_de/ERWRznSVWvtDltYPyHqgaAMBbbS7UfA3ZXK7wqdEbFPN1Q?e=IljHc4',
      ),
    ).toBe(
      'u!aHR0cHM6Ly9uZXRyb25hdXQtbXkuc2hhcmVwb2ludC5jb20vOng6L2cvcGVyc29uYWwvamFrb2JfaG9obGZlbGRfbmV0cm9uYXV0X2RlL0VSV1J6blNWV3Z0RGx0WVB5SHFnYUFNQmJiUzdVZkEzWlhLN3dxZEViRlBOMVE_ZT1JbGpIYzQ',
    )
  })
})
