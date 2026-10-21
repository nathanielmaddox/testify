/**
 * SERVER ONLY. STUB UploadAdapter for UploadThing (an alternative to Convex storage or S3). Nothing
 * is uploaded until this is implemented. Selecting UPLOAD_PROVIDER=uploadthing returns `missing-env`
 * while the env var is unset, and `not-implemented` after that.
 *
 * Env (server only): UPLOADTHING_TOKEN (from the UploadThing dashboard).
 *
 * Shape to implement (use the UploadThing server SDK, and confirm the current API in its docs):
 *   - createUploadTarget returns a short-lived upload URL for the file, with purpose job-photo and
 *     the referenceId in the file metadata. Only UPLOAD_ACCEPTED_TYPES, and the owner's size limit.
 *   - finalizeUpload checks the uploaded file and returns its URL as publicUrl.
 *
 * TODO(integration): implement both methods. Confirm the SDK calls and route names in the docs first.
 */
import type { UploadAdapter } from '../types'
import { stubFailure } from './none'

export function createUploadthingUpload(): UploadAdapter {
  return {
    async createUploadTarget() {
      return stubFailure('UploadThing', Boolean(process.env.UPLOADTHING_TOKEN))
    },
    async finalizeUpload() {
      return stubFailure('UploadThing', Boolean(process.env.UPLOADTHING_TOKEN))
    },
  }
}
