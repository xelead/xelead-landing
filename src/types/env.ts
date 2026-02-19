export interface Env {
  EMAIL_PROVIDER?: "postmark" | "nodemailer";
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
  CORS_ORIGIN?: string;
  TURNSTILE_SECRET_KEY: string;
}
