<?php
header("Content-Type: application/json");

require_once "connexionBDD.php";

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
        utilisateurs.prenom,
        utilisateurs.nom,
        etudiants.groupe,
        cours.titre AS matiere,
        notes.type_evaluation,
        notes.note,
        notes.coefficient,
        notes.date_creation
    FROM notes

    INNER JOIN etudiants
        ON notes.etudiant_id = etudiants.id_etudiant

    INNER JOIN utilisateurs
        ON etudiants.utilisateur_id = utilisateurs.id_utilisateur

    INNER JOIN cours
        ON notes.cours_id = cours.id_cours

    INNER JOIN enseignants
        ON cours.enseignant_id = enseignants.id_enseignant

    WHERE enseignants.utilisateur_id = :id_utilisateur

    ORDER BY cours.titre, utilisateurs.nom
");

$requete->execute([
    "id_utilisateur" => $idUtilisateur
]);

echo json_encode([
    "success" => true,
    "notes" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>