import express from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import authentiRoutes from "./routes/authentiRoutes.js";
import utilisateurRoutes from "./routes/utilisateurRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import candidatureRoutes from "./routes/candidatureRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const db = new sqlite3.Database("./plateforme_mission.db", (err) => {
	if (err) {
		console.error("Erreur de connexion à la base de données ", err.message);
	} else {
		console.log("Connexion réussie aux tables SQLite.");
	}
});

export { db };

app.use("/api/auth", authentiRoutes);
app.use("/api/users", utilisateurRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/candidatures", candidatureRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
	console.log(`Serveur en place sur le port ${PORT}`);
});
