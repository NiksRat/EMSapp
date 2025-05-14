import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave } from '../controllers/leaveController.js'
import { upload } from '../controllers/upload.js'
import { analyzeMedicalNote } from '../controllers/upload.js'

const router = express.Router()

router.post('/add', upload.single('image'), authMiddleware, addLeave)
router.get('/detail/:id', authMiddleware, getLeaveDetail)
router.get('/:id/:role', authMiddleware, getLeave)
router.get('/', authMiddleware, getLeaves)
router.put('/:id', authMiddleware, updateLeave)

router.post('/ai/analyze-medical-note', upload.single('image'), analyzeMedicalNote);


export default router