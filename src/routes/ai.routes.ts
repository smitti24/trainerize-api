import { Router } from 'express'
import { AiController } from '../controllers/ai.controller'
import { withRetry } from '../middleware/retry.middleware'

const router = Router()
const controller = new AiController()

router.get('/health', withRetry((req, res) => controller.getHealth(req, res)))
router.post('/', withRetry((req, res) => controller.testAI(req, res)))
router.post('/generate-lesson', withRetry((req, res) => controller.generateLesson(req, res)))

export { router as aiRoutes }