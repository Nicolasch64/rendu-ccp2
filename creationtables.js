import fs from "fs";
import db from "./basededonnee.js";

const tablesSQL = fs.readFileSync("./tables.sql", "utf8");

db.exec(tablesSQL, (err) => {
	if (err) {
		console.error("Erreur lors de la création des tables:", err.message);
	} else {
		console.log("Tables créées avec succès.");
	}

	db.close();
});
