<?php

header("Content-Type: application/json");

require_once("../../connexionBDD.php");

$id = $_POST["id"] ?? null;
$prenom = $_POST["prenom"] ?? "";
$nom = $_POST["nom"] ?? "";
$email = $_POST["email"] ?? "";
$role = $_POST["role"] ?? "";

if (
    !$id ||
    empty($prenom) ||
    empty($nom) ||
    empty($email) ||
    empty($role)
) {
    echo json_encode([
        "success" => false,
        "message" => "Champs manquants."
    ]);
    exit;
}

$sql = "
UPDATE utilisateurs
SET
    prenom = ?,
    nom = ?,
    email = ?,
    role = ?
WHERE id = ?
";

$requete = $pdo->prepare($sql);

$success = $requete->execute([
    $prenom,
    $nom,
    $email,
    $role,
    $id
]);

echo json_encode([
    "success" => $success,
    "message" => $success
        ? "Utilisateur modifié."
        : "Erreur modification."
]);