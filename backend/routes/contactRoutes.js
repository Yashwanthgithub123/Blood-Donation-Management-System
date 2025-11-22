import express from "express";
import { addMessage, getMessages, deleteMessage } from "../controllers/contactController.js";

const router = express.Router();

router.post("/add", addMessage);
router.get("/", getMessages);
router.delete("/:id", deleteMessage);

export default router;
