# Integrations

The site runs with zero integrations. Every outside service is off until you connect it, and
everything degrades honestly until then. The booked page shows a warning and does not claim an invite
was sent, unless the bookings route reports a connected booking with `inviteStatus: 'sent'`. The
checkout page stops at the Payment Element placeholder. The upload and send controls on the
confirmation forms stay disabled with a reason. No adapter ever fakes a success.

Each concern has one adapter interface in `lib/integrations/types.ts`, one provider choice read by
`lib/integrations/index.ts`, and one or more provider files under `lib/integrations/providers/`. Route
handlers and server code call `getIntegrations()`. Components never import a provider directly.

## How a provider is chosen

Each concern picks one provider when the server first loads the integrations module.

1. An explicit switch always wins, for example `PAYMENTS_PROVIDER=stripe`. `none` means no outside call.
2. An unset switch is inferred from the key that is present:
   - `STRIPE_SECRET_KEY` gives `stripe`.
   - `POSTMARK_SERVER_TOKEN` gives `postmark`. `RESEND_API_KEY` gives `resend`.
   - `CALCOM_API_KEY` gives `calcom`.
   - `CONVEX_URL` gives `convex` for the data store. For uploads it also gives `convex`, unless `UPLOADTHING_TOKEN` or `S3_BUCKET` is set.
   - `UPLOADTHING_TOKEN` gives `uploadthing`. `S3_BUCKET` gives `s3`.
3. Nothing set and nothing inferred means `none`.

The booking provider is never inferred from `CONVEX_URL`. Set `BOOKING_PROVIDER=convex` to use a
Convex booking table.

## Startup check

The provider choice runs once, when `lib/integrations/index.ts` first loads on the server. These
cases throw at that point, with a message that names the variable:

- An explicit switch with an unknown value, such as `PAYMENTS_PROVIDER=strpie`.
- Two keys for one concern with its switch unset, such as both `POSTMARK_SERVER_TOKEN` and `RESEND_API_KEY`. Set the switch to choose.

A thrown startup error fails the build or the first request that loads the module. It does not fail
quietly. In development, the server logs once for each concern: the provider chosen and whether it came
from a switch or a key. It logs names only, never values.

To check at boot instead of on the first request, `instrumentation.ts` at the app root could call
`getIntegrations()`. That file is not created. Add it only when the owner asks for it.

## Concerns

Call sites are the places in the code that call the adapter today. "Wired" means the call site exists.
"Stub" means the provider file still returns `missing-env` or `not-implemented`.

| Concern             | What it is for                                                                                                                                                                                                        | Call sites (today)                                                                                                                                                                          | Interface                                                                        | Recommended                                                                                                                    | Env                                                                                                                                     | Status                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payments            | Takes payment for offer LPs through Stripe Checkout. The Stripe adapter first creates a Customer named "First Last" with the email and business name in metadata, then creates the Checkout Session for that customer | `app/api/checkout/route.ts` POST: `payments.createCheckoutSession`. `lib/conversion_server.ts` `verifyConversion` and `app/api/onboarding/route.ts`: `payments.verifyPaidSession`           | `PaymentsAdapter`                                                                | Stripe. The site already builds Checkout Sessions, the CSP allows Stripe, and card details go only through the Payment Element | `PAYMENTS_PROVIDER`, `STRIPE_SECRET_KEY`, `STRIPE_PRICE_DONE_FOR_YOU_99`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Wired. Stripe adapter is real (`providers/stripe.ts`). The Payment Element is not mounted yet                                                                           |
| Transactional email | Booking confirmation, purchase receipt, lead notification to the owner                                                                                                                                                | None yet. `sendTransactional` has no call site                                                                                                                                              | `EmailAdapter` (`EmailTemplates` in `types.ts` lists each template and its data) | Postmark, for reliable transactional delivery and a small API. Resend is the alternative                                       | `EMAIL_PROVIDER`, `EMAIL_FROM`, `EMAIL_NOTIFY_TO`, `POSTMARK_SERVER_TOKEN` or `RESEND_API_KEY`                                          | Stub (`providers/postmark.ts`, `providers/resend.ts`). Call sites not wired                                                                                             |
| Bookings            | Lists open slots, creates the booking, reports whether the invite was sent                                                                                                                                            | `app/api/bookings/route.ts` GET: `booking.listSlots`. POST: `booking.createBooking`                                                                                                         | `BookingAdapter`                                                                 | Cal.com, which handles availability, time zones and invites. Use a Convex booking table only if you do not want Cal.com        | `BOOKING_PROVIDER`, `CALCOM_API_KEY`, `CALCOM_EVENT_TYPE_ID`                                                                            | Wired. With no provider, GET uses the mocked slots and says `connected: false`. Provider stubs (`providers/calcom.ts`, `providers/convex.ts`). Calendly has no code yet |
| Data store          | Append-only records: get-started answers, onboarding answers, feedback. Leads are not saved yet                                                                                                                       | `app/api/bookings/route.ts` POST: `saveGetStartedAnswers`. `app/api/onboarding/route.ts`: `saveOnboardingAnswers`. `app/api/feedback/route.ts`: `saveFeedback`. `saveLead` has no call site | `DataStoreAdapter`                                                               | Convex, the same deployment as uploads                                                                                         | `DATA_PROVIDER`, `CONVEX_URL`, `CONVEX_SITE_URL`                                                                                        | Wired for the three saves. Stub (`providers/convex.ts`)                                                                                                                 |
| Uploads             | Job photos from the onboarding form                                                                                                                                                                                   | `app/api/onboarding/route.ts`: `createUploadTarget` for each photo. `finalizeUpload` has no call site yet                                                                                   | `UploadAdapter`                                                                  | Convex file storage, so data and files share one backend. UploadThing or S3 are alternatives                                   | `UPLOAD_PROVIDER` plus the provider's vars (`CONVEX_URL`, `UPLOADTHING_TOKEN`, or the `AWS_*` and `S3_BUCKET` set)                      | Route wired. Stubs (`providers/convex.ts`, `providers/uploadthing.ts`, `providers/s3.ts`). Each adapter must enforce `MAX_PHOTO_BYTES`                                  |

Each switch takes `none` by default, or is inferred as described above. The no-op adapters are in
`providers/none.ts`. A call to a `none` adapter returns `not-connected`, and the route answers honestly.

## Photo size limit

`MAX_PHOTO_BYTES` in `lib/integrations/types.ts` sets the largest photo the upload adapters accept. Its
default is 25 MB. The owner can change that one constant. Every upload adapter must reject a larger
`sizeBytes` with `invalid-input` before it returns a target. The onboarding form copy must show the
same number, and it currently shows the placeholder "Up to [N] MB each". Change the constant and the
copy together.

The onboarding route passes the declared `sizeBytes` to the adapter. Until the route checks the limit
itself, the adapter is the only enforcement point.

## Messages never reach visitors

Every failure carries a `message` field. It is for server logs only. It can name env vars and carry
raw provider text. A route logs `message` and answers the visitor with a generic line, such as "We
couldn't book that just now. Your answers are saved." Never return `message` in an API response or
render it in a component. The rule is also written next to the field in `lib/integrations/types.ts`.

## What to point to

Set these in `.env.local` for development and in the Vercel project for production. Never prefix a
secret with `NEXT_PUBLIC_`.

**Stripe** (`PAYMENTS_PROVIDER=stripe`, or inferred from the secret key)

- Dashboard, Developers, API keys: a secret key (`sk_test_...` for test) into `STRIPE_SECRET_KEY`.
- The same page: the publishable key (`pk_test_...`) into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Product catalog: the recurring Price of the offer (`price_...`) into `STRIPE_PRICE_DONE_FOR_YOU_99`.
- Developers, Webhooks: an endpoint for your site, then its signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`. The handler is not written yet. Events are listed below.

**Postmark** (`EMAIL_PROVIDER=postmark`, or inferred from the server token)

- Server, API tokens: the server token into `POSTMARK_SERVER_TOKEN`.
- Sender signatures or domains: a verified sender into `EMAIL_FROM`.
- Also set `EMAIL_NOTIFY_TO` to the owner address for lead alerts.

**Resend** (`EMAIL_PROVIDER=resend`, or inferred from the API key)

- API keys: a key into `RESEND_API_KEY`. Domains: verify the sending domain, then use it in `EMAIL_FROM`.

**Cal.com** (`BOOKING_PROVIDER=calcom`, or inferred from the API key)

- Settings, Developer, API keys: a key into `CALCOM_API_KEY`.
- The event type for the discovery call: its numeric id into `CALCOM_EVENT_TYPE_ID`. See Cal.com docs for where the id is shown.
- Webhooks: a booking-created webhook pointing at the handler below. See Cal.com docs for its signing.

**Convex** (`DATA_PROVIDER=convex`, inferred from `CONVEX_URL`. Uploads also use it unless another upload key is set)

- The owner creates the deployment in the Convex dashboard. Agents do not create deployments or branches.
- The deployment URL (`https://<name>.convex.cloud`) into `CONVEX_URL`. The HTTP actions URL (`https://<name>.convex.site`) into `CONVEX_SITE_URL`.
- The deploy key goes into `CONVEX_DEPLOY_KEY` for the Convex CLI in CI only. The app never reads it.
- How this server authenticates to Convex is an open decision. Do not ship a public write endpoint.

