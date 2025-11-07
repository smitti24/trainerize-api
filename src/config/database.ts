import { DataSource } from 'typeorm'
import { env } from './environment'

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: env.DATABASE_URL,
    synchronize: false,
    logging: env.NODE_ENV === 'development',
    entities: ['src/entities/**/*.ts'],
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