import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { apiRoutes } from './routes'
import { ErrorMiddleware } from './middleware/error.middleware'
import { env } from './config/environment'

export class App {
    public app: Application

    constructor() {
        this.app = express()
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeErrorHandling()
    }

    private initializeMiddlewares(): void {
        this.app.use(helmet())
        this.app.use(cors())
        this.app.use(morgan('combined'))
        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(express.urlencoded({ extended: true }))
    }

    private initializeRoutes(): void {
        this.app.use(env.API_PREFIX, apiRoutes)
    }

    private initializeErrorHandling(): void {
        this.app.use(ErrorMiddleware.notFound)
        this.app.use(ErrorMiddleware.handle)
    }
}