import { LessonRepository } from '../repositories/LessonRepository'
import { Lesson } from '../entities/Lesson.entity'

export class LessonService {
    private lessonRepository: LessonRepository

    constructor(lessonRepository: LessonRepository) {
        this.lessonRepository = lessonRepository
    }

    async getAllLessons(): Promise<Lesson[]> {
        return await this.lessonRepository.findAll()
    }

    async getLessonById(id: string): Promise<Lesson | null> {
        return await this.lessonRepository.findById(id)
    }

    async createLesson(data: {
        ingestionId: string
        content: string
        tone?: string
        targetAudience?: string
        wordCount?: number
        audioUrl?: string | null
        audioDuration?: number | null
        audioGeneratedAt?: Date | null
    }): Promise<Lesson> {
        const wordCount: number = data.wordCount || this.countWords(data.content)

        const lessonData: Partial<Lesson> = {
            ingestionId: data.ingestionId,
            content: data.content,
            wordCount,
            tone: data.tone || 'professional',
            targetAudience: data.targetAudience || 'employee upskilling',
            audioUrl: data.audioUrl || null,
            audioDuration: data.audioDuration || null,
            audioGeneratedAt: data.audioGeneratedAt || null,
        }

        return await this.lessonRepository.create(lessonData)
    }

    async updateLesson(
        id: string,
        data: Partial<Lesson>
    ): Promise<Lesson | null> {
        if (data.content) {
            data.wordCount = this.countWords(data.content)
        }

        return await this.lessonRepository.update(id, data)
    }

    async attachAudio(
        id: string,
        audioUrl: string,
        audioDuration: number
    ): Promise<Lesson | null> {
        return await this.lessonRepository.update(id, {
            audioUrl,
            audioDuration,
            audioGeneratedAt: new Date(),
        })
    }

    async deleteLesson(id: string): Promise<boolean> {
        return await this.lessonRepository.delete(id)
    }

    private countWords(text: string): number {
        return text.trim().split(/\s+/).length
    }
}