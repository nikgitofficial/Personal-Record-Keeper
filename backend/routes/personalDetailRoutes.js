import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  addPersonalDetail,
  getPersonalDetails,
  deletePersonalDetail,
  updatePersonalDetail,
} from "../controllers/personalDetailController.js";

const router = express.Router();

router.post("/", authenticate, addPersonalDetail);
router.get("/", authenticate, getPersonalDetails);
router.delete("/:id", authenticate, deletePersonalDetail);
router.put("/:id", authenticate, updatePersonalDetail);

export default router;
