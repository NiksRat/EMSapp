import express from 'express'
import authMiddleware from '../middleware/authMiddlware.js'
import { getSummary, getLeaders, addLeader } from '../controllers/dashboardController.js';

const router = express.Router()

router.get('/summary', authMiddleware, getSummary)
router.post("/", authMiddleware, addLeader);
router.get("/leaders", getLeaders);

export default router;