import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createPersonalDetail,
  getPersonalDetails,
  updatePersonalDetail,
  deletePersonalDetail,
} from "../controllers/personalDetailController.js";

const router = express.Router();

router.use(verifyToken); // ✅ Protect all routes

router.get("/", getPersonalDetails);
router.post("/", createPersonalDetail);
router.put("/:id", updatePersonalDetail);
router.delete("/:id", deletePersonalDetail);

export default router;
