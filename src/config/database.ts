import { DataSource } from 'typeorm'
import { env } from './environment'
import { Ingestion, Theme, Lesson, SourceCitation } from '../entities'

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: env.DATABASE_URL,
    synchronize: false,
    logging: env.NODE_ENV === 'development',
    entities: [Ingestion, Theme, Lesson, SourceCitation],
    migrations: ['src/migrations/**/*.ts'],
    ssl: {
        rejectUnauthorized: false,
    },
})

export const initializeDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize()
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Database connection failed:', error)
        throw error
    }
}