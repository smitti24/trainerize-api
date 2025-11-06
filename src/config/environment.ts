import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default(3000),
    API_PREFIX: z.string().default('/api/v1'),
})

export const env = envSchema.parse(process.env)