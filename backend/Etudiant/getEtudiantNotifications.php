<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

$requete = $bdd->prepare("
    SELECT
        titre,
        message,
        est_lue,
        date_creation
    FROM notifications

    WHERE utilisateur_id = :id_utilisateur

    ORDER BY date_creation DESC
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$notifications = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "notifications" => $notifications
]);
?>