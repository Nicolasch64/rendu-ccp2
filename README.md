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

test des routes :

toutes les routes utilisateurs marchent pour insciption et connexion ou je recuperer le token ,

les routes missions marchent également en utilisant les profils associations uniquement je peux rajouter des missions avec POST dans insomnia et je les recuperes toutes en faisant GET :

router.post("/mission", midlAuthenti, (req, res) => {
if (req.user.role !== "association") {
return res
.status(403)
.send("les missions ne peuvent etre créer que par les associations");
}
const { titre, description, date_mission } = req.body;

    db.run(
    	"INSERT INTO missions (titre,description,date_mission,association_id)VALUES(?,?,?,?)",
    	[titre, description, date_mission, req.user.id],
    	function (err) {
    		if (err)
    			return res
    				.status(500)
    				.send("probleme lors de la création de la mission");
    		res.status(201).send({ message: "mission crée !!!" });
    	}
    );

});

router.get("/", midlAuthenti, (req, res) => {
db.all(
"SELECT \* FROM missions WHERE date_mission > CURRENT_DATE",
[],
(err, rows) => {
if (err) return res.status(500).send("Erreur serveur.");
res.status(200).send(rows);
}
);
});

les routes des candidatures ont été les plus compliqués a faire pour moi car il y avait la création d'une route utilsant PUT pour accepter ou refuser les candidatures etn le fait de bien devoir changer le token d'authorization a chaque fois e ntre user et misssion.
