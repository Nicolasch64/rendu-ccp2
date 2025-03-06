import express from "express";
import { midlAuthenti } from "../middlewares/authMiddleware.js"; 
import {
	creerMission,
	obtenirMissions,
} from "../controllers/missionController.js"; 

const router = express.Router();


router.post("/", midlAuthenti, creerMission);


router.get("/", midlAuthenti, obtenirMissions);

export default router;
