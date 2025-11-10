import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { Theme } from '../entities/Theme.entity'
import { IBaseRepository } from './BaseRepository'

export class ThemeRepository implements IBaseRepository<Theme> {
    private repository: Repository<Theme>

    constructor() {
        this.repository = AppDataSource.getRepository(Theme)
    }

    async findAll(): Promise<Theme[]> {
        return await this.repository.find({
            order: { orderIndex: 'ASC' },
        })
    }

    async findById(id: string): Promise<Theme | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async create(data: Partial<Theme>): Promise<Theme> {
        const theme: Theme = this.repository.create(data)
        return await this.repository.save(theme)
    }

    async update(id: string, data: Partial<Theme>): Promise<Theme | null> {
        await this.repository.update(id, data)
        return await this.findById(id)
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return (result.affected ?? 0) > 0
    }
}