<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if (!$idUtilisateur) {

    echo json_encode([
        "success" => false,
        "message" => "Utilisateur manquant"
    ]);

    exit;
}

$requete = $bdd->prepare("
    SELECT
        messages.id_message,
        messages.sujet,
        messages.contenu,
        messages.lu,
        messages.date_envoi,

        utilisateurs.prenom AS expediteur_prenom,
        utilisateurs.nom AS expediteur_nom,
        utilisateurs.role AS expediteur_role

    FROM messages

    INNER JOIN utilisateurs
        ON messages.expediteur_id = utilisateurs.id_utilisateur

    WHERE messages.destinataire_id = :id_utilisateur

    ORDER BY messages.date_envoi DESC
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

echo json_encode([
    "success" => true,
    "messages" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>