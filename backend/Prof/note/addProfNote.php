<?php
header("Content-Type: application/json");

require_once "../../connexionBDD.php";

$etudiantId = $_POST["etudiant_id"] ?? null;
$coursId = $_POST["cours_id"] ?? null;
$typeEvaluation = $_POST["type_evaluation"] ?? "";
$note = $_POST["note"] ?? null;
$coefficient = $_POST["coefficient"] ?? 1;

if (!$etudiantId || !$coursId || empty($typeEvaluation) || $note === null) {
    echo json_encode([
        "success" => false,
        "message" => "Champs manquants."
    ]);
    exit;
}

if ($note < 0 || $note > 20) {
    echo json_encode([
        "success" => false,
        "message" => "La note doit être comprise entre 0 et 20."
    ]);
    exit;
}

$requete = $bdd->prepare("
    INSERT INTO notes
    (etudiant_id, cours_id, type_evaluation, note, coefficient, date_creation, validee)
    VALUES
    (:etudiant_id, :cours_id, :type_evaluation, :note, :coefficient, NOW(), 1)
");

$requete->execute([
    "etudiant_id" => $etudiantId,
    "cours_id" => $coursId,
    "type_evaluation" => $typeEvaluation,
    "note" => $note,
    "coefficient" => $coefficient
]);

echo json_encode([
    "success" => true,
    "message" => "Note ajoutée."
]);
?>