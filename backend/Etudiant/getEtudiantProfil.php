<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

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
        utilisateurs.prenom,
        utilisateurs.nom,
        utilisateurs.email,
        utilisateurs.telephone,
        etudiants.numero_etudiant,
        etudiants.promotion,
        etudiants.groupe,
        etudiants.niveau
    FROM utilisateurs

    INNER JOIN etudiants
        ON utilisateurs.id_utilisateur = etudiants.utilisateur_id

    WHERE utilisateurs.id_utilisateur = :id_utilisateur
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$profil = $requete->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "profil" => $profil
]);
?>