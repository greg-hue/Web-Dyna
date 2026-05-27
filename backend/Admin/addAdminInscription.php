<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$etudiantId = $_POST["etudiant_id"] ?? null;
$coursId = $_POST["cours_id"] ?? null;

if (!$etudiantId || !$coursId) {
    echo json_encode([
        "success" => false,
        "message" => "Étudiant ou cours manquant."
    ]);
    exit;
}

try {
    $requete = $bdd->prepare("
        INSERT INTO inscriptions
        (etudiant_id, cours_id, date_inscription, statut)
        VALUES
        (:etudiant_id, :cours_id, CURDATE(), 'validée')
    ");

    $requete->execute([
        "etudiant_id" => $etudiantId,
        "cours_id" => $coursId
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
        "message" => "Inscription ajoutée."
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Inscription impossible. L’étudiant est peut-être déjà inscrit à ce cours."
    ]);
}
?>