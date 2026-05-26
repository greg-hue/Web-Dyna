INSERT INTO utilisateurs
(prenom, nom, email, mot_de_passe, role, telephone, date_creation)
VALUES
('Helene','Durant','helene.durant@ifsi.fr','admin123','admin','0680000001',NOW()),
('Patrick','Moreau','patrick.moreau@ifsi.fr','admin123','admin','0680000002',NOW()),
('Sabrina','Leroux','sabrina.leroux@ifsi.fr','admin123','admin','0680000003',NOW());

INSERT INTO administrateurs
(utilisateur_id)
VALUES
(103),
(104),
(105);