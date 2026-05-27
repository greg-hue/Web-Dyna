<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$auteurId = $_POST["auteur_id"] ?? null;
$titre = $_POST["titre"] ?? "";
$contenu = $_POST["contenu"] ?? "";
$categorie = $_POST["categorie"] ?? "Annonce";

if (!$auteurId || empty($titre) || empty($contenu)) {
    echo json_encode([
        "success" => false,
        "message" => "Titre, contenu et auteur obligatoires."
    ]);
    exit;
}

$requete = $bdd->prepare("
    INSERT INTO news
    (auteur_id, titre, contenu, categorie, date_publication)
    VALUES
    (:auteur_id, :titre, :contenu, :categorie, NOW())
");

$requete->execute([
    "auteur_id" => $auteurId,
    "titre" => $titre,
    "contenu" => $contenu,
    "categorie" => $categorie
]);

echo json_encode([
    "success" => true,
    "message" => "News publiée avec succès."
]);
?>