import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve("./plateforme_mission.db");
const db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.error("Erreur de connexion à la base de données:", err.message);
	} else {
		console.log("Connexion réussie à la base de données SQLite.");
	}
});

export default db;
