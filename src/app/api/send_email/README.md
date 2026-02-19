# Send Email API

This route handles `/api/send_email` requests and sends inquiry emails after validating Turnstile.

## Configuration

- `EMAIL_PROVIDER`: `ses` (default), `postmark`, or `nodemailer`.
- `NOTIFY_FROM_EMAIL` and `NOTIFY_TO_EMAIL` are shared by Postmark and SES and NodeMailer.
- Postmark:
  - `POSTMARK_SERVER_TOKEN`
- Nodemailer:
  - `NODEMAILER_HOST`
  - `NODEMAILER_PORT`
  - `NODEMAILER_USER` and `NODEMAILER_PASS` (optional, but must be set together)
  - `NODEMAILER_SECURE` (`true`/`false`)
- Amazon SES:
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_SESSION_TOKEN` (optional)
  - `SES_CONFIGURATION_SET` (optional)
- Shared:
  - `TURNSTILE_SECRET_KEY`
  - `CORS_ORIGIN`
