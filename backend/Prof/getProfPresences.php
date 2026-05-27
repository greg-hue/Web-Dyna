<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if (!$idUtilisateur) {
    echo json_encode(["success" => false, "message" => "Utilisateur manquant"]);
    exit;
}

$reqEns = $bdd->prepare("
    SELECT id_enseignant
    FROM enseignants
    WHERE utilisateur_id = :id_utilisateur
");

$reqEns->execute(["id_utilisateur" => $idUtilisateur]);
$enseignant = $reqEns->fetch(PDO::FETCH_ASSOC);

if (!$enseignant) {
    echo json_encode(["success" => false, "message" => "Enseignant introuvable"]);
    exit;
}

$idEnseignant = $enseignant["id_enseignant"];

$reqSeances = $bdd->prepare("
    SELECT
        seances.id_seance,
        seances.date_seance,
        seances.heure_debut,
        seances.heure_fin,
        seances.salle,
        seances.groupe,
        cours.titre
    FROM seances
    INNER JOIN cours ON seances.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
    ORDER BY seances.date_seance, seances.heure_debut
");

$reqSeances->execute(["id_enseignant" => $idEnseignant]);

$reqEtudiants = $bdd->prepare("
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

$reqEtudiants->execute(["id_enseignant" => $idEnseignant]);

$reqAbsences = $bdd->prepare("
    SELECT
        absences.id_absence,
        absences.etudiant_id,
        absences.seance_id,
        absences.statut,
        absences.justifiee,
        absences.commentaire,
        utilisateurs.prenom,
        utilisateurs.nom,
        etudiants.groupe,
        cours.titre,
        seances.date_seance
    FROM absences
    INNER JOIN etudiants ON absences.etudiant_id = etudiants.id_etudiant
    INNER JOIN utilisateurs ON etudiants.utilisateur_id = utilisateurs.id_utilisateur
    INNER JOIN seances ON absences.seance_id = seances.id_seance
    INNER JOIN cours ON seances.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
    ORDER BY seances.date_seance DESC
");

$reqAbsences->execute(["id_enseignant" => $idEnseignant]);

echo json_encode([
    "success" => true,
    "seances" => $reqSeances->fetchAll(PDO::FETCH_ASSOC),
    "etudiants" => $reqEtudiants->fetchAll(PDO::FETCH_ASSOC),
    "absences" => $reqAbsences->fetchAll(PDO::FETCH_ASSOC)
]);
?>