import { Request, Response } from 'express'
import { ErrorResponse } from '../types/api'

export class ErrorMiddleware {
    public static handle(
        error: Error,
        req: Request,
        res: Response,
    ): void {
        const errorResponse: ErrorResponse = {
            error: error.name || 'InternalServerError',
            message: error.message || 'Something went wrong',
            timestamp: new Date().toISOString(),
        }

        console.error('Error:', error)
        res.status(500).json(errorResponse)
    }

    public static notFound(req: Request, res: Response): void {
        const errorResponse: ErrorResponse = {
            error: 'NotFound',
            message: `Route ${req.originalUrl} not found`,
            timestamp: new Date().toISOString(),
        }

        res.status(404).json(errorResponse)
    }
}