import { db } from "../server.js";

const creerMission = (req, res) => {
	if (req.user.role !== "association") {
		return res
			.status(403)
			.send("Seules les associations peuvent créer des missions.");
	}

	const { titre, description, date_mission } = req.body;

	db.run(
		"INSERT INTO missions (titre, description, date_mission, association_id) VALUES (?, ?, ?, ?)",
		[titre, description, date_mission, req.user.id],
		function (err) {
			if (err) return res.status(500).send("Erreur serveur.");
			res.status(201).send({ message: "Mission créée !" });
		}
	);
};

const obtenirMissions = (req, res) => {
	db.all(
		"SELECT * FROM missions WHERE date_mission > CURRENT_DATE",
		[],
		(err, rows) => {
			if (err) return res.status(500).send("Erreur serveur.");
			res.status(200).send(rows);
		}
	);
};

export { creerMission, obtenirMissions };
