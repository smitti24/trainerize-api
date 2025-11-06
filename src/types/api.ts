import { z } from 'zod'

export const HealthResponseSchema = z.object({
    status: z.literal('ok'),
    timestamp: z.string(),
    version: z.string(),
    environment: z.string(),
    service: z.string(),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>

export const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string(),
    timestamp: z.string(),
})

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>