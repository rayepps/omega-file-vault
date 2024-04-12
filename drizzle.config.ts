import config from '@/backend/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/backend/database/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: config.supabase.connectionString
  }
} satisfies Config
