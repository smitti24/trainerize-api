import { Router } from 'express'
import { IngestionController } from '../controllers/ingestion.controller'
import multer from 'multer'

const router = Router()
const ingestionController = new IngestionController()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'))
        }
    }
})

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

router.post('/process', (req, res, next) =>
    ingestionController.processIngestion(req, res, next)
)

router.post('/upload', upload.single('file'), (req, res, next) =>
    ingestionController.uploadAndProcess(req, res, next)
)

export { router as ingestionRoutes }