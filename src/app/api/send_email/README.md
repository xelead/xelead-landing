# Send Email API

This route handles `/api/send_email` requests and sends inquiry emails after validating Turnstile.

## Configuration

- `EMAIL_PROVIDER`: `ses` (default), `postmark`, or `nodemailer`.
- Postmark:
  - `POSTMARK_SERVER_TOKEN`
  - `POSTMARK_FROM_EMAIL`
  - `POSTMARK_TO_EMAIL`
- Nodemailer:
  - `NODEMAILER_HOST`
  - `NODEMAILER_PORT`
  - `NODEMAILER_USER` and `NODEMAILER_PASS` (optional, but must be set together)
  - `NODEMAILER_SECURE` (`true`/`false`)
  - `NODEMAILER_FROM_EMAIL`
  - `NODEMAILER_TO_EMAIL`
- Amazon SES:
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_SESSION_TOKEN` (optional)
  - `SES_FROM_EMAIL`
  - `SES_TO_EMAIL`
  - `SES_CONFIGURATION_SET` (optional)
- Shared:
  - `TURNSTILE_SECRET_KEY`
  - `CORS_ORIGIN`
