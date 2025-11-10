import { Router } from 'express'
import { AiController } from '../controllers/ai.controller'

const router = Router()
const controller = new AiController()

router.get('/health', (req, res, next) => controller.getHealth(req, res, next))
router.post('/', (req, res, next) => controller.testAI(req, res, next))

export { router as aiRoutes }