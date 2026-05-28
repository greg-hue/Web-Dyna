<?php
header("Content-Type: application/json");

require_once "../../connexionBDD.php";

$requeteCours = $bdd->query("
    SELECT
        cours.id_cours,
        cours.titre,
        cours.code,
        cours.credits,
        cours.semestre,
        cours.niveau,
        cours.capacite_max,
        enseignants.id_enseignant,
        utilisateurs.prenom,
        utilisateurs.nom
    FROM cours

    INNER JOIN enseignants
        ON cours.enseignant_id = enseignants.id_enseignant

    INNER JOIN utilisateurs
        ON enseignants.utilisateur_id = utilisateurs.id_utilisateur

    ORDER BY cours.id_cours ASC
");

$requeteEnseignants = $bdd->query("
    SELECT
        enseignants.id_enseignant,
        utilisateurs.prenom,
        utilisateurs.nom
    FROM enseignants

    INNER JOIN utilisateurs
        ON enseignants.utilisateur_id = utilisateurs.id_utilisateur

    ORDER BY utilisateurs.nom ASC
");

echo json_encode([
    "success" => true,
    "cours" => $requeteCours->fetchAll(PDO::FETCH_ASSOC),
    "enseignants" => $requeteEnseignants->fetchAll(PDO::FETCH_ASSOC)
]);
?>