import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import { db } from "../server.js";

const router = express.Router();

const SECRET_KEY = "non_non_vous_navez_pas_dit_le_mot_magique";

router.post("/inscription", (req, res) => {
	const { nom, email, role, motdepasse } = req.body;

	console.log("Données reçues pour l'inscription : ", {
		nom,
		email,
		role,
		motdepasse,
	});

	db.get("SELECT * FROM utilisateurs WHERE email = ?", [email], (err, row) => {
		if (err) {
			console.error(
				"Erreur de la base de données lors de la vérification de l'email : ",
				err
			);
			return res.status(500).send("Erreur serveur.");
		}
		if (row) {
			console.log("Cet email est déjà utilisé.");
			return res.status(400).send("Cet email est déjà utilisé.");
		}

		const hashedmotdepasse = bcrypt.hashSync(motdepasse, 8);
		console.log("Mot de passe haché :", hashedmotdepasse);

		db.run(
			"INSERT INTO utilisateurs (nom, email, role, motdepasse) VALUES (?, ?, ?, ?)",
			[nom, email, role, hashedmotdepasse],
			function (err) {
				if (err) {
					console.error(
						"Erreur lors de l'insertion dans la base de données : ",
						err
					);
					return res.status(500).send("Erreur lors de l'inscription.");
				}

				console.log("Inscription réussie !");
				res.status(201).send({ message: "Inscription réussie !" });
			}
		);
	});
});

router.post("/connexion", (req, res) => {
	const { email, motdepasse } = req.body;

	db.get("SELECT * FROM utilisateurs WHERE email = ?", [email], (err, row) => {
		if (err) return res.status(500).send("Erreur serveur.");
		if (!row) return res.status(404).send("Utilisateur non trouvé.");

		const motdepasseOk = bcrypt.compareSync(motdepasse, row.motdepasse);
		if (!motdepasseOk)
			return res.status(401).send("NON NON ce n'est pas le bon mot de passe");

		const payload = { id: row.id, role: row.role };
		const token = jwt.encode(payload, SECRET_KEY);

		res.status(200).send({ message: "Connexion réussie", token });
	});
});

export default router;