**UploadThing** (`UPLOAD_PROVIDER=uploadthing`, or inferred from the token)

- Dashboard: the token into `UPLOADTHING_TOKEN`.

**S3** (`UPLOAD_PROVIDER=s3`, or inferred from the bucket)

- A private bucket (public access blocked) into `S3_BUCKET`, in region `AWS_REGION`.
- An IAM user limited to put and head on one prefix, into `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
- Bucket CORS must allow the PUT from your site origin. See the AWS docs for the exact rule.

## Prompt to paste

Paste one of these into an AI coding agent that works in this repo. Each names the file to write and
the switch to set.

**Stripe (already wired; check only)**

```text
In apps/website, confirm app/api/checkout/route.ts, lib/conversion_server.ts and app/api/onboarding/route.ts
call getIntegrations().payments. Env: STRIPE_SECRET_KEY, STRIPE_PRICE_DONE_FOR_YOU_99. Then mount the
Stripe Payment Element in components/lp/checkout/payment_element_slot.tsx using the client secret from
POST /api/checkout. Do not add dependencies without owner approval. Run: pnpm --filter @testify/website type-check
```

**Postmark**

```text
Implement EmailAdapter in apps/website/lib/integrations/providers/postmark.ts using the Postmark Email API
(POST https://api.postmarkapp.com/email, header X-Postmark-Server-Token). Env: POSTMARK_SERVER_TOKEN,
EMAIL_FROM. Render each template in EmailTemplates (lib/integrations/types.ts) from its typed data. Keep
stubFailure for a missing env var. Never return the failure message to a visitor. Then set
EMAIL_PROVIDER=postmark in .env.local and run: pnpm --filter @testify/website type-check
```

**Resend**

```text
Implement EmailAdapter in apps/website/lib/integrations/providers/resend.ts using the Resend Emails API
(POST https://api.resend.com/emails, Bearer RESEND_API_KEY). Env: RESEND_API_KEY, EMAIL_FROM. Render each
template in EmailTemplates (lib/integrations/types.ts) from its typed data. Never return the failure
message to a visitor. Then set EMAIL_PROVIDER=resend in .env.local and run: pnpm --filter @testify/website type-check
```

**Cal.com**

```text
Implement BookingAdapter in apps/website/lib/integrations/providers/calcom.ts with the Cal.com API v2:
listSlots for one day in the visitor's zone, and createBooking for the chosen start. Confirm every path and
header in the Cal.com docs first. Map a taken slot to reason slot-taken. Env: CALCOM_API_KEY,
CALCOM_EVENT_TYPE_ID. Set BOOKING_PROVIDER=calcom in .env.local. Run: pnpm --filter @testify/website type-check
```

**Convex (data store and uploads)**

```text
Implement DataStoreAdapter and UploadAdapter in apps/website/lib/integrations/providers/convex.ts. Create the
convex/ folder with append-only insert functions and a generateUploadUrl mutation. The owner creates the
deployment; do not create one. Enforce MAX_PHOTO_BYTES in createUploadTarget. Env: CONVEX_URL, CONVEX_SITE_URL.
Ask the owner how this server authenticates to Convex before writing any endpoint. Run:
pnpm --filter @testify/website type-check
```

**UploadThing**

```text
Implement UploadAdapter in apps/website/lib/integrations/providers/uploadthing.ts with the UploadThing
server SDK. Accept only UPLOAD_ACCEPTED_TYPES, and reject any sizeBytes above MAX_PHOTO_BYTES. Env:
UPLOADTHING_TOKEN. Confirm the SDK calls in its docs first. Run: pnpm --filter @testify/website type-check
```

**S3**

```text
Implement UploadAdapter in apps/website/lib/integrations/providers/s3.ts with a presigned PUT
(key job-photos/<referenceId>/<uploadId>-<file name>, expires in about 300 seconds). Reject any sizeBytes
above MAX_PHOTO_BYTES before presigning, and enforce the same limit in the presign. Add a HeadObject check
on finalize. Ask before adding the AWS SDK packages. Env: AWS_REGION, AWS_ACCESS_KEY_ID,
AWS_SECRET_ACCESS_KEY, S3_BUCKET. Run: pnpm --filter @testify/website type-check
```

**Any other provider**

```text
In apps/website, implement the adapter interface for one concern in lib/integrations/types.ts (payments,
email, booking, data store or upload) in a new file under lib/integrations/providers/<name>.ts. Use the
vendor's official docs for every endpoint, header and field, and mark anything you cannot confirm with
TODO(integration). Read secrets with dot access only, typed in lib/env.d.ts, and document each new var in
.env.example. Return { ok: false, reason } on any failure, never a fake success, and never return the
failure message to a visitor. Upload adapters reject any sizeBytes above MAX_PHOTO_BYTES. Add the provider
to the candidate or switch list in lib/integrations/index.ts. Do not add dependencies without owner
approval. Run: pnpm --filter @testify/website type-check
```

## Remaining call sites

Three things are not wired yet. Each one needs an owner decision or a built component first.

- `components/lp/checkout/payment_element_slot.tsx:10`: mount the Stripe Payment Element here. The `@stripe` client packages are not installed. The change handler at lines 29 to 35 must call `onPaymentDetailsEntered`, so `add_payment_info` fires only once details are complete.
- The purchase receipt and the booking invite email: send the receipt from the Stripe webhook, not from the confirmation page, because that page reloads. Send or skip the booking confirmation once Cal.com's invite behavior is decided (see open decisions). `sendTransactional` has no call site yet.
- `components/contact/contact_router.tsx:13`: `SUPPORT_EMAIL` is the placeholder `support@[DOMAIN]`. The owner supplies the real address. It is not an adapter.

Also note that `finalizeUpload` and `saveLead` have no call site. The upload finalize step and the lead save are not in any route read for this guide. Add them when the photo step and the lead flow are built.

## Booking embed (Contact page)

The Contact page embeds the owner's scheduling page in an iframe. The URL comes from
`NEXT_PUBLIC_BOOKING_EMBED_URL`, which is public because the browser loads it. Use the full booking
page URL from Cal.com, Calendly, or any other provider. When the variable is unset, the page shows a
placeholder calendar instead.

The browser only loads the frame if its host is on the CSP `frame-src` list. That list comes from the
`thirdParties` array in `next.config.js`, in the entry named "Booking embed". It lists `cal.com`,
`app.cal.com` and `calendly.com`. For any other provider, add its host to that entry. Otherwise the
browser blocks the frame, and the visitor sees an empty box.

The embed and the `BOOKING_PROVIDER` adapter are separate features:

- **Embed:** the provider's own booking UI, shown in an iframe on the Contact page. No API key, no
  server call, and nothing is stored by this site.
- **Adapter:** the Get started flow calls the provider's API to list slots and create the booking,
  then reports the result. It needs server-side keys such as `CALCOM_API_KEY`.

Each one works without the other. The Get started flow runs with no embed, and the Contact page runs
with no adapter.

Paste-ready prompt for switching the embed host:

```text
In apps/website, set NEXT_PUBLIC_BOOKING_EMBED_URL in .env.local to the full booking page URL from the new
provider (https://...). Then add that URL's host to the "Booking embed" frame list in next.config.js
(thirdParties), so the CSP allows the iframe. Do not add an API key for this embed; the URL is public.
Restart the dev server, open /contact, and confirm the calendar loads. Run:
pnpm --filter @testify/website type-check
```

## Webhooks

Webhook routes are not created yet. Each handler goes in its own folder under `app/api/webhooks/`, and
must verify the provider's signature before it trusts a body. `/api/*` already carries
`X-Robots-Tag: noindex` from `next.config.js`.

- **Stripe:** `app/api/webhooks/stripe/route.ts`. Listen for `checkout.session.completed`. Verify with `STRIPE_WEBHOOK_SECRET`, mark the purchase, then send the receipt. Subscription lifecycle events are a separate decision. See Stripe docs.
- **Cal.com:** `app/api/webhooks/calcom/route.ts`. Listen for the booking-created event. Verify its signature per Cal.com docs, then store the booking and send the confirmation if the site sends its own.
- **Other providers:** none yet. Add a route only when the adapter needs an inbound event.

## Open decisions

- How this server authenticates to Convex.
- Whether the site or Cal.com sends the booking confirmation, so the visitor gets one email, not two.
- The photo size limit. The default is 25 MB in `MAX_PHOTO_BYTES`, and the owner confirms or changes it.
- Whether lead notifications and lead saves should start before the lead flow is built.
- Whether `instrumentation.ts` should call `getIntegrations()` at boot.
