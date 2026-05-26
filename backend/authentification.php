<?php
session_start();
header("Content-Type: application/json");

require_once "connexionBDD.php";

$email = $_POST["identifiant"] ?? "";
$motDePasse = $_POST["motdepasse"] ?? "";
$role = $_POST["role"] ?? "";

if (empty($email) || empty($motDePasse) || empty($role)) {
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs sont obligatoires."
    ]);
    exit;
}

$requete = $bdd->prepare("
    SELECT id_utilisateur, prenom, nom, email, mot_de_passe, role
    FROM utilisateurs
    WHERE email = :email
    AND role = :role
");

$requete->execute([
    "email" => $email,
    "role" => $role
]);

$utilisateur = $requete->fetch(PDO::FETCH_ASSOC);

if ($utilisateur && $motDePasse === $utilisateur["mot_de_passe"]) {

    $_SESSION["utilisateur"] = [
        "id" => $utilisateur["id_utilisateur"],
        "prenom" => $utilisateur["prenom"],
        "nom" => $utilisateur["nom"],
        "email" => $utilisateur["email"],
        "role" => $utilisateur["role"]
    ];

    echo json_encode([
        "success" => true,
        "utilisateur" => $_SESSION["utilisateur"]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Identifiant, mot de passe ou rôle incorrect."
    ]);
}
?>