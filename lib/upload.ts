'use server'

import { awsS3Bucket } from '@/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function createUploadUrl(key: string) {
  return getSignedUrl(
    new S3Client(),
    new PutObjectCommand({
      Bucket: awsS3Bucket,
      Key: key,
    }),
  )
}
