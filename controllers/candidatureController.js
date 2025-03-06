import { db } from "../server.js";

const postulerMission = (req, res) => {
	if (req.user.role !== "bénévole") {
		return res.status(403).send("Seuls les bénévoles peuvent postuler.");
	}

	const mission_id = req.params.mission_id;

	db.run(
		"INSERT INTO candidatures (mission_id, utilisateur_id) VALUES (?, ?)",
		[mission_id, req.user.id],
		function (err) {
			if (err) return res.status(500).send("Erreur serveur.");
			res
				.status(201)
				.send({ message: "Candidature envoyée, statut en attente." });
		}
	);
};

const consulterCandidatures = (req, res) => {
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
			if (err) return res.status(500).send("Erreur serveur.");
			res.status(200).send(rows);
		}
	);
};

const accepterRefuserCandidature = (req, res) => {
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
			if (err) return res.status(500).send("Erreur serveur.");
			res.status(200).send({ message: `Candidature ${status}` });
		}
	);
};

const modifierCandidature = (req, res) => {
	const candidatureId = req.params.candidatureId;
	const { status } = req.body;

	if (req.user.role !== "bénévole") {
		return res
			.status(403)
			.send("Seuls les bénévoles peuvent modifier leur candidature.");
	}

	db.run(
		"UPDATE candidatures SET status = ? WHERE id = ? AND utilisateur_id = ?",
		[status, candidatureId, req.user.id],
		function (err) {
			if (err) {
				return res
					.status(500)
					.send("Erreur lors de la mise à jour de la candidature.");
			}
			if (this.changes === 0) {
				return res
					.status(404)
					.send("Candidature non trouvée ou vous n'êtes pas le propriétaire.");
			}
			res.status(200).send("Candidature mise à jour avec succès.");
		}
	);
};

const supprimerCandidature = (req, res) => {
	const candidatureId = req.params.candidatureId;

	if (req.user.role !== "bénévole") {
		return res
			.status(403)
			.send("Seuls les bénévoles peuvent supprimer leur candidature.");
	}

	db.run(
		"DELETE FROM candidatures WHERE id = ? AND utilisateur_id = ?",
		[candidatureId, req.user.id],
		function (err) {
			if (err) {
				return res
					.status(500)
					.send("Erreur lors de la suppression de la candidature.");
			}
			if (this.changes === 0) {
				return res
					.status(404)
					.send("Candidature non trouvée ou vous n'êtes pas le propriétaire.");
			}
			res.status(200).send("Candidature supprimée avec succès.");
		}
	);
};

export {
	postulerMission,
	consulterCandidatures,
	accepterRefuserCandidature,
	modifierCandidature,
	supprimerCandidature,
};
