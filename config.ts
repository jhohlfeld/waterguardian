function getEnv(key: string, value: string | undefined, defaultValue?: string) {
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`${key} not set`)
  }
  return value ?? defaultValue
}

export const maptilerApiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? ''
export const maptilerHeroStyleKey =
  process.env.NEXT_PUBLIC_MAPTILER_HERO_STYLE_KEY ?? ''
export const maptilerHeroStyleKeyDark =
  process.env.NEXT_PUBLIC_MAPTILER_HERO_STYLE_KEY_DARK ?? ''

export const awsS3Bucket = getEnv(
  'NEXT_PUBLIC_AWS_S3_BUCKET',
  process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
)
