import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless' // Generated client

import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

export default db
