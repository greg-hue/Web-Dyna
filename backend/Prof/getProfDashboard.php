<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$idUtilisateur = $_GET["id_utilisateur"] ?? null;

if (!$idUtilisateur) {
    echo json_encode([
        "success" => false,
        "message" => "Utilisateur manquant"
    ]);
    exit;
}

$requete = $bdd->prepare("
    SELECT id_enseignant
    FROM enseignants
    WHERE utilisateur_id = :id_utilisateur
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

$enseignant = $requete->fetch(PDO::FETCH_ASSOC);

if (!$enseignant) {
    echo json_encode([
        "success" => false,
        "message" => "Enseignant introuvable"
    ]);
    exit;
}

$idEnseignant = $enseignant["id_enseignant"];

$requeteCoursSemaine = $bdd->prepare("
    SELECT COUNT(*) AS total_cours_semaine
    FROM seances
    INNER JOIN cours
        ON seances.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
    AND seances.date_seance BETWEEN '2026-09-01' AND '2026-09-05'
");

$requeteCoursSemaine->execute([
    "id_enseignant" => $idEnseignant
]);

$totalCoursSemaine =
    $requeteCoursSemaine->fetch(PDO::FETCH_ASSOC)["total_cours_semaine"];

$requeteEtudiants = $bdd->prepare("
    SELECT COUNT(DISTINCT inscriptions.etudiant_id) AS total_etudiants
    FROM inscriptions
    INNER JOIN cours
        ON inscriptions.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
");

$requeteEtudiants->execute([
    "id_enseignant" => $idEnseignant
]);

$totalEtudiants =
    $requeteEtudiants->fetch(PDO::FETCH_ASSOC)["total_etudiants"];

$requetePlanning = $bdd->prepare("
    SELECT
        seances.date_seance,
        seances.heure_debut,
        seances.heure_fin,
        seances.salle,
        seances.type_seance,
        seances.groupe,
        cours.titre
    FROM seances
    INNER JOIN cours
        ON seances.cours_id = cours.id_cours
    WHERE cours.enseignant_id = :id_enseignant
    AND seances.date_seance BETWEEN '2026-09-01' AND '2026-09-05'
    ORDER BY seances.date_seance, seances.heure_debut
");

$requetePlanning->execute([
    "id_enseignant" => $idEnseignant
]);

echo json_encode([
    "success" => true,
    "stats" => [
        "total_cours_semaine" => $totalCoursSemaine,
        "total_etudiants" => $totalEtudiants
    ],
    "planning" => $requetePlanning->fetchAll(PDO::FETCH_ASSOC)
]);
?>