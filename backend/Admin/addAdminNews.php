<?php

//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "../connexionBDD.php";

//Recup des donnees envoyees par le formulaire
$auteurId = $_POST["auteur_id"] ?? null;
$titre = $_POST["titre"] ?? "";
$contenu = $_POST["contenu"] ?? "";
$categorie = $_POST["categorie"] ?? "Annonce";

//securite : verif si les champs obligatoires sont bien remplis
if (!$auteurId || empty($titre) || empty($contenu)) {
    echo json_encode([
        "success" => false,
        "message" => "Titre, contenu et auteur obligatoires."
    ]);
    exit;
}

//Preparation de la requete pour inserer la nouvelle news en BDD
$requete = $bdd->prepare("
    INSERT INTO news
    (auteur_id, titre, contenu, categorie, date_publication)
    VALUES
    (:auteur_id, :titre, :contenu, :categorie, NOW())
");

//Execution de la requete avec les infos de la news
$requete->execute([
    "auteur_id" => $auteurId,
    "titre" => $titre,
    "contenu" => $contenu,
    "categorie" => $categorie
]);

//Envoi de la confirmation de succes en json au frontend
echo json_encode([
    "success" => true,
    "message" => "News publiée avec succès."
]);
?>