declare module 'bun' {
  interface Env {
    TURSO_DATABASE_URL: string
    TURSO_AUTH_TOKEN: string
    SYNC_PASSKEY: string
    FRONTEND_ORIGIN: string
  }
}
