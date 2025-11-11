import { SourceCitationRepository } from '../repositories/SourceCitationRepository'
import { SourceCitation } from '../entities/SourceCitation.entity'

export class SourceCitationService {
    private sourceCitationRepository: SourceCitationRepository

    constructor(sourceCitationRepository: SourceCitationRepository) {
        this.sourceCitationRepository = sourceCitationRepository
    }

    async getAllCitations(): Promise<SourceCitation[]> {
        return await this.sourceCitationRepository.findAll()
    }

    async getCitationById(id: string): Promise<SourceCitation | null> {
        return await this.sourceCitationRepository.findById(id)
    }

    async createCitation(data: {
        lessonId: string
        ingestionId: string
        snippet: string
        pageNumber: number | null
        lineNumber: number | null
        relevanceScore: number | null
        orderIndex: number
    }): Promise<SourceCitation> {
        return await this.sourceCitationRepository.create(data)
    }

    async createCitationsBulk(
        lessonId: string,
        ingestionId: string,
        citations: Array<{
            snippet: string
            pageNumber: number | null
            lineNumber: number | null
            relevanceScore: number | null
        }>
    ): Promise<SourceCitation[]> {
        const createdCitations: SourceCitation[] = []

        for (let i = 0; i < citations.length; i++) {
            const citation = await this.createCitation({
                lessonId,
                ingestionId,
                snippet: citations[i].snippet,
                pageNumber: citations[i].pageNumber,
                lineNumber: citations[i].lineNumber,
                relevanceScore: citations[i].relevanceScore,
                orderIndex: i + 1,
            })
            createdCitations.push(citation)
        }

        return createdCitations
    }

    async updateCitation(
        id: string,
        data: Partial<SourceCitation>
    ): Promise<SourceCitation | null> {
        return await this.sourceCitationRepository.update(id, data)
    }

    async deleteCitation(id: string): Promise<boolean> {
        return await this.sourceCitationRepository.delete(id)
    }
}