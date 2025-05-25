import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import { addAccountant, upload, getAccountants, getAccountantSummary, getSalarySummary } from "../controllers/accountant.js";
import { getLeaderSummary, compareDepartments } from "../controllers/leaderController.js";

const router = express.Router();

router.post("/add", authMiddleware, upload.single("image"), addAccountant);
router.get("/summary", authMiddleware, getAccountantSummary);
router.get("/salary-summary", authMiddleware, getSalarySummary);
router.get("/compare", authMiddleware, compareDepartments);

export default router;