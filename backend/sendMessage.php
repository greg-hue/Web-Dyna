<?php

header("Content-Type: application/json");

require_once "connexionBDD.php";

$expediteurId =
    $_POST["expediteur_id"] ?? null;

$destinataireEmail =
    $_POST["destinataire_email"] ?? null;

$sujet =
    $_POST["sujet"] ?? "";

$contenu =
    $_POST["contenu"] ?? "";

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

//
// RECHERCHE DESTINATAIRE
//

$requeteUtilisateur = $bdd->prepare("
    SELECT id_utilisateur
    FROM utilisateurs
    WHERE email = :email
");

$requeteUtilisateur->execute([
    "email" => $destinataireEmail
]);

$destinataire =
    $requeteUtilisateur->fetch(PDO::FETCH_ASSOC);

if (!$destinataire) {

    echo json_encode([
        "success" => false,
        "message" => "Adresse mail introuvable."
    ]);

    exit;
}

$destinataireId =
    $destinataire["id_utilisateur"];

//
// INSERT MESSAGE
//

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