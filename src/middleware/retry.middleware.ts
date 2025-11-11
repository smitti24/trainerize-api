import { Request, Response, NextFunction } from 'express'

const sleep = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms))

export function withRetry(
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
    maxRetries: number = 3,
    delayMs: number = 1000
) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let lastError: Error | null = null

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                await handler(req, res, next)
                return
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error))
                
                if (attempt < maxRetries) {
                    console.log(`Request failed, retry ${attempt + 1}/${maxRetries} after ${delayMs}ms`)
                    await sleep(delayMs)
                } else {
                    console.error(`Request failed after ${maxRetries} retries`)
                }
            }
        }

        next(lastError)
    }
}
