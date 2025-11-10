import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { env } from '../config/environment'

export class AITestService {
    private genAI: GoogleGenerativeAI
    private model: GenerativeModel

    constructor() {
        this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    }

    async testGeneration(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error('AI Error:', error)
            throw new Error('Failed to generate AI response')
        }
    }
}