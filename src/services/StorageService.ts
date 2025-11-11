import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { env } from '../config/environment'

export class StorageService {
    private supabase: SupabaseClient
    private bucketName: string = 'lessons-audio'

    constructor() {
        this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
    }

    async uploadAudio(
        audioBuffer: Buffer,
        filename: string,
        contentType: string = 'audio/wav'
    ): Promise<string> {
        try {
            const sanitizedFilename = this.sanitizeFilename(filename)
            const timestamp = Date.now()
            const path = `${timestamp}-${sanitizedFilename}.wav`

            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(path, audioBuffer, {
                    contentType,
                    upsert: false,
                })

            if (error) {
                console.error('Supabase upload error:', error)
                throw new Error(`Failed to upload audio: ${error.message}`)
            }

            const { data: publicUrlData } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(path)

            return publicUrlData.publicUrl
        } catch (error) {
            console.error('Storage upload error:', error)
            throw error
        }
    }

    async deleteAudio(fileUrl: string): Promise<boolean> {
        try {
            const path = this.extractPathFromUrl(fileUrl)

            const { error } = await this.supabase.storage
                .from(this.bucketName)
                .remove([path])

            if (error) {
                console.error('Supabase delete error:', error)
                return false
            }

            return true
        } catch (error) {
            console.error('Storage delete error:', error)
            return false
        }
    }

    private sanitizeFilename(filename: string): string {
        return filename
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100)
    }

    private extractPathFromUrl(url: string): string {
        const parts = url.split(`${this.bucketName}/`)
        return parts[parts.length - 1]
    }
}

