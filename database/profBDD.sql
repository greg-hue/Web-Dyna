INSERT INTO utilisateurs
(prenom, nom, email, mot_de_passe, role, telephone, date_creation)
VALUES
('Claire','Morel','claire.morel@ifsi.fr','password123','enseignant','0670000001',NOW()),
('Marc','Dubois','marc.dubois@ifsi.fr','password123','enseignant','0670000002',NOW()),
('Sophie','Lambert','sophie.lambert@ifsi.fr','password123','enseignant','0670000003',NOW()),
('Julien','Girard','julien.girard@ifsi.fr','password123','enseignant','0670000004',NOW()),
('Nadia','Benali','nadia.benali@ifsi.fr','password123','enseignant','0670000005',NOW()),
('Thomas','Renard','thomas.renard@ifsi.fr','password123','enseignant','0670000006',NOW()),
('Isabelle','Faure','isabelle.faure@ifsi.fr','password123','enseignant','0670000007',NOW()),
('Karim','Mehdi','karim.mehdi@ifsi.fr','password123','enseignant','0670000008',NOW()),
('Camille','Roche','camille.roche@ifsi.fr','password123','enseignant','0670000009',NOW()),
('Antoine','Leclerc','antoine.leclerc@ifsi.fr','password123','enseignant','0670000010',NOW()),
('Manon','Garnier','manon.garnier@ifsi.fr','password123','enseignant','0670000011',NOW()),
('Pierre','Lemoine','pierre.lemoine@ifsi.fr','password123','enseignant','0670000012',NOW());

INSERT INTO enseignants
(utilisateur_id, specialisation, date_embauche)
VALUES
(91,'Anatomie et physiologie','2018-09-01'),
(92,'Soins infirmiers fondamentaux','2017-09-01'),
(93,'Pharmacologie','2019-01-15'),
(94,'Hygiène hospitalière','2016-09-01'),
(95,'Psychologie et relation soignant-soigné','2020-09-01'),
(96,'Santé publique','2015-09-01'),
(97,'Éthique et déontologie','2021-09-01'),
(98,'Urgences et premiers secours','2018-02-10'),
(99,'Pathologies médicales','2014-09-01'),
(100,'Communication professionnelle','2022-09-01'),
(101,'Stages et pratiques cliniques','2016-01-20'),
(102,'Recherche et méthodologie','2020-03-01');