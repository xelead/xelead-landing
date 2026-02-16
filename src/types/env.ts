export interface Env {
  POSTMARK_SERVER_TOKEN: string;
  POSTMARK_FROM_EMAIL: string;
  POSTMARK_TO_EMAIL: string;
  CORS_ORIGIN?: string;
  TURNSTILE_SECRET_KEY: string;
}
