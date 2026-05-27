<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if(!$idUtilisateur){

    echo json_encode([
        "success" => false
    ]);

    exit;
}

$requete = $bdd->prepare("
    SELECT
        cours.titre,
        notes.type_evaluation,
        notes.note,
        notes.coefficient,
        notes.validee
    FROM notes

    INNER JOIN etudiants
        ON notes.etudiant_id = etudiants.id_etudiant

    INNER JOIN cours
        ON notes.cours_id = cours.id_cours

    WHERE etudiants.utilisateur_id = :id_utilisateur
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$notes = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "notes" => $notes
]);
?>