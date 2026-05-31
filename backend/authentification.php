<?php

//Demarre la session pour stocker les infos de l'utilisateur connecté
session_start();

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "connexionBDD.php";

//Recup des donnees envoyees par le formulaire de connexion
$email = $_POST["identifiant"] ?? "";
$motDePasse = $_POST["motdepasse"] ?? "";
$role = $_POST["role"] ?? "";


//securite : verif si un des champs est vide
if (empty($email) || empty($motDePasse) || empty($role)) {
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs sont obligatoires."
    ]);
    exit;
}

//Preparation de la requete pour chercher l'utilisateur avec son mail et son role dans la BDD
$requete = $bdd->prepare("
    SELECT id_utilisateur, prenom, nom, email, mot_de_passe, role
    FROM utilisateurs
    WHERE email = :email
    AND role = :role
");

//Execution de la requete avec les donnees recuperees
$requete->execute([
    "email" => $email,
    "role" => $role
]);

//Recup du resultat de la requete
$utilisateur = $requete->fetch(PDO::FETCH_ASSOC);

//Verif si l'utilisateur existe bien et si le mot de passe est correct
if ($utilisateur && $motDePasse === $utilisateur["mot_de_passe"]) {

//Stockage des infos de l'utilisateur dans la session
    $_SESSION["utilisateur"] = [
        "id" => $utilisateur["id_utilisateur"],
        "prenom" => $utilisateur["prenom"],
        "nom" => $utilisateur["nom"],
        "email" => $utilisateur["email"],
        "role" => $utilisateur["role"]
    ];
//Envoi de la reponse de succes en json au frontend
    echo json_encode([
        "success" => true,
        "utilisateur" => $_SESSION["utilisateur"]
    ]);
} else {
    //Envoi de l'erreur en json si l'auth a echoué
    echo json_encode([
        "success" => false,
        "message" => "Identifiant, mot de passe ou rôle incorrect."
    ]);
}
?>