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

$requete = $bdd->prepare("
    SELECT DISTINCT
        cours.titre,
        cours.semestre,
        cours.niveau,
        seances.salle
    FROM cours

    INNER JOIN enseignants
        ON cours.enseignant_id = enseignants.id_enseignant

    LEFT JOIN seances
        ON cours.id_cours = seances.cours_id

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