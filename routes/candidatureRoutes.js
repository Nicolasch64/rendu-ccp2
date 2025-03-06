import express from "express";
import {
	postulerMission,
	consulterCandidatures,
	accepterRefuserCandidature,
} from "../controllers/candidatureController.js";
import { midlAuthenti } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:mission_id", midlAuthenti, postulerMission);
router.get("/mission/:mission_id", midlAuthenti, consulterCandidatures);
router.put("/accept/:candidature_id", midlAuthenti, accepterRefuserCandidature);

export default router;
