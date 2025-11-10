import { App } from './app'
import { AppDataSource, initializeDatabase } from './config/database'
import { env } from './config/environment'

async function startServer(): Promise<void> {
    try {
        console.log('Connecting to database...')
        await initializeDatabase()

        const app = new App()

        const server = app.app.listen(env.PORT, () => {
            console.log(`Trainerize API running on port ${env.PORT}`)
            console.log(`API available at http://localhost:${env.PORT}${env.API_PREFIX}`)
            console.log(`Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`)
            console.log(`AI Test endpoint: http://localhost:${env.PORT}${env.API_PREFIX}/ai-test/health`)
        })

        process.on('SIGTERM', async () => {
            console.log('SIGTERM received')

            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy()
                console.log('Database connection closed')
            }

            server.close(() => {
                console.log('Server closed')
                process.exit(0)
            })
        })

    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()   