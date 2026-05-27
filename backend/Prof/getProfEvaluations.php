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
    SELECT
        cours.titre AS matiere,
        notes.type_evaluation,
        DATE(notes.date_creation) AS date_evaluation,
        COUNT(notes.id_note) AS nombre_notes
    FROM notes

    INNER JOIN cours
        ON notes.cours_id = cours.id_cours

    INNER JOIN enseignants
        ON cours.enseignant_id = enseignants.id_enseignant

    WHERE enseignants.utilisateur_id = :id_utilisateur

    GROUP BY
        cours.titre,
        notes.type_evaluation,
        DATE(notes.date_creation)

    ORDER BY date_evaluation DESC
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

echo json_encode([
    "success" => true,
    "evaluations" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>