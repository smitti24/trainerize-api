import { Writable } from 'stream'
import * as wav from 'wav'

export function convertPcmToWav(
    pcmData: Buffer,
    channels: number = 1,
    sampleRate: number = 24000,
    bitDepth: number = 16
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = []

        const writer = new wav.Writer({
            channels,
            sampleRate,
            bitDepth
        })

        // Collect all chunks
        writer.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
        })

        writer.on('finish', () => {
            resolve(Buffer.concat(chunks))
        })

        writer.on('error', (error: Error) => {
            reject(error)
        })

        // Write PCM data and end the stream
        writer.write(pcmData)
        writer.end()
    })
}

