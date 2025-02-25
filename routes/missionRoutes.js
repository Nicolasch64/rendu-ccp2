import express from "express";
import jwt from "jwt-simple";
import { db } from "../server.js";

const router = express.Router();
const SECRET_KEY = "non_non_vous_navez_pas_dit_le_mot_magique";

const midlAuthenti = (req, res, next) => {
	const token = req.headers["authorization"];

	if (!token) return res.status(403).send("Il n y a pas de token");

	try {
		const decoded = jwt.decode(token, SECRET_KEY);
		req.user = decoded;

		next();
	} catch (err) {
		return res.status(401).send("il marche pas ce token !!");
	}
};

router.post("/mission", midlAuthenti, (req, res) => {
	if (req.user.role !== "association") {
		return res
			.status(403)
			.send("les missions ne peuvent etre créer que par les associations");
	}
	const { titre, description, date_mission } = req.body;

	db.run(
		"INSERT INTO missions (titre,description,date_mission,association_id)VALUES(?,?,?,?)",
		[titre, description, date_mission, req.user.id],
		function (err) {
			if (err)
				return res
					.status(500)
					.send("probleme lors de la création de la mission");
			res.status(201).send({ message: "mission crée !!!" });
		}
	);
});

router.get("/", midlAuthenti, (req, res) => {
	db.all(
		"SELECT * FROM missions WHERE date_mission > CURRENT_DATE",
		[],
		(err, rows) => {
			if (err) return res.status(500).send("Erreur serveur.");
			res.status(200).send(rows);
		}
	);
});

export default router;
