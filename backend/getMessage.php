<?php

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "connexionBDD.php";

//Recup de l'id du message et de l'id de l'utilisateur passés dans l'url
$idMessage = $_GET["id_message"] ?? null;
$idUtilisateur = $_GET["id_utilisateur"] ?? null;

//securite : verif si l'un des deux parametres est manquant
if (!$idMessage || !$idUtilisateur) {
    echo json_encode([
        "success" => false,
        "message" => "Message ou utilisateur manquant."
    ]);
    exit;
}

//Preparation de la requete avec un INNER JOIN pour recup le message et les infos de l'expediteur d'un coup
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

//Execution de la requete avec les parametres recuperes
$requete->execute([
    "id_message" => $idMessage,
    "id_utilisateur" => $idUtilisateur
]);

//Recup du resultat de la requete
$message = $requete->fetch(PDO::FETCH_ASSOC);

//securite : si le message n'existe pas ou n'appartient pas a cet utilisateur
if (!$message) {
    echo json_encode([
        "success" => false,
        "message" => "Message introuvable."
    ]);
    exit;
}

//Preparation de la requete pour maj le statut du message et le passer en lu
$requeteLu = $bdd->prepare("
    UPDATE messages
    SET lu = 1
    WHERE id_message = :id_message
");

//Execution de la requete de maj
$requeteLu->execute([
    "id_message" => $idMessage
]);

//maj de la variable locale pour renvoyer le bon statut au frontend
$message["lu"] = 1;

//Envoi du message en json au frontend
echo json_encode([
    "success" => true,
    "message" => $message
]);
?>