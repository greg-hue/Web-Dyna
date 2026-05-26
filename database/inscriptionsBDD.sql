INSERT INTO inscriptions
(etudiant_id, cours_id, date_inscription, statut)
SELECT 
    etudiants.id_etudiant,
    cours.id_cours,
    '2025-09-01',
    'validée'
FROM etudiants
CROSS JOIN cours
WHERE cours.niveau = 1;