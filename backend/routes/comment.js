import express from "express";
import { submitComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", submitComment);
router.get("/", getComments);

export default router;
