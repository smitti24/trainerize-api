import { z } from "zod"

export const createIngestionSchema = z.object({
    title: z.string().min(1).max(500),
    sourceType: z.enum(['pdf', 'txt', 'docx']),
    fileSize: z.number().positive(),
    filePath: z.string().max(1000).nullable(),
    originalFilename: z.string().min(1).max(500),
})

export const completeProcessingSchema = z.object({
    rawText: z.string(),
    wordCount: z.number().positive(),
})

const _uuidSchema = z.string().uuid()

export const ingestionIdSchema = _uuidSchema

export const ingestionSchema = createIngestionSchema.extend({
    id: ingestionIdSchema,
})