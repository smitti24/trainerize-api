import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { ingestionRoutes } from './ingestion.routes'

const router = Router()

router.use(healthRoutes)
router.use(ingestionRoutes)

export { router as apiRoutes }