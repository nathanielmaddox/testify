/**
 * SERVER ONLY. STUB UploadAdapter for S3 (or any S3-compatible bucket). Nothing is uploaded until
 * this is implemented. Selecting UPLOAD_PROVIDER=s3 returns `missing-env` while the env vars are
 * unset, and `not-implemented` after that.
 *
 * Env (server only): AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (an IAM user limited to
 * PutObject and HeadObject on one prefix), S3_BUCKET.
 *
 * Shape to implement (AWS SDK v3 packages, not installed here):
 *   - createUploadTarget: key = `job-photos/<referenceId>/<uploadId>-<safe file name>`. Presign a
 *     PutObjectCommand with ContentType and ContentLength, expiresIn about 300 seconds. Return
 *     method PUT and the Content-Type header the browser must send.
 *   - finalizeUpload: HeadObjectCommand on the key. Only on success return { uploadId, publicUrl }.
 *   - The bucket stays private. Serve photos through signed GET URLs, not public ones.
 *
 * TODO(integration): implement both methods. Add the SDK packages only when the owner approves them.
 */
import type { UploadAdapter } from '../types'
import { stubFailure } from './none'

export function createS3Upload(): UploadAdapter {
  const ready =
    Boolean(process.env.AWS_REGION) &&
    Boolean(process.env.AWS_ACCESS_KEY_ID) &&
    Boolean(process.env.AWS_SECRET_ACCESS_KEY) &&
    Boolean(process.env.S3_BUCKET)
  return {
    async createUploadTarget() {
      return stubFailure('S3', ready)
    },
    async finalizeUpload() {
      return stubFailure('S3', ready)
    },
  }
}
