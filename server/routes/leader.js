import express from "express";
import authMiddleware from '../middleware/authMiddlware.js';
const router = express.Router();

import { getLeaderSummary, compareDepartments } from "../controllers/leaderController.js";

router.get("/summary", authMiddleware ,getLeaderSummary);
router.get("/compare", authMiddleware, compareDepartments);

export default router;
