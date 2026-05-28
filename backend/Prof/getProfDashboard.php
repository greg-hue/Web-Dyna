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

/* =========================================
   Recherche enseignant
========================================= */

$requeteEns = $bdd->prepare("
    SELECT id_enseignant
    FROM enseignants
    WHERE utilisateur_id = :id_utilisateur
");

$requeteEns->execute([
    "id_utilisateur" => $idUtilisateur
]);

$enseignant = $requeteEns->fetch(PDO::FETCH_ASSOC);

if (!$enseignant) {

    echo json_encode([
        "success" => false,
        "message" => "Enseignant introuvable"
    ]);

    exit;
}

$idEnseignant = $enseignant["id_enseignant"];

/* =========================================
   Statistiques
========================================= */

$requeteCoursSemaine = $bdd->prepare("
    SELECT COUNT(*) AS total_cours_semaine
    FROM seances

    INNER JOIN cours
        ON seances.cours_id = cours.id_cours

    WHERE cours.enseignant_id = :id_enseignant
");

$requeteCoursSemaine->execute([
    "id_enseignant" => $idEnseignant
]);

$totalCoursSemaine =
    $requeteCoursSemaine
        ->fetch(PDO::FETCH_ASSOC)["total_cours_semaine"];

/* =========================================
   Nombre étudiants
========================================= */

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
    $requeteEtudiants
        ->fetch(PDO::FETCH_ASSOC)["total_etudiants"];

/* =========================================
   Planning / cours
========================================= */

$requetePlanning = $bdd->prepare("

    SELECT

        seances.id_seance,

        seances.date_seance,
        seances.heure_debut,
        seances.heure_fin,

        seances.salle,
        seances.type_seance,

        seances.groupe,
        seances.groupe AS classe,

        cours.titre,
        cours.titre AS matiere

    FROM seances

    INNER JOIN cours
        ON seances.cours_id = cours.id_cours

    WHERE cours.enseignant_id = :id_enseignant

    ORDER BY seances.date_seance DESC,
             seances.heure_debut
");

$requetePlanning->execute([
    "id_enseignant" => $idEnseignant
]);

$planning = $requetePlanning->fetchAll(PDO::FETCH_ASSOC);

/* =========================================
   Réponse JSON finale
========================================= */

echo json_encode([

    "success" => true,

    "stats" => [
        "total_cours_semaine" => $totalCoursSemaine,
        "total_etudiants" => $totalEtudiants
    ],

    /* Compatibilité V1 */
    "planning" => $planning,

    /* Compatibilité V2 */
    "cours" => $planning

]);

?>