import express from 'express'
import path from 'path'
import authMiddleware from '../middleware/authMiddlware.js'
import { addSalary, getSalary, salaryReport} from '../controllers/salaryController.js'

const router = express.Router()

router.post('/add', authMiddleware, addSalary)
router.get('/:id/:role', authMiddleware, getSalary) 
router.get('/report', authMiddleware, salaryReport)

export default router