import express from "express";
import { midlAuthenti } from "../middlewares/authMiddleware.js";
import {
	inscription,
	connexion,
	profil,
} from "../controllers/utilisateurController.js";

const router = express.Router();

router.post("/inscription", inscription);

router.post("/connexion", connexion);

router.get("/profil", midlAuthenti, profil);

export default router;
