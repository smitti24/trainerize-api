import { Request, Response, NextFunction } from 'express'
import { IngestionService } from '../services/IngestionService'
import { IngestionRepository } from '../repositories/IngestionRepository'
import { createIngestionSchema, completeProcessingSchema, ingestionIdSchema, createAndProcessIngestionSchema } from '../schemas/ingestion.schema'
import { Ingestion } from '../entities/Ingestion.entity'
import { TextExtractor } from '../utils/textExtractor'

export class IngestionController {
    private ingestionService: IngestionService

    constructor() {
        this.ingestionService = new IngestionService(new IngestionRepository())
    }

    public async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ message: 'OK' })
        } catch (error) {
            next(error)
        }
    }

    public async getAllIngestions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const ingestions = await this.ingestionService.getAllIngestions()
            res.status(200).json(ingestions)
        } catch (error) {
            next(error)
        }
    }

    public async getIngestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ingestionIdSchema.parse(req.params.id)
            const ingestion = await this.ingestionService.getIngestionById(id)

            if (!ingestion) {
                res.status(404).json({ error: 'Ingestion not found' })
                return
            }

            res.status(200).json(ingestion)
        } catch (error) {
            next(error)
        }
    }

    public async createIngestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = createIngestionSchema.parse(req.body as Ingestion)
            const ingestion = await this.ingestionService.createIngestion(validatedData)
            res.status(201).json(ingestion)
        } catch (error) {
            next(error)
        }
    }

    public async startProcessing(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ingestionIdSchema.parse(req.params)
            const ingestion = await this.ingestionService.startProcessing(id)

            if (!ingestion) {
                res.status(404).json({ error: 'Ingestion not found' })
                return
            }

            res.status(200).json(ingestion)
        } catch (error) {
            next(error)
        }
    }

    public async completeProcessing(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ingestionIdSchema.parse(req.params)
            const validatedData = completeProcessingSchema.parse(req.body)

            const ingestion = await this.ingestionService.completeProcessing(
                id,
                validatedData.rawText,
                validatedData.wordCount
            )

            if (!ingestion) {
                res.status(404).json({ error: 'Ingestion not found' })
                return
            }

            res.status(200).json(ingestion)
        } catch (error) {
            next(error)
        }
    }

    public async failProcessing(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ingestionIdSchema.parse(req.params)
            const ingestion = await this.ingestionService.failProcessing(id)

            if (!ingestion) {
                res.status(404).json({ error: 'Ingestion not found' })
                return
            }

            res.status(200).json(ingestion)
        } catch (error) {
            next(error)
        }
    }

    public async deleteIngestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = ingestionIdSchema.parse(req.params)
            const deleted = await this.ingestionService.deleteIngestion(id)

            if (!deleted) {
                res.status(404).json({ error: 'Ingestion not found' })
                return
            }

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    public async processIngestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = createAndProcessIngestionSchema.parse(req.body)

            const result = await this.ingestionService.createAndProcessIngestion({
                title: validatedData.title,
                sourceType: validatedData.sourceType,
                fileSize: validatedData.fileSize,
                filePath: validatedData.filePath || null,
                originalFilename: validatedData.originalFilename,
                rawText: validatedData.rawText
            })

            res.status(201).json({
                success: true,
                message: 'Ingestion created and processed successfully',
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    public async uploadAndProcess(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file uploaded' })
                return
            }

            const file = req.file
            const fileType = file.mimetype === 'application/pdf' ? 'pdf' : 'docx'

            const { text, wordCount } = await TextExtractor.extractTextWithMetadata(
                file.buffer,
                fileType
            )

            if (!text || text.length === 0) {
                res.status(400).json({ error: 'Could not extract text from file' })
                return
            }

            const result = await this.ingestionService.createAndProcessIngestion({
                title: file.originalname.replace(/\.[^/.]+$/, ''),
                sourceType: fileType,
                fileSize: file.size,
                filePath: null,
                originalFilename: file.originalname,
                rawText: text
            })

            res.status(201).json({
                success: true,
                message: 'File uploaded and processed successfully',
                extractedWordCount: wordCount,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

}