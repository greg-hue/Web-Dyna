<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

$requete = $bdd->prepare("
    SELECT
        messages.id_message,
        messages.sujet,
        messages.contenu,
        messages.date_envoi,
        messages.lu,

        u.prenom,
        u.nom,
        u.role

    FROM messages

    INNER JOIN utilisateurs u
        ON messages.expediteur_id = u.id_utilisateur

    WHERE messages.destinataire_id = :id_utilisateur

    ORDER BY messages.date_envoi DESC
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$messages = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "messages" => $messages
]);
?>