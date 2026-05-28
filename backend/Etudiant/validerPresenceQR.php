<?php
header("Content-Type: application/json");
require_once "../connexionBDD.php";

$idUtilisateur = $_POST["id_utilisateur"] ?? null;
$tokenScanne = $_POST["token"] ?? null;

if (!$idUtilisateur || !$tokenScanne) {
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit;
}

// 1. Trouver l'ID étudiant depuis l'ID utilisateur
$reqEtudiant = $bdd->prepare("SELECT id_etudiant FROM etudiants WHERE utilisateur_id = :id_utilisateur");
$reqEtudiant->execute(["id_utilisateur" => $idUtilisateur]);
$etudiant = $reqEtudiant->fetch(PDO::FETCH_ASSOC);

if (!$etudiant) {
    echo json_encode(["success" => false, "message" => "Étudiant introuvable."]);
    exit;
}
$idEtudiant = $etudiant["id_etudiant"];

// 2. Vérifier le token et récupérer l'heure d'expiration
$reqSeance = $bdd->prepare("
    SELECT id_seance, token_expiration 
    FROM seances 
    WHERE token = :token
");
$reqSeance->execute(["token" => $tokenScanne]);
$seance = $reqSeance->fetch(PDO::FETCH_ASSOC);

if (!$seance) {
    echo json_encode(["success" => false, "message" => "QR Code invalide ou non reconnu."]);
    exit;
}

// 3. Vérification du temps : Le QR Code est-il expiré ?
if (strtotime($seance["token_expiration"]) < time()) {
    echo json_encode(["success" => false, "message" => "Délai dépassé : Ce QR Code a expiré !"]);
    exit;
}

// 4. Vérifier si l'étudiant a DÉJÀ été noté présent pour éviter les doublons
$reqCheck = $bdd->prepare("SELECT id_absence FROM absences WHERE etudiant_id = :etudiant_id AND seance_id = :seance_id");
$reqCheck->execute([
    "etudiant_id" => $idEtudiant,
    "seance_id" => $seance["id_seance"]
]);

if ($reqCheck->fetch()) {
    echo json_encode(["success" => false, "message" => "Vous êtes déjà noté présent pour ce cours !"]);
    exit;
}

// 5. Enregistrer la présence
$reqPresence = $bdd->prepare("
    INSERT INTO absences (etudiant_id, seance_id, statut, justifiee, commentaire) 
    VALUES (:etudiant_id, :seance_id, 'present', 0, 'Présence par QR Code')
");

$insertion = $reqPresence->execute([
    "etudiant_id" => $idEtudiant,
    "seance_id" => $seance["id_seance"]
]);

if ($insertion) {
    echo json_encode(["success" => true, "message" => "Présence validée avec succès !"]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de l'enregistrement."]);
}
?>