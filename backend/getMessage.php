<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

$idMessage = $_GET["id_message"] ?? null;
$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if (!$idMessage || !$idUtilisateur) {
    echo json_encode([
        "success" => false,
        "message" => "Message ou utilisateur manquant."
    ]);
    exit;
}

$requete = $bdd->prepare("
    SELECT
    messages.id_message,
    messages.expediteur_id,
    messages.destinataire_id,
    messages.sujet,
    messages.contenu,
    messages.lu,
    messages.date_envoi,

    utilisateurs.prenom AS expediteur_prenom,
    utilisateurs.nom AS expediteur_nom,
    utilisateurs.role AS expediteur_role,
    utilisateurs.email AS expediteur_email
    
    FROM messages

    INNER JOIN utilisateurs
        ON messages.expediteur_id = utilisateurs.id_utilisateur

    WHERE messages.id_message = :id_message
    AND messages.destinataire_id = :id_utilisateur
");

$requete->execute([
    "id_message" => $idMessage,
    "id_utilisateur" => $idUtilisateur
]);

$message = $requete->fetch(PDO::FETCH_ASSOC);

if (!$message) {
    echo json_encode([
        "success" => false,
        "message" => "Message introuvable."
    ]);
    exit;
}

$requeteLu = $bdd->prepare("
    UPDATE messages
    SET lu = 1
    WHERE id_message = :id_message
");

$requeteLu->execute([
    "id_message" => $idMessage
]);

$message["lu"] = 1;

echo json_encode([
    "success" => true,
    "message" => $message
]);
?>