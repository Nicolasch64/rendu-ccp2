import { db } from "../server.js";

const checkCandidatureOwner = (req, res, next) => {
	const candidatureId = req.params.candidatureId;
	const userId = req.user.id;

	db.get(
		"SELECT * FROM candidatures WHERE id = ?",
		[candidatureId],
		(err, row) => {
			if (err) {
				return res.status(500).send("Erreur serveur.");
			}

			if (!row) {
				return res.status(404).send("Candidature non trouvée.");
			}

			if (row.utilisateur_id !== userId) {
				return res
					.status(403)
					.send(
						"Vous n'êtes pas autorisé à modifier ou supprimer cette candidature."
					);
			}

			next();
		}
	);
};

export { checkCandidatureOwner };
