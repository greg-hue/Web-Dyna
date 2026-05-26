<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

$requete = $bdd->prepare("
    SELECT
        cours.titre,
        seances.date_seance,
        seances.heure_debut,
        seances.heure_fin,
        seances.salle,
        seances.type_seance
    FROM etudiants

    INNER JOIN seances
        ON etudiants.groupe = seances.groupe

    INNER JOIN cours
        ON seances.cours_id = cours.id_cours

    WHERE etudiants.utilisateur_id = :id_utilisateur

    ORDER BY seances.date_seance ASC
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$seances = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "seances" => $seances
]);
?>