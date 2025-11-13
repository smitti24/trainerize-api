import mammoth from 'mammoth'
import { PDFExtract } from 'pdf.js-extract'

export class TextExtractor {

    static async extractFromPDF(buffer: Buffer): Promise<string> {
        try {
            const pdfExtract = new PDFExtract()
            const data = await pdfExtract.extractBuffer(buffer)

            const text = data.pages
                .map(page => page.content.map(item => item.str).join(' '))
                .join('\n')

            return text.trim()
        } catch (error) {
            throw new Error(`Failed to extract text from PDF: ${error}`)
        }
    }

    static async extractFromDOCX(buffer: Buffer): Promise<string> {
        try {
            const result = await mammoth.extractRawText({ buffer })
            return result.value.trim()
        } catch (error) {
            throw new Error(`Failed to extract text from DOCX: ${error}`)
        }
    }

    static async extractText(buffer: Buffer, fileType: 'pdf' | 'docx'): Promise<string> {
        switch (fileType) {
            case 'pdf':
                return await this.extractFromPDF(buffer)
            case 'docx':
                return await this.extractFromDOCX(buffer)
            default:
                throw new Error(`Unsupported file type: ${fileType}`)
        }
    }

    static async extractTextWithMetadata(buffer: Buffer, fileType: 'pdf' | 'docx'): Promise<{
        text: string
        wordCount: number
        characterCount: number
    }> {
        const text = await this.extractText(buffer, fileType)
        const wordCount = text.trim().split(/\s+/).length
        const characterCount = text.length

        return {
            text,
            wordCount,
            characterCount
        }
    }
}