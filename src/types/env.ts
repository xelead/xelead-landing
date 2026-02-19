// Update this file with .env-exmaple file
export interface Env {
  EMAIL_PROVIDER?: "postmark" | "nodemailer" | "ses";
  NOTIFY_FROM_EMAIL?: string;
  NOTIFY_TO_EMAIL?: string;
  POSTMARK_SERVER_TOKEN: string;
  NODEMAILER_HOST?: string;
  NODEMAILER_PORT?: string;
  NODEMAILER_USER?: string;
  NODEMAILER_PASS?: string;
  NODEMAILER_SECURE?: string;
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_SESSION_TOKEN?: string;
  SES_CONFIGURATION_SET?: string;
  CORS_ORIGIN?: string;
  TURNSTILE_SECRET_KEY: string;
}
