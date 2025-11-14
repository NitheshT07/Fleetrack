import express from "express";
import { getTracks, addTrack } from "../controllers/trackController.js";

const router = express.Router();

router.get("/", getTracks);
router.post("/", addTrack);

export default router;
