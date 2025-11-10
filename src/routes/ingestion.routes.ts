import { Router } from 'express'
import { IngestionController } from '../controllers/ingestion.controller'

const router = Router()
const ingestionController = new IngestionController()

router.get('/health', (req, res, next) =>
    ingestionController.getHealth(req, res, next)
)

router.get('/', (req, res, next) =>
    ingestionController.getAllIngestions(req, res, next)
)

router.get('/:id', (req, res, next) =>
    ingestionController.getIngestionById(req, res, next)
)

router.post('/', (req, res, next) =>
    ingestionController.createIngestion(req, res, next)
)

router.patch('/:id/start-processing', (req, res, next) =>
    ingestionController.startProcessing(req, res, next)
)

router.patch('/:id/complete-processing', (req, res, next) =>
    ingestionController.completeProcessing(req, res, next)
)

router.patch('/:id/fail-processing', (req, res, next) =>
    ingestionController.failProcessing(req, res, next)
)

router.delete('/:id', (req, res, next) =>
    ingestionController.deleteIngestion(req, res, next)
)

export { router as ingestionRoutes }