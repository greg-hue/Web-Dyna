<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

$requete = $bdd->query("
    SELECT
        titre,
        contenu,
        categorie,
        date_publication
    FROM news

    ORDER BY date_publication DESC
");

$news = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "news" => $news
]);
?>