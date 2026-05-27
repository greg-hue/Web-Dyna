<?php
header("Content-Type: application/json");
require_once "../connexionBDD.php";

$idUtilisateur = $_POST["id_utilisateur"] ?? null;

if (!$idUtilisateur) {
    echo json_encode(["success" => false, "message" => "Utilisateur manquant."]);
    exit;
}

try {
    $bdd->beginTransaction();

    $bdd->prepare("DELETE FROM administrateurs WHERE utilisateur_id = ?")->execute([$idUtilisateur]);
    $bdd->prepare("DELETE FROM enseignants WHERE utilisateur_id = ?")->execute([$idUtilisateur]);
    $bdd->prepare("DELETE FROM etudiants WHERE utilisateur_id = ?")->execute([$idUtilisateur]);
    $bdd->prepare("DELETE FROM utilisateurs WHERE id_utilisateur = ?")->execute([$idUtilisateur]);

    $bdd->commit();

    echo json_encode(["success" => true, "message" => "Utilisateur supprimé."]);

} catch (Exception $e) {
    $bdd->rollBack();

    echo json_encode([
        "success" => false,
        "message" => "Suppression impossible : cet utilisateur est lié à des données.",
        "details" => $e->getMessage()
    ]);
}
?>