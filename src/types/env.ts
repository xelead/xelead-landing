export interface Env {
  EMAIL_PROVIDER?: "postmark" | "nodemailer" | "ses";
  POSTMARK_SERVER_TOKEN: string;
  POSTMARK_FROM_EMAIL: string;
  POSTMARK_TO_EMAIL: string;
  NODEMAILER_HOST?: string;
  NODEMAILER_PORT?: string;
  NODEMAILER_USER?: string;
  NODEMAILER_PASS?: string;
  NODEMAILER_SECURE?: string;
  NODEMAILER_FROM_EMAIL?: string;
  NODEMAILER_TO_EMAIL?: string;
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_SESSION_TOKEN?: string;
  SES_FROM_EMAIL?: string;
  SES_TO_EMAIL?: string;
  SES_CONFIGURATION_SET?: string;
  CORS_ORIGIN?: string;
  TURNSTILE_SECRET_KEY: string;
}
