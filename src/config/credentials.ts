/**
 * credentials — TTACart login creds, sourced from `.env`.
 *
 * `dotenv.config()` runs in playwright.config.ts before any spec loads, so
 * `process.env` is already populated by the time this module is imported. The
 * fallbacks are the public demo creds, so the suite still runs if a local
 * `.env` is missing (e.g. a fresh clone or CI without secrets configured).
 *
 *   import { credentials } from '@config/credentials';
 *   await loginPage.loginAs(credentials.standardUser, credentials.password);
 */

export const credentials = {
    standardUser: process.env.STANDARD_USER ?? '',
    password: process.env.TTA_SECRET ?? '',
} as const;
