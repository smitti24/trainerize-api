import { App } from './app'
import { env } from './config/environment'

const app = new App()

const server = app.app.listen(env.PORT, () => {
    console.log(`Trainerize API running on port ${env.PORT}`)
    console.log(`API available at http://localhost:${env.PORT}${env.API_PREFIX}`)
    console.log(`Health check: http://localhost:${env.PORT}${env.API_PREFIX}/health`)
})

process.on('SIGTERM', () => {
    console.log('SIGTERM received')
    server.close(() => {
        console.log('Server closed')
    })
})