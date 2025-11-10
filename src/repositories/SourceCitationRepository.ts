import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { SourceCitation } from '../entities/SourceCitation.entity'
import { IBaseRepository } from './BaseRepository'

export class SourceCitationRepository implements IBaseRepository<SourceCitation> {
    private repository: Repository<SourceCitation>

    constructor() {
        this.repository = AppDataSource.getRepository(SourceCitation)
    }

    async findAll(): Promise<SourceCitation[]> {
        return await this.repository.find({
            order: { orderIndex: 'ASC' },
        })
    }

    async findById(id: string): Promise<SourceCitation | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async create(data: Partial<SourceCitation>): Promise<SourceCitation> {
        const citation: SourceCitation = this.repository.create(data)
        return await this.repository.save(citation)
    }

    async update(id: string, data: Partial<SourceCitation>): Promise<SourceCitation | null> {
        await this.repository.update(id, data)
        return await this.findById(id)
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return (result.affected ?? 0) > 0
    }
}