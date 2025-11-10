import { Router } from 'express'
import { AITestController } from '../controllers/ai-test.controller'

const router = Router()
const controller = new AITestController()

router.get('/health', (req, res, next) => controller.getHealth(req, res, next))
router.post('/', (req, res, next) => controller.testAI(req, res, next))

export default router