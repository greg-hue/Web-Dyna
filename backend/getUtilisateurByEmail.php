<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

$email = $_GET["email"] ?? null;

if (!$email) {

    echo json_encode([
        "success" => false,
        "message" => "Email manquant"
    ]);

    exit;
}

$requete = $bdd->prepare("
    SELECT
        id_utilisateur,
        prenom,
        nom,
        role
    FROM utilisateurs
    WHERE email = :email
");

$requete->execute([
    "email" => $email
]);

$utilisateur = $requete->fetch(PDO::FETCH_ASSOC);

if (!$utilisateur) {

    echo json_encode([
        "success" => false,
        "message" => "Utilisateur introuvable"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "utilisateur" => $utilisateur
]);
?>