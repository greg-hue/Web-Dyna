<?php

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "connexionBDD.php";

//Execution de la requete pour recup toutes les news triées par la plus recente
$requete = $bdd->query("
    SELECT
        titre,
        contenu,
        categorie,
        date_publication
    FROM news

    ORDER BY date_publication DESC
");

//Recup de toutes les news sous forme de tableau
$news = $requete->fetchAll(PDO::FETCH_ASSOC);

//Envoi des news en json au frontend
echo json_encode([
    "success" => true,
    "news" => $news
]);
?>