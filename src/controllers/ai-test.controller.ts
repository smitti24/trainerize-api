import { Request, Response, NextFunction } from 'express'
import { AITestService } from '../services/AITestService'

export class AITestController {
    private aiTestService: AITestService

    constructor() {
        this.aiTestService = new AITestService()
    }

    public async testAI(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { prompt } = req.body

            if (!prompt) {
                res.status(400).json({ error: 'Please provide a prompt in the request body' })
                return
            }

            const result = await this.aiTestService.testGeneration(prompt)

            res.status(200).json({
                success: true,
                prompt: prompt,
                response: result,
                timestamp: new Date().toISOString()
            })
        } catch (error) {
            next(error)
        }
    }

    public async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.status(200).json({ 
                message: 'AI Test endpoint is healthy',
                model: 'gemini-1.5-flash'
            })
        } catch (error) {
            next(error)
        }
    }
}