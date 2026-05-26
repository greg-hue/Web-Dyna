INSERT INTO notes
(etudiant_id, cours_id, type_evaluation, note, coefficient, date_creation, validee)
SELECT
    etudiants.id_etudiant,
    cours.id_cours,
    'Contrôle continu',
    ROUND(8 + (RAND() * 10), 1),
    1,
    NOW(),
    TRUE
FROM etudiants
JOIN inscriptions ON inscriptions.etudiant_id = etudiants.id_etudiant
JOIN cours ON cours.id_cours = inscriptions.cours_id;