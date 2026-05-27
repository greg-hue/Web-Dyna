<?php
header("Content-Type: application/json");
require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

$reqEns = $bdd->prepare("
    SELECT id_enseignant FROM enseignants
    WHERE utilisateur_id = :id
");
$reqEns->execute(["id" => $idUtilisateur]);
$enseignant = $reqEns->fetch(PDO::FETCH_ASSOC);

if (!$enseignant) {
    echo json_encode(["success" => false, "message" => "Enseignant introuvable"]);
    exit;
}

$idEnseignant = $enseignant["id_enseignant"];

$notes = $bdd->prepare("
    SELECT
        notes.id_note,
        notes.etudiant_id,
        notes.cours_id,
        utilisateurs.prenom,
        utilisateurs.nom,
        etudiants.groupe,
        cours.titre AS matiere,
        notes.type_evaluation,
        notes.note,
        notes.coefficient
    FROM notes
    INNER JOIN etudiants ON notes.etudiant_id = etudiants.id_etudiant
    INNER JOIN utilisateurs ON etudiants.utilisateur_id = utilisateurs.id_utilisateur
    INNER JOIN cours ON notes.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
    ORDER BY cours.titre, utilisateurs.nom
");
$notes->execute(["id_enseignant" => $idEnseignant]);

$etudiants = $bdd->prepare("
    SELECT DISTINCT
        etudiants.id_etudiant,
        utilisateurs.prenom,
        utilisateurs.nom,
        etudiants.groupe
    FROM inscriptions
    INNER JOIN etudiants ON inscriptions.etudiant_id = etudiants.id_etudiant
    INNER JOIN utilisateurs ON etudiants.utilisateur_id = utilisateurs.id_utilisateur
    INNER JOIN cours ON inscriptions.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
    ORDER BY utilisateurs.nom
");
$etudiants->execute(["id_enseignant" => $idEnseignant]);

$cours = $bdd->prepare("
    SELECT id_cours, titre
    FROM cours
    WHERE enseignant_id = :id_enseignant
");
$cours->execute(["id_enseignant" => $idEnseignant]);

echo json_encode([
    "success" => true,
    "notes" => $notes->fetchAll(PDO::FETCH_ASSOC),
    "etudiants" => $etudiants->fetchAll(PDO::FETCH_ASSOC),
    "cours" => $cours->fetchAll(PDO::FETCH_ASSOC)
]);
?>