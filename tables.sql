
DROP TABLE IF EXISTS candidatures;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS utilisateurs;


CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('bénévole', 'association')) NOT NULL,
    motdepasse TEXT,
    cree_le TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    description TEXT NOT NULL,
    date_mission TEXT NOT NULL,
    cree_le TEXT DEFAULT CURRENT_TIMESTAMP,
    association_id INTEGER,
    FOREIGN KEY (association_id) REFERENCES utilisateurs(id)
);

CREATE TABLE IF NOT EXISTS candidatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission_id INTEGER,
    utilisateur_id INTEGER,
    status TEXT DEFAULT 'en attente',
    date_application TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mission_id) REFERENCES missions(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);


INSERT INTO utilisateurs (nom, email, role,motdepasse) 
VALUES 
    ('wayne', 'john.wayne@myspace.com', 'bénévole','12335'),
    ('kleg', 'johnykleg@gmail.com', 'bénévole','45757'),
    ('lancaster', 'burt.lancaster@myspace.com', 'bénévole','7878');


INSERT INTO utilisateurs (nom, email, role,motdepasse) 
VALUES 
    ('Association des cowboys', 'contact@associationcowboy.com', 'association','5787');

INSERT INTO missions (titre, description, date_mission, association_id)
VALUES 
    ('Mission de nettoyage', 'Nettoyer les saloons', '2025-03-01', 4);


INSERT INTO candidatures (mission_id, utilisateur_id, status)
VALUES 
    (1, 1, 'En attente');


DELETE FROM utilisateurs WHERE id = 5;


SELECT * FROM utilisateurs;


SELECT * FROM missions;


SELECT * FROM candidatures;


SELECT u.nom, u.email, c.status
FROM candidatures c
JOIN utilisateurs 
