<?php

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "../connexionBDD.php";

//Recup de l'id de l'utilisateur passe dans l'url
$idUtilisateur = $_GET["id_utilisateur"] ?? null;

//securite : verif si l'id de l'utilisateur est manquant
if (!$idUtilisateur) {

    echo json_encode([
        "success" => false,
        "message" => "Utilisateur manquant"
    ]);

    exit;
}

//Preparation de la requete avec un INNER JOIN pour recup les messages et les infos de l'expediteur d'un coup
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

//Execution de la requete avec l'id recuperé
$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

//Envoi des messages recuperes en json au frontend
echo json_encode([
    "success" => true,
    "messages" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>