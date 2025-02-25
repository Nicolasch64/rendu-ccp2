# rendu-ccp2

créer une plateforme permettant aux bénévoles de postuler à des missions proposées par des associations

explication de la page server sur mon projet :

    express : Framework pour créer et gérer le serveur web.

    dotenv : Module pour charger les variables d'environnement à partir d'un fichier .env.

    sqlite3 : Module pour interagir avec la base de données SQLite.

    authentiRoutes, utilisateurRoutes, missionRoutes, candidatureRoutes : Modules contenant les routes pour l'authentification, la gestion des utilisateurs, des missions, et des candidatures.

Variables d'Environnement

dotenv.config();

    Charge les variables d'environnement définies dans le fichier .env dans process.env.

Initialisation de l'Application Express

const app = express();
app.use(express.json());

    Crée une instance de l'application Express.
    Utilise le middleware express.json() pour parser les requêtes JSON entrantes.(

        middleware est une fonction qui s'exécute entre la réception d'une requête par le serveur et le traitement de cette requête par les routes de l'application. Il peut modifier la requête, la réponse, ou même arrêter le cycle de traitement.

        express.json() transforme cette chaîne de caractères JSON en un objet JavaScript que votre application peut facilement utiliser.

        simplifiez le traitement des données JSON
    )

const db = new sqlite3.Database("./plateforme_mission.db", (err) => {
if (err) {
console.error("Erreur de connexion à la base de données ", err.message);
} else {
console.log("Connexion réussie aux tables SQLite.");
}
});

export { db };

    Crée une connexion à la base de données SQLite située dans le fichier plateforme_mission.db.


    explication des pages routes:
