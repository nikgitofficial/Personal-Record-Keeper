import express from "express";
import { addCard, getCards,deleteCard,updateCard  } from "../controllers/idCardController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addCard);
router.get("/", verifyToken, getCards);
router.delete("/:id", verifyToken, deleteCard);
router.put("/:id", verifyToken, updateCard);

export default router;
