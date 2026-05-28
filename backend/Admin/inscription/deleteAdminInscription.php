<?php
header("Content-Type: application/json");

require_once "../../connexionBDD.php";

$idInscription = $_POST["id_inscription"] ?? null;

if (!$idInscription) {
    echo json_encode([
        "success" => false,
        "message" => "Inscription manquante."
    ]);
    exit;
}

$requete = $bdd->prepare("
    DELETE FROM inscriptions
    WHERE id_inscription = :id_inscription
");

$requete->execute([
    "id_inscription" => $idInscription
]);

echo json_encode([
    "success" => true,
    "message" => "Inscription supprimée."
]);
?>