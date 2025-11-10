import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { ingestionRoutes } from './ingestion.routes'
import { aiRoutes } from './ai.routes'

const router = Router()

router.use(healthRoutes)
router.use('/ingestions', ingestionRoutes)
router.use('/ai', aiRoutes)

export { router as apiRoutes }