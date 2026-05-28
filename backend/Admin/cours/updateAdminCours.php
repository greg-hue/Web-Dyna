<?php

header("Content-Type: application/json");

require_once("../../connexionBDD.php");

$id = $_POST["id"] ?? null;
$nom = $_POST["nom"] ?? "";
$description = $_POST["description"] ?? "";
$enseignant = $_POST["enseignant"] ?? "";

if (
    !$id ||
    empty($nom) ||
    empty($description) ||
    empty($enseignant)
) {
    echo json_encode([
        "success" => false,
        "message" => "Champs manquants."
    ]);
    exit;
}

$sql = "
UPDATE cours
SET
    nom = ?,
    description = ?,
    enseignant = ?
WHERE id = ?
";

$requete = $pdo->prepare($sql);

$success = $requete->execute([
    $nom,
    $description,
    $enseignant,
    $id
]);

echo json_encode([
    "success" => $success,
    "message" => $success
        ? "Cours modifié."
        : "Erreur modification."
]);