import jwt from "jwt-simple";
import { db } from "../server.js";
const SECRET_KEY = process.env.SECRET_KEY;

const midlAuthenti = (req, res, next) => {
	const token = req.headers["authorization"];
	if (!token) return res.status(403).send("Token manquant.");

	try {
		const decoded = jwt.decode(token.split(" ")[1], SECRET_KEY);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).send("Token invalide.");
	}
};

export { midlAuthenti };
