import {createClient} from '@libsql/client'

export const turso = createClient({
  url: Bun.env.TURSO_DATABASE_URL,
  authToken: Bun.env.TURSO_AUTH_TOKEN,
})
