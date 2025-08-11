import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addPersonalDetail,
  getPersonalDetails,
  deletePersonalDetail,
  updatePersonalDetail,
} from "../controllers/personalDetailController.js";

const router = express.Router();

router.post("/", verifyToken, addPersonalDetail);
router.get("/", verifyToken, getPersonalDetails);
router.delete("/:id", verifyToken, deletePersonalDetail);
router.put("/:id", verifyToken, updatePersonalDetail);

export default router;
