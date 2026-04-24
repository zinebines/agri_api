DROP TABLE IF EXISTS recensements CASCADE;
DROP TABLE IF EXISTS recensement_campagne CASCADE;
DROP TABLE IF EXISTS recensement_status CASCADE;

CREATE TABLE recensement_status(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(50),
 nom_ar VARCHAR(50)
);

CREATE TABLE recensement_campagne(
 id SERIAL PRIMARY KEY,
 nom_fr VARCHAR(150) NOT NULL,
 nom_ar VARCHAR(150),
 annee INT NOT NULL UNIQUE,
 date_debut DATE,
 date_fin DATE
);

CREATE TABLE recensements(
 id SERIAL PRIMARY KEY,
 campagne_id INT NOT NULL,
 exploitation_id INT NOT NULL,
 recenseur_id INT,
 controleur_id INT,
 date_recensement DATE,
 date_controle DATE,
 status_id INT,

 CONSTRAINT fk_recensement_campagne
 FOREIGN KEY(campagne_id)
 REFERENCES recensement_campagne(id),

 CONSTRAINT fk_recensement_exploitation
 FOREIGN KEY(exploitation_id)
 REFERENCES exploitations(id),

 CONSTRAINT fk_recensement_recenseur
 FOREIGN KEY(recenseur_id)
 REFERENCES users(id),

 CONSTRAINT fk_recensement_controleur
 FOREIGN KEY(controleur_id)
 REFERENCES users(id),

 CONSTRAINT fk_recensement_status
 FOREIGN KEY(status_id)
 REFERENCES recensement_status(id),

 CONSTRAINT unique_recensement
 UNIQUE(campagne_id, exploitation_id)
);

INSERT INTO recensement_status(id, nom_fr, nom_ar) VALUES
(1,'En cours','قيد الإنجاز'),
(2,'Recensé','تم الإحصاء'),
(3,'Contrôlé','تم المراقبة'),
(4,'Validé','تم الاعتماد'),
(5,'Rejeté','مرفوض');

INSERT INTO recensement_campagne(
 nom_fr,
 nom_ar,
 annee,
 date_debut,
 date_fin
)
VALUES
(
'Recensement Agricole 2025',
'الإحصاء الفلاحي 2025',
2025,
'2025-01-01',
'2025-12-31'
);

INSERT INTO recensements(
 campagne_id,
 exploitation_id,
 recenseur_id,
 controleur_id,
 date_recensement,
 status_id
)
VALUES
(1,1,2,NULL,'2025-03-01',2),
(1,2,2,NULL,'2025-03-02',2),
(1,3,3,NULL,'2025-03-03',2),
(1,4,3,NULL,'2025-03-04',2);