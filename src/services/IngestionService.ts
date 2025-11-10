import { IngestionRepository } from '../repositories/IngestionRepository'
import { Ingestion } from '../entities/Ingestion.entity'

export class IngestionService {
    private ingestionRepository: IngestionRepository

    constructor(ingestionRepository: IngestionRepository) {
        this.ingestionRepository = ingestionRepository
    }

    async getAllIngestions(): Promise<Ingestion[]> {
        return await this.ingestionRepository.findAll()
    }

    async getIngestionById(id: string): Promise<Ingestion | null> {
        return await this.ingestionRepository.findById(id)
    }

    async createIngestion(data: {
        title: string
        sourceType: 'pdf' | 'txt' | 'docx'
        fileSize: number
        filePath: string | null
        originalFilename: string
    }): Promise<Ingestion> {
        const ingestionId: string = this.generateIngestionId()
        
        const ingestionData: Partial<Ingestion> = {
            ingestionId,
            title: data.title,
            sourceType: data.sourceType,
            fileSize: data.fileSize,
            filePath: data.filePath,
            originalFilename: data.originalFilename,
            status: 'pending',
        }

        return await this.ingestionRepository.create(ingestionData)
    }

    async startProcessing(id: string): Promise<Ingestion | null> {
        return await this.ingestionRepository.update(id, {
            status: 'processing',
            processingStartedAt: new Date(),
        })
    }

    async completeProcessing(
        id: string,
        rawText: string,
        wordCount: number
    ): Promise<Ingestion | null> {
        return await this.ingestionRepository.update(id, {
            status: 'completed',
            processingCompletedAt: new Date(),
            rawText,
            wordCount,
        })
    }

    async failProcessing(id: string): Promise<Ingestion | null> {
        return await this.ingestionRepository.update(id, {
            status: 'failed',
            processingCompletedAt: new Date(),
        })
    }

    async deleteIngestion(id: string): Promise<boolean> {
        return await this.ingestionRepository.delete(id)
    }

    private generateIngestionId(): string {
        return `ING-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
}