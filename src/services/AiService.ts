import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { GoogleGenAI } from '@google/genai'
import { env } from '../config/environment'
import { Theme } from '../entities/Theme.entity'
import { AI_PROMPTS, fillPromptTemplate } from '../config/prompts/prompts'
import { Lesson } from '../entities/Lesson.entity'
import { SourceCitation } from '../entities/SourceCitation.entity'
import { convertPcmToWav } from '../utils/audioConverter'

export class AiService {
    private genAI: GoogleGenerativeAI
    private audioAI: GoogleGenAI
    private model: GenerativeModel

    constructor() {
        this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
        this.audioAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
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
                    maxOutputTokens: 8192,
                },
            })

            let text = result.response.text().trim()

            text = text
                .replace(/```json\n?/gi, '')
                .replace(/```\n?/g, '')
                .trim()

            if (!text.startsWith('[')) {
                const jsonMatch = text.match(/\[[\s\S]*\]/)
                if (jsonMatch) text = jsonMatch[0]
            }

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

    async generateLesson(prompt: string): Promise<{ success: boolean, lesson: Partial<Lesson>, timestamp: string }> {
        try {
            const result = await this.model.generateContent(
                fillPromptTemplate(AI_PROMPTS.GENERATE_LESSON, { content: prompt })
            )

            let text = result.response.text()

            text = text.replace(/\n?/gi, '').replace(/```/g, '').trim()
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) text = jsonMatch[0]

            const lessonData: Partial<Lesson> = JSON.parse(text)

            return {
                success: true,
                lesson: lessonData,
                timestamp: new Date().toISOString()
            }
        }
        catch (error) {
            console.error('AI Error:', error)
            throw new Error('Failed to generate lesson')
        }
    }

    async extractCitations(
        sourceContent: string,
        lessonContent: string
    ): Promise<Array<Partial<SourceCitation>>> {
        const prompt: string = fillPromptTemplate(AI_PROMPTS.EXTRACT_CITATIONS, {
            content: sourceContent,
            lesson: lessonContent
        })

        try {
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    topP: 0.9,
                    topK: 20,
                    maxOutputTokens: 8192,
                },
            })

            let text: string = result.response.text().trim()

            text = text
                .replace(/```json\n?/gi, '')
                .replace(/```\n?/g, '')
                .trim()

            if (!text.startsWith('[')) {
                const jsonMatch = text.match(/\[[\s\S]*\]/)
                if (jsonMatch) text = jsonMatch[0]
            }

            console.log('Cleaned Citations JSON:', text.substring(0, 200))

            const citations: Array<Partial<SourceCitation>> = JSON.parse(text)

            if (!Array.isArray(citations) || citations.length < 2 || citations.length > 3) {
                throw new Error('Invalid number of citations returned (expected 2-3)')
            }

            return citations

        } catch (error) {
            console.error('Citation extraction error:', error)
            throw new Error('Failed to extract citations from content')
        }
    }

    async generateAudio(text: string): Promise<Buffer> {
        try {
            const response = await this.audioAI.models.generateContent({
                model: 'gemini-2.5-flash-preview-tts',
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' }
                        }
                    }
                }
            })

            const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

            if (!data) {
                throw new Error('No audio data returned from Gemini API')
            }

            const pcmBuffer = Buffer.from(data, 'base64')
            const wavBuffer = await convertPcmToWav(pcmBuffer, 1, 24000, 16)

            return wavBuffer
        } catch (error) {
            console.error('Audio generation error:', error)
            throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}