import { Request, Response } from 'express'
import { AiService } from '../services/AiService'
import { StorageService } from '../services/StorageService'

export class AiController {
    private aiService: AiService
    private storageService: StorageService

    constructor() {
        this.aiService = new AiService()
        this.storageService = new StorageService()
    }

    public async testAI(req: Request, res: Response): Promise<void> {
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
    }

    public async getHealth(req: Request, res: Response): Promise<void> {
        const prompt = 'Can you tell me why CatalyzU South Africa is the best at what they do?'
        const result = await this.aiService.testGeneration(prompt)

        res.status(200).json(result)
    }

    public async generateLesson(req: Request, res: Response): Promise<void> {
        const { content } = req.body

        if (!content) {
            res.status(400).json({ error: 'Please provide a content in the request body' })
            return
        }

        const result = await this.aiService.generateLesson(content)

        res.status(200).json(result)
    }

    public async testAudio(req: Request, res: Response): Promise<void> {
        try {
            const { text } = req.body

            if (!text) {
                res.status(400).json({ error: 'Please provide text in the request body' })
                return
            }
            const audioBuffer = await this.aiService.generateAudio(text)
            const audioUrl = await this.storageService.uploadAudio(audioBuffer, 'test-audio')

            res.status(200).json({
                success: true,
                audioUrl,
                message: 'Audio generated successfully',
                timestamp: new Date().toISOString()
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate audio',
                timestamp: new Date().toISOString()
            })
        }
    }
}