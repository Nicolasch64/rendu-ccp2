CREATE TABLE if NOT EXISTS utilisateurs(

id INTEGER PRIMARY KEY AUTOINCREMENT,
nom TEXT NOT NULL,
prenom TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
role TEXT CHECK(role IN('bénévole','association')) NOT NULL,
cree_le TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE if NOT EXISTS missions(
id INTEGER PRIMARY KEY AUTOINCREMENT,
titre TEXT NOT NULL,
description TEXT NOT NULL,
cree_le TEXT DEFAULT CURRENT_TIMESTAMP,
date_mission TEXT NOT NULL ,
association_id INTEGER,
FOREIGN KEY (association_id) REFERENCES utilisateurs(id)



);


CREATE TABLE if NOT EXISTS candidatures(
id INTEGER PRIMARY KEY AUTOINCREMENT,
mission_id INTEGER,
utilisateur_id INTEGER,
status TEXT DEFAULT'en attente',
date_application TEXT DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (mission_id) REFERENCES missions(id),
FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);




INSERT INTO utilisateurs (nom,prenom,  email, type) 
VALUES ('wayne', 'john', 'john.wayne@myspace.com', 'bénévole');


INSERT INTO utilisateurs (nom, prenom, email, type) 
VALUES ('Association XYZ', '', 'contact@associationxyz.com', 'association');


INSERT INTO missions (titre, description, date, association_id)
VALUES ('Mission de nettoyage', 'Nettoyer les plages locales', '2025-03-01', 1);


INSERT INTO candidatures (bénévole_id, mission_id, statut)
VALUES (1, 1, 'En attente');


SELECT * FROM utilisateurs;
SELECT * FROM missions;
SELECT * FROM candidatures;


SELECT u.nom, u.prenom, c.statut
FROM candidatures c
JOIN utilisateurs u ON c.bénévole_id = u.id
WHERE c.mission_id = 1;
