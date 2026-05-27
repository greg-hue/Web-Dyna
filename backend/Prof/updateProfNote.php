<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idNote = $_POST["id_note"] ?? null;
$note = $_POST["note"] ?? null;
$typeEvaluation = $_POST["type_evaluation"] ?? "";
$coefficient = $_POST["coefficient"] ?? 1;

if (!$idNote || $note === null || empty($typeEvaluation)) {
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
    UPDATE notes
    SET
        note = :note,
        type_evaluation = :type_evaluation,
        coefficient = :coefficient,
        date_creation = NOW()
    WHERE id_note = :id_note
");

$requete->execute([
    "note" => $note,
    "type_evaluation" => $typeEvaluation,
    "coefficient" => $coefficient,
    "id_note" => $idNote
]);

echo json_encode([
    "success" => true,
    "message" => "Note modifiée."
]);
?>