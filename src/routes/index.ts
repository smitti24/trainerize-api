import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { ingestionRoutes } from './ingestion.routes'
import aiTestRoutes from './ai-test.routes'

const router = Router()

router.use(healthRoutes)
router.use(ingestionRoutes)
router.use('/ai-test', aiTestRoutes)

export { router as apiRoutes }