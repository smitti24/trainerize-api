import { IngestionRepository } from '../repositories/IngestionRepository'
import { Ingestion } from '../entities/Ingestion.entity'
import { AiService } from './AiService'
import { ThemeService } from './ThemeService'
import { LessonService } from './LessonService'
import { SourceCitationService } from './SourceCitationService'
import { StorageService } from './StorageService'
import { SourceCitationRepository } from '../repositories/SourceCitationRepository'
import { ThemeRepository } from '../repositories/ThemeRepository'
import { LessonRepository } from '../repositories/LessonRepository'
import { Lesson, SourceCitation, Theme } from '../entities'
import { withRetry } from '../middleware/retry.middleware'
import { formatLessonForAudio, calculateAudioDuration, LessonContent } from '../utils/lessonFormatter'

export class IngestionService {
    private ingestionRepository: IngestionRepository
    private aiService: AiService
    private themeService: ThemeService
    private lessonService: LessonService
    private citationService: SourceCitationService
    private storageService: StorageService

    constructor(ingestionRepository: IngestionRepository) {
        this.ingestionRepository = ingestionRepository
        this.aiService = new AiService()
        this.themeService = new ThemeService(new ThemeRepository())
        this.lessonService = new LessonService(new LessonRepository())
        this.citationService = new SourceCitationService(new SourceCitationRepository())
        this.storageService = new StorageService()
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

    async createAndProcessIngestion(data: {
        title: string
        sourceType: 'pdf' | 'txt' | 'docx'
        fileSize: number
        filePath: string | null
        originalFilename: string
        rawText: string
    }): Promise<{
        ingestion: Ingestion
        themes: Theme[]
        lesson: Lesson
        citations: SourceCitation[]
    }> {
        const ingestion = await this.createIngestion({
            title: data.title,
            sourceType: data.sourceType,
            fileSize: data.fileSize,
            filePath: data.filePath,
            originalFilename: data.originalFilename
        })

        const wordCount = data.rawText.trim().split(/\s+/).length
        await this.ingestionRepository.update(ingestion.id!, {
            rawText: data.rawText,
            wordCount
        })

        return await this.processIngestion(ingestion.id!, data.rawText)
    }

    async processIngestion(id: string, rawText: string): Promise<{
        ingestion: Ingestion
        themes: Theme[]
        lesson: Lesson
        citations: SourceCitation[]
    }> {
        await this.ingestionRepository.update(id, {
            status: 'processing',
            processingStartedAt: new Date()
        })

        try {
            const themes = await this.handleThemes(id, rawText)

            const lesson = await this.generateLesson(id, rawText)

            const citations = await this.extractCitations(lesson.id, id, rawText, JSON.stringify(lesson))

            const ingestion = await this.ingestionRepository.update(id, {
                status: 'completed',
                processingCompletedAt: new Date()
            })

            return {
                ingestion: ingestion!,
                themes,
                lesson,
                citations
            }
        } catch (error) {
            await this.ingestionRepository.update(id, {
                status: 'failed',
                processingCompletedAt: new Date()
            })
            throw error
        }
    }

    private async handleThemes(id: string, rawText: string): Promise<Theme[]> {
        const themesData = await withRetry(() => this.aiService.extractThemes(rawText))

        await this.themeService.createThemesBulk(id, themesData.map(theme => ({
            title: theme.title,
            description: theme.description,
            confidenceScore: theme.confidenceScore
        })))

        return themesData
    }

    private async extractCitations(lessonId: string, ingestionId: string, rawText: string, lessonContent: string): Promise<SourceCitation[]> {
        const citationsData = await withRetry(() => this.aiService.extractCitations(rawText, lessonContent))

        const citations = await this.citationService.createCitationsBulk(
            lessonId,
            ingestionId,
            citationsData.map(citation => ({
                snippet: citation.snippet || '',
                pageNumber: citation.pageNumber || null,
                lineNumber: citation.lineNumber || null,
                relevanceScore: citation.relevanceScore || null
            }))
        )

        return citations
    }

    private async generateLesson(id: string, rawText: string): Promise<Lesson> {
        const lessonResult = await withRetry(() => this.aiService.generateLesson(rawText))

        const lessonContent: LessonContent = lessonResult.lesson as LessonContent

        const audioText = formatLessonForAudio(lessonContent)
        const wordCount = audioText.split(/\s+/).length

        console.log('Generating audio for lesson...')

        let audioUrl: string | null = null
        let audioDuration: number | null = null

        try {
            const audioBuffer = await withRetry(() => this.aiService.generateAudio(audioText))

            const ingestion = await this.ingestionRepository.findById(id)
            const filename = ingestion?.title || 'lesson'
            audioUrl = await this.storageService.uploadAudio(audioBuffer, filename)

            audioDuration = calculateAudioDuration(wordCount)

            console.log('Audio generated and uploaded:', audioUrl)
        } catch (error) {
            console.error('Audio generation failed, continuing without audio:', error)
            // Continue without audio 
        }

        const lesson = await this.lessonService.createLesson({
            ingestionId: id,
            content: JSON.stringify(lessonResult.lesson),
            tone: lessonResult.lesson.tone || 'professional',
            targetAudience: lessonResult.lesson.targetAudience || 'employee upskilling',
            wordCount,
            audioUrl,
            audioDuration,
            audioGeneratedAt: audioUrl ? new Date() : null
        })

        return lesson
    }

    private generateIngestionId(): string {
        return `ING-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
}