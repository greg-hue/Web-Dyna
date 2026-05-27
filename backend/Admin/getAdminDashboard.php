<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$requeteEtudiants = $bdd->query("
    SELECT COUNT(*) AS total_etudiants
    FROM etudiants
");

$totalEtudiants = $requeteEtudiants->fetch(PDO::FETCH_ASSOC)["total_etudiants"];

$requeteProfs = $bdd->query("
    SELECT COUNT(*) AS total_profs
    FROM enseignants
");

$totalProfs = $requeteProfs->fetch(PDO::FETCH_ASSOC)["total_profs"];

$requeteGroupes = $bdd->query("
    SELECT COUNT(DISTINCT groupe) AS total_groupes
    FROM etudiants
");

$totalGroupes = $requeteGroupes->fetch(PDO::FETCH_ASSOC)["total_groupes"];

$requeteUtilisateurs = $bdd->query("
    SELECT
        prenom,
        nom,
        role,
        date_creation
    FROM utilisateurs
    ORDER BY date_creation DESC
    LIMIT 10
");

echo json_encode([
    "success" => true,
    "stats" => [
        "total_etudiants" => $totalEtudiants,
        "total_profs" => $totalProfs,
        "total_groupes" => $totalGroupes
    ],
    "utilisateurs" => $requeteUtilisateurs->fetchAll(PDO::FETCH_ASSOC)
]);
?>