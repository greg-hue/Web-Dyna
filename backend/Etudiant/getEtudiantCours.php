<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if(!$idUtilisateur){

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
        cours.credits,
        utilisateurs.prenom,
        utilisateurs.nom
    FROM inscriptions

    INNER JOIN etudiants
        ON inscriptions.etudiant_id = etudiants.id_etudiant

    INNER JOIN cours
        ON inscriptions.cours_id = cours.id_cours

    INNER JOIN enseignants
        ON cours.enseignant_id = enseignants.id_enseignant

    INNER JOIN utilisateurs
        ON enseignants.utilisateur_id = utilisateurs.id_utilisateur

    WHERE etudiants.utilisateur_id = :id_utilisateur
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