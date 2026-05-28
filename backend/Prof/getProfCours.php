<?php

header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if (!$idUtilisateur) {

    echo json_encode([
        "success" => false,
        "message" => "Utilisateur manquant"
    ]);

    exit;
}

/* =========================================
   Vérification enseignant
========================================= */

$requeteEns = $bdd->prepare("
    SELECT id_enseignant
    FROM enseignants
    WHERE utilisateur_id = :id_utilisateur
");

$requeteEns->execute([
    "id_utilisateur" => $idUtilisateur
]);

$enseignant = $requeteEns->fetch(PDO::FETCH_ASSOC);

if (!$enseignant) {

    echo json_encode([
        "success" => false,
        "message" => "Enseignant introuvable"
    ]);

    exit;
}

/* =========================================
   Récupération des cours + séances
========================================= */

$requete = $bdd->prepare("

    SELECT DISTINCT

        seances.id_seance,

        cours.titre,
        cours.semestre,
        cours.niveau,

        seances.salle

    FROM cours

    INNER JOIN enseignants
        ON cours.enseignant_id = enseignants.id_enseignant

    LEFT JOIN seances
        ON cours.id_cours = seances.cours_id

    WHERE enseignants.id_enseignant = :id_enseignant
");

$requete->execute([
    "id_enseignant" => $enseignant["id_enseignant"]
]);

$cours = $requete->fetchAll(PDO::FETCH_ASSOC);

/* =========================================
   Réponse JSON
========================================= */

echo json_encode([
    "success" => true,
    "cours" => $cours
]);

?>
