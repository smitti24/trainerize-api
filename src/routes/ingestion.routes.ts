import { Router } from 'express'
import { IngestionController } from '../controllers/ingestion.controller'

const router = Router()
const ingestionController = new IngestionController()

router.get('/ingestions/health', (req, res, next) => 
    ingestionController.getHealth(req, res, next)
)

router.get('/ingestions', (req, res, next) => 
    ingestionController.getAllIngestions(req, res, next)
)

router.get('/ingestions/:id', (req, res, next) => 
    ingestionController.getIngestionById(req, res, next)
)

router.post('/ingestions', (req, res, next) => 
    ingestionController.createIngestion(req, res, next)
)

router.patch('/ingestions/:id/start-processing', (req, res, next) => 
    ingestionController.startProcessing(req, res, next)
)

router.patch('/ingestions/:id/complete-processing', (req, res, next) => 
    ingestionController.completeProcessing(req, res, next)
)

router.patch('/ingestions/:id/fail-processing', (req, res, next) => 
    ingestionController.failProcessing(req, res, next)
)

router.delete('/ingestions/:id', (req, res, next) => 
    ingestionController.deleteIngestion(req, res, next)
)

export { router as ingestionRoutes }