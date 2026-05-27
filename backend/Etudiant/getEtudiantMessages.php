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

        u.prenom,
        u.nom

    FROM messages

    INNER JOIN utilisateurs u
        ON messages.expediteur_id = u.id_utilisateur

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