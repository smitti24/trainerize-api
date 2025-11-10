import { Repository } from 'typeorm'
import { AppDataSource } from '../config/database'
import { Lesson } from '../entities/Lesson.entity'
import { IBaseRepository } from './BaseRepository'

export class LessonRepository implements IBaseRepository<Lesson> {
    private repository: Repository<Lesson>

    constructor() {
        this.repository = AppDataSource.getRepository(Lesson)
    }

    async findAll(): Promise<Lesson[]> {
        return await this.repository.find({
            order: { createdAt: 'DESC' },
        })
    }

    async findById(id: string): Promise<Lesson | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async create(data: Partial<Lesson>): Promise<Lesson> {
        const lesson: Lesson = this.repository.create(data)
        return await this.repository.save(lesson)
    }

    async update(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
        await this.repository.update(id, data)
        return await this.findById(id)
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return (result.affected ?? 0) > 0
    }
}