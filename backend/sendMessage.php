<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

$expediteurId = $_POST["expediteur_id"] ?? null;
$destinataireId = $_POST["destinataire_id"] ?? null;
$sujet = $_POST["sujet"] ?? "";
$contenu = $_POST["contenu"] ?? "";

if (!$expediteurId || !$destinataireId || empty($sujet) || empty($contenu)) {
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs sont obligatoires."
    ]);
    exit;
}

$requete = $bdd->prepare("
    INSERT INTO messages
    (expediteur_id, destinataire_id, sujet, contenu, lu, date_envoi)
    VALUES
    (:expediteur_id, :destinataire_id, :sujet, :contenu, 0, NOW())
");

$requete->execute([
    "expediteur_id" => $expediteurId,
    "destinataire_id" => $destinataireId,
    "sujet" => $sujet,
    "contenu" => $contenu
]);

echo json_encode([
    "success" => true,
    "message" => "Message envoyé avec succès."
]);
?>