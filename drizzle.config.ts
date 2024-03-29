import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './database/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true
} satisfies Config
