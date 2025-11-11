import { Router } from 'express'
import { AiController } from '../controllers/ai.controller'
import { withRetryMiddleware } from '../middleware/retry.middleware'

const router = Router()
const controller = new AiController()

router.get('/health', withRetryMiddleware((req, res) => controller.getHealth(req, res)))
router.post('/', withRetryMiddleware((req, res) => controller.testAI(req, res)))
router.post('/generate-lesson', withRetryMiddleware((req, res) => controller.generateLesson(req, res)))
router.post('/test-audio', withRetryMiddleware((req, res) => controller.testAudio(req, res)))

export { router as aiRoutes }