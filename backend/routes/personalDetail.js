// backend/routes/personalDetailRoutes.js
import express from "express";
import {
  createPersonalDetail,
  getPersonalDetails,
  updatePersonalDetail,
  deletePersonalDetail,
} from "../controllers/personalDetailController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // Protect all routes below

router.post("/", createPersonalDetail);
router.get("/", getPersonalDetails);
router.put("/:id", updatePersonalDetail);
router.delete("/:id", deletePersonalDetail);

export default router;
