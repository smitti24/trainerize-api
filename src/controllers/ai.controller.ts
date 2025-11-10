import { Request, Response, NextFunction } from 'express'
import { AiService } from '../services/AiService'

export class AiController {
    private aiService: AiService

    constructor() {
        this.aiService = new AiService()
    }

    public async testAI(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { prompt } = req.body

            if (!prompt) {
                res.status(400).json({ error: 'Please provide a prompt in the request body' })
                return
            }

            const result = await this.aiService.testGeneration(prompt)

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
            const prompt = 'Can you tell me why CatalyzeU South Africa is the best at what they do?'
            const result = await this.aiService.testGeneration(prompt)

            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}