import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { env } from '../config/environment'
import { Theme } from '../entities/Theme.entity'
import { AI_PROMPTS, fillPromptTemplate } from '../config/prompts/prompts'

export class AiService {
    private genAI: GoogleGenerativeAI
    private model: GenerativeModel

    constructor() {
        this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    }

    async testGeneration(prompt: string): Promise<{ success: boolean, prompt: string, response: string, themes: Theme[], timestamp: string }> {
        try {
            const result = await this.model.generateContent(prompt)

            console.log('Result:', result)

            // extract the themes from the result
            const themes = await this.extractThemes(result.response.text())

            return {
                success: true,
                prompt: prompt,
                response: result.response.text(),
                themes: themes,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('AI Error:', error)
            throw new Error('Failed to generate AI response')
        }
    }

    async extractThemes(content: string): Promise<Theme[]> {
        const prompt = fillPromptTemplate(AI_PROMPTS.EXTRACT_THEMES, { content })

        try {
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.1,        // Lower = more consistent
                    topP: 0.9,              // More focused
                    topK: 20,               // Limit token choices
                    maxOutputTokens: 2048,
                },
            })

            let text = result.response.text().trim()

            text = text
                .replace(/\n?/gi, '')
                .replace(/```\n?/g, '')
                .replace(/^[\s\n]+|[\s\n]+$/g, '')
                .trim()

            console.log('Cleaned JSON:', text.substring(0, 200))

            const themes: Theme[] = JSON.parse(text)

            if (!Array.isArray(themes) || themes.length < 3 || themes.length > 7) {
                throw new Error('Invalid number of themes returned')
            }

            return themes

        } catch (error) {
            console.error('Theme extraction error:', error)
            throw new Error('Failed to extract themes from content')
        }
    }
}