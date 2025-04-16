import express from "express";
const router = express.Router();

import { getLeaderSummary, compareDepartments } from "../controllers/leaderController.js";

router.get("/summary", getLeaderSummary);
router.get("/compare", compareDepartments);

export default router;
