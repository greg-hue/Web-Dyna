<?php

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "connexionBDD.php";

//Recup des donnees envoyees par le formulaire
$expediteurId =
    $_POST["expediteur_id"] ?? null;

$destinataireEmail =
    $_POST["destinataire_email"] ?? null;

$sujet =
    $_POST["sujet"] ?? "";

$contenu =
    $_POST["contenu"] ?? "";

//securite : verif si un des champs est vide ou manquant
if (
    !$expediteurId ||
    !$destinataireEmail ||
    empty($sujet) ||
    empty($contenu)
) {

    echo json_encode([
        "success" => false,
        "message" => "Tous les champs sont obligatoires."
    ]);

    exit;
}


//Preparation de la requete pour chercher l'id du destinataire avec son mail
$requeteUtilisateur = $bdd->prepare("
    SELECT id_utilisateur
    FROM utilisateurs
    WHERE email = :email
");

//Execution de la requete
$requeteUtilisateur->execute([
    "email" => $destinataireEmail
]);

//Recup du destinataire
$destinataire =
    $requeteUtilisateur->fetch(PDO::FETCH_ASSOC);

//securite : si le mail n'existe pas en BDD
if (!$destinataire) {

    echo json_encode([
        "success" => false,
        "message" => "Adresse mail introuvable."
    ]);

    exit;
}
//Stockage de l'id du destinataire recupere
$destinataireId =
    $destinataire["id_utilisateur"];


//Preparation de la requete pour inserer le nouveau message
$requete = $bdd->prepare("
    INSERT INTO messages
    (
        expediteur_id,
        destinataire_id,
        sujet,
        contenu,
        lu,
        date_envoi
    )

    VALUES
    (
        :expediteur_id,
        :destinataire_id,
        :sujet,
        :contenu,
        0,
        NOW()
    )
");

//Execution de la requete avec toutes les infos du message
$requete->execute([

    "expediteur_id" => $expediteurId,

    "destinataire_id" => $destinataireId,

    "sujet" => $sujet,

    "contenu" => $contenu
]);

//Envoi de la confirmation de succes en json au frontend
echo json_encode([
    "success" => true,
    "message" => "Message envoyé avec succès."
]);

?>