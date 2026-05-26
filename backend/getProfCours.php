<?php
session_start();
header("Content-Type: application/json");

require_once "connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if (!$idUtilisateur) {
    echo json_encode([
        "success" => false,
        "message" => "Utilisateur manquant"
    ]);
    exit;
}

$requete = $bdd->prepare("
    SELECT 
        cours.titre,
        cours.code,
        cours.semestre,
        cours.niveau,
        cours.capacite_max,
        enseignants.id_enseignant
    FROM cours
    INNER JOIN enseignants 
        ON cours.enseignant_id = enseignants.id_enseignant
    WHERE enseignants.utilisateur_id = :id_utilisateur
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$cours = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "cours" => $cours
]);
?>