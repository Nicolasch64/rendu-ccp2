import bcrypt from "bcryptjs";
import jwt from "jwt-simple";
import { db } from "../server.js";

const SECRET_KEY = process.env.SECRET_KEY;

const inscription = (req, res) => {
	const { nom, email, role, motdepasse } = req.body;

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
};

const connexion = (req, res) => {
	const { email, motdepasse } = req.body;

	db.get("SELECT * FROM utilisateurs WHERE email = ?", [email], (err, row) => {
		if (err) return res.status(500).send("Erreur serveur.");
		if (!row) return res.status(404).send("Utilisateur non trouvé.");

		const motdepasseIsValid = bcrypt.compareSync(motdepasse, row.motdepasse);
		if (!motdepasseIsValid)
			return res.status(401).send("Mot de passe incorrect.");

		const verif = { id: row.id, role: row.role };
		const token = jwt.encode(verif, SECRET_KEY);

		res.cookie("token", token, {
			httpOnly: true,
			maxAge: 60 * 60 * 1000,
			sameSite: "None",
		});

		res.status(200).send({ message: "Connexion réussie", token });
	});
};

const profil = (req, res) => {
	db.get(
		"SELECT id, nom, email, role FROM utilisateurs WHERE id = ?",
		[req.user.id],
		(err, row) => {
			if (err) return res.status(500).send("Erreur serveur.");
			if (!row) return res.status(404).send("Utilisateur non trouvé.");
			res.status(200).send(row);
		}
	);
};

export { inscription, connexion, profil };
