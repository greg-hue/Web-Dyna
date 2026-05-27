<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$titre = $_POST["titre"] ?? "";
$code = $_POST["code"] ?? "";
$description = $_POST["description"] ?? "";
$credits = $_POST["credits"] ?? null;
$semestre = $_POST["semestre"] ?? null;
$niveau = $_POST["niveau"] ?? null;
$capaciteMax = $_POST["capacite_max"] ?? null;
$enseignantId = $_POST["enseignant_id"] ?? null;

if (
    empty($titre) ||
    empty($code) ||
    !$credits ||
    !$semestre ||
    !$niveau ||
    !$capaciteMax ||
    !$enseignantId
) {
    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis."
    ]);
    exit;
}

$requete = $bdd->prepare("
    INSERT INTO cours
    (titre, code, description, credits, semestre, niveau, capacite_max, enseignant_id)
    VALUES
    (:titre, :code, :description, :credits, :semestre, :niveau, :capacite_max, :enseignant_id)
");

$requete->execute([
    "titre" => $titre,
    "code" => $code,
    "description" => $description,
    "credits" => $credits,
    "semestre" => $semestre,
    "niveau" => $niveau,
    "capacite_max" => $capaciteMax,
    "enseignant_id" => $enseignantId
]);

$notification = $bdd->prepare("
    INSERT INTO notifications
    (utilisateur_id, titre, message, est_lue, date_creation)
    VALUES
    (1, :titre, :message, 0, NOW())
");

$notification->execute([
    "titre" => "Nouveau cours",
    "message" => "Le cours $titre a été ajouté."
]);

echo json_encode([
    "success" => true,
    "message" => "Cours ajouté avec succès."
]);
?>