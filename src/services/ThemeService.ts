import { ThemeRepository } from '../repositories/ThemeRepository'
import { Theme } from '../entities/Theme.entity'

export class ThemeService {
    private themeRepository: ThemeRepository

    constructor(themeRepository: ThemeRepository) {
        this.themeRepository = themeRepository
    }

    async getAllThemes(): Promise<Theme[]> {
        return await this.themeRepository.findAll()
    }

    async getThemeById(id: string): Promise<Theme | null> {
        return await this.themeRepository.findById(id)
    }

    async createTheme(data: {
        ingestionId: string
        title: string
        description: string | null
        orderIndex: number
        confidenceScore: number | null
    }): Promise<Theme> {
        return await this.themeRepository.create(data)
    }

    async createThemesBulk(
        ingestionId: string,
        themes: Array<{
            title: string
            description: string | null
            confidenceScore: number | null
        }>
    ): Promise<Theme[]> {
        const createdThemes: Theme[] = []

        for (let i = 0; i < themes.length; i++) {
            const theme = await this.createTheme({
                ingestionId,
                title: themes[i].title,
                description: themes[i].description,
                orderIndex: i + 1,
                confidenceScore: themes[i].confidenceScore,
            })
            createdThemes.push(theme)
        }

        return createdThemes
    }

    async updateTheme(
        id: string,
        data: Partial<Theme>
    ): Promise<Theme | null> {
        return await this.themeRepository.update(id, data)
    }

    async deleteTheme(id: string): Promise<boolean> {
        return await this.themeRepository.delete(id)
    }
}