<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

$requete = $bdd->prepare("
    SELECT
        cours.titre,
        seances.date_seance,
        absences.statut,
        absences.justifiee,
        absences.commentaire
    FROM absences

    INNER JOIN etudiants
        ON absences.etudiant_id = etudiants.id_etudiant

    INNER JOIN seances
        ON absences.seance_id = seances.id_seance

    INNER JOIN cours
        ON seances.cours_id = cours.id_cours

    WHERE etudiants.utilisateur_id = :id_utilisateur
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$absences = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "absences" => $absences
]);
?>