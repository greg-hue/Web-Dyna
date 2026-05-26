INSERT INTO absences
(etudiant_id, seance_id, statut, justifiee, commentaire)
VALUES
(1,1,'absent',FALSE,'Absence non justifiée'),
(2,3,'retard',FALSE,'Retard de 15 minutes'),
(4,5,'absent',TRUE,'Justificatif médical fourni'),
(7,8,'absent',FALSE,'Absence non justifiée'),
(12,10,'retard',TRUE,'Retard transport justifié'),

(31,18,'absent',FALSE,'Absence non justifiée'),
(35,21,'retard',FALSE,'Retard de 10 minutes'),
(42,24,'absent',TRUE,'Justificatif transmis'),
(50,28,'absent',FALSE,'Absence non justifiée'),

(61,36,'retard',FALSE,'Retard de 20 minutes'),
(66,39,'absent',TRUE,'Rendez-vous médical'),
(72,42,'absent',FALSE,'Absence non justifiée'),
(80,48,'retard',TRUE,'Problème de transport'),
(89,52,'absent',FALSE,'Absence non justifiée');