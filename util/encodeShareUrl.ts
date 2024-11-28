/**
 * ShareUrl encoding
 *
 * @see https://learn.microsoft.com/en-us/graph/api/shares-get?view=graph-rest-1.0&tabs=http#encoding-sharing-urls
 *
 * 1. use base64 to encode the URL
 * 2. Convert the base64 encoded result to unpadded base64url format by removing `=` characters from the end of the value, replacing `/` with `_` and `+` with `-`.
 * 3. Append u! to be beginning of the string.
 */
export function encodeShareUrl(url: string) {
  return (
    'u!' +
    Buffer.from(url)
      .toString('base64')
      .slice(0, -1)
      .replaceAll('/', '_')
      .replaceAll('+', '-')
  )
}
