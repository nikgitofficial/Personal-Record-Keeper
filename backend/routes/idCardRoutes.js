import express from "express";
import { addCard, getCards,deleteCard,updateCard  } from "../controllers/idCardController.js";
import authenticate from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add", authenticate , addCard);
router.get("/",authenticate , getCards);
router.delete("/:id", authenticate , deleteCard);
router.put("/:id",authenticate , updateCard);

export default router;
