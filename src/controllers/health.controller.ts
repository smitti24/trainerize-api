import { Request, Response } from 'express'
import { HealthResponse } from '../types/api'

export class HealthController {
    public static getHealth(req: Request, res: Response): void {
        const healthResponse: HealthResponse = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            service: 'Trainerize API',
        }

        res.status(200).json(healthResponse)
    }
}