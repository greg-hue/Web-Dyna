<?php
header("Content-Type: application/json");

require_once "../../connexionBDD.php";

$requeteInscriptions = $bdd->query("
    SELECT
        inscriptions.id_inscription,
        inscriptions.date_inscription,
        inscriptions.statut,

        etudiants.id_etudiant,
        etudiants.groupe,

        utilisateurs.prenom,
        utilisateurs.nom,

        cours.id_cours,
        cours.titre,
        cours.code

    FROM inscriptions

    INNER JOIN etudiants
        ON inscriptions.etudiant_id = etudiants.id_etudiant

    INNER JOIN utilisateurs
        ON etudiants.utilisateur_id = utilisateurs.id_utilisateur

    INNER JOIN cours
        ON inscriptions.cours_id = cours.id_cours

    ORDER BY utilisateurs.nom ASC, cours.titre ASC
");

$requeteEtudiants = $bdd->query("
    SELECT
        etudiants.id_etudiant,
        etudiants.groupe,
        utilisateurs.prenom,
        utilisateurs.nom
    FROM etudiants

    INNER JOIN utilisateurs
        ON etudiants.utilisateur_id = utilisateurs.id_utilisateur

    ORDER BY utilisateurs.nom ASC
");

$requeteCours = $bdd->query("
    SELECT
        id_cours,
        titre,
        code
    FROM cours
    ORDER BY titre ASC
");

echo json_encode([
    "success" => true,
    "inscriptions" => $requeteInscriptions->fetchAll(PDO::FETCH_ASSOC),
    "etudiants" => $requeteEtudiants->fetchAll(PDO::FETCH_ASSOC),
    "cours" => $requeteCours->fetchAll(PDO::FETCH_ASSOC)
]);
?>