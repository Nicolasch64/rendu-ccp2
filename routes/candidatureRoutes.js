import express from "express";
import dotenv from "dotenv";
import { db } from "../server.js";
import jwt from "jsonwebtoken";

const router = express.Router();
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const midlAuthenti = (req, res, next) => {
	const token = req.headers["authorization"];

	if (!token) return res.status(403).send("Token manquant.");

	const cleanToken = token.replace("Bearer ", "");

	try {
		const decoded = jwt.verify(cleanToken, SECRET_KEY);
		req.user = decoded;
		console.log(decoded);
		next();
	} catch (err) {
		console.log("Erreur lors de la vérification du token : ", err);
		return res.status(401).send("Token invalide.");
	}
};

router.post("/:mission_id", midlAuthenti, (req, res) => {
	if (req.user.role !== "bénévole") {
		return res.status(403).send("Seuls les bénévoles peuvent postuler.");
	}

	const mission_id = req.params.mission_id;

	db.run(
		"INSERT INTO candidatures (mission_id, utilisateur_id) VALUES (?, ?)",
		[mission_id, req.user.id],
		function (err) {
			if (err) {
				console.error("Erreur lors de l'envoi de la candidature : ", err);
				return res
					.status(500)
					.send("Erreur lors de l'envoi de la candidature.");
			}
			res
				.status(201)
				.send({ message: "Candidature envoyée, statut en attente." });
		}
	);
});

router.get("/mission/:mission_id", midlAuthenti, (req, res) => {
	if (req.user.role !== "association") {
		return res
			.status(403)
			.send("Seules les associations peuvent consulter les candidatures.");
	}

	const mission_id = req.params.mission_id;

	db.all(
		"SELECT u.nom, u.email, c.status FROM candidatures c JOIN utilisateurs u ON c.utilisateur_id = u.id WHERE c.mission_id = ? AND c.status = 'en attente'",
		[mission_id],
		(err, rows) => {
			if (err) {
				console.error(
					"Erreur lors de la consultation des candidatures : ",
					err
				);
				return res
					.status(500)
					.send("Erreur lors de la consultation des candidatures.");
			}
			res.status(200).send(rows);
		}
	);
});

router.put("/accept/:candidature_id", midlAuthenti, (req, res) => {
	if (req.user.role !== "association") {
		return res
			.status(403)
			.send(
				"Seules les associations peuvent accepter ou refuser des candidatures."
			);
	}

	const candidature_id = req.params.candidature_id;
	const { status } = req.body;

	if (status !== "Acceptée" && status !== "Refusée") {
		return res
			.status(400)
			.send("Statut invalide. Utilisez 'Acceptée' ou 'Refusée'.");
	}

	db.run(
		"UPDATE candidatures SET status = ? WHERE id = ?",
		[status, candidature_id],
		function (err) {
			if (err) {
				console.error(
					"Erreur lors de la mise à jour de la candidature : ",
					err
				);
				return res
					.status(500)
					.send("Erreur lors de la mise à jour de la candidature.");
			}
			res.status(200).send({ message: `Candidature ${status}` });
		}
	);
});

export default router;
