<?php

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "../connexionBDD.php";

//Execution de la requete pour recup le nombre total d'etudiants
$requeteEtudiants = $bdd->query("
    SELECT COUNT(*) AS total_etudiants
    FROM etudiants
");

$totalEtudiants = $requeteEtudiants->fetch(PDO::FETCH_ASSOC)["total_etudiants"];
//Execution de la requete pour recup le nombre total de profs
$requeteProfs = $bdd->query("
    SELECT COUNT(*) AS total_profs
    FROM enseignants
");

$totalProfs = $requeteProfs->fetch(PDO::FETCH_ASSOC)["total_profs"];

//Execution de la requete pour recup le nombre de groupes uniques
$requeteGroupes = $bdd->query("
    SELECT COUNT(DISTINCT groupe) AS total_groupes
    FROM etudiants
");

$totalGroupes = $requeteGroupes->fetch(PDO::FETCH_ASSOC)["total_groupes"];

//Execution de la requete pour recup les 10 derniers utilisateurs inscrits
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

//Envoi des stats et de la liste des utilisateurs recents en json au frontend
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