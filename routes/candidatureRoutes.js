import express from "express";
import { db } from "../server.js";

import jwt from "jwt-simple";

const router = express.Router();
const SECRET_KEY = "non_non_vous_navez_pas_dit_le_mot_magique";

const midlAuthenti = (req, res, next) => {
	const token = req.headers["authorization"];

	if (!token) return res.status(403).send("Token manquant.");

	try {
		const decoded = jwt.decode(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).send("Token invalide.");
	}
};

router.post("/:mission_id", midlAuthenti, (req, res) => {
	if (req.user.role !== "bénévole") {
		return res.status(403).send("Seuls les bénévoles peuvent postuler ");
	}

	const mission_id = req.params.mission_id;

	db.run(
		"INSERT INTO candidatures (mission_id, utilisateur_id) VALUES (?, ?)",
		[mission_id, req.user.id],
		function (err) {
			if (err)
				return res
					.status(500)
					.send("Erreur lors de l 'envoi de la candidature.");
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
			.send(
				"il n y a que  les associations qui peuvent consulter les candidatures."
			);
	}

	const mission_id = req.params.mission_id;

	db.all(
		"SELECT u.nom, u.email, c.status FROM candidatures c JOIN utilisateurs u ON c.utilisateur_id = u.id WHERE c.mission_id = ? AND c.status = 'en attente'",
		[mission_id],
		(err, rows) => {
			if (err)
				return res
					.status(500)
					.send("Erreur lors de la consultation des candidatures.");
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
		return res.status(400).send("Statut invalide.");
	}

	db.run(
		"UPDATE candidatures SET status = ? WHERE id = ?",
		[status, candidature_id],
		function (err) {
			if (err)
				return res
					.status(500)
					.send("Erreur lors de la mise à jour de la candidature.");
			res.status(200).send({ message: `Candidature ${status}` });
		}
	);
});

export default router;
