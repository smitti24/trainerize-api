import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { Ingestion } from '../entities/Ingestion.entity'
import { IBaseRepository } from './BaseRepository'

export class IngestionRepository implements IBaseRepository<Ingestion> {
    private repository: Repository<Ingestion>

    constructor() {
        this.repository = AppDataSource.getRepository(Ingestion)
    }

    async findAll(): Promise<Ingestion[]> {
        return await this.repository.find({
            order: { createdAt: 'DESC' },
        })
    }

    async findById(id: string): Promise<Ingestion | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async create(data: Partial<Ingestion>): Promise<Ingestion> {
        const ingestion: Ingestion = this.repository.create(data)
        return await this.repository.save(ingestion)
    }

    async update(id: string, data: Partial<Ingestion>): Promise<Ingestion | null> {
        await this.repository.update(id, data)
        return await this.findById(id)
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return (result.affected ?? 0) > 0
    }
}
