<?php
header("Content-Type: application/json");

require_once "../../connexionBDD.php";

$etudiantId = $_POST["etudiant_id"] ?? null;
$seanceId = $_POST["seance_id"] ?? null;
$statut = $_POST["statut"] ?? "";
$justifiee = $_POST["justifiee"] ?? 0;
$commentaire = $_POST["commentaire"] ?? "";

if (!$etudiantId || !$seanceId || empty($statut)) {
    echo json_encode([
        "success" => false,
        "message" => "Champs manquants."
    ]);
    exit;
}

if (!in_array($statut, ["present", "absent", "retard"])) {
    echo json_encode([
        "success" => false,
        "message" => "Statut invalide."
    ]);
    exit;
}

/* =========================
   VÉRIFICATION GROUPE
========================= */

$verificationGroupe = $bdd->prepare("
    SELECT seances.id_seance

    FROM seances

    INNER JOIN cours
        ON seances.cours_id = cours.id_cours

    INNER JOIN inscriptions
        ON cours.id_cours = inscriptions.cours_id

    INNER JOIN etudiants
        ON inscriptions.etudiant_id = etudiants.id_etudiant

    WHERE seances.id_seance = :seance_id
    AND etudiants.id_etudiant = :etudiant_id
    AND etudiants.groupe = seances.groupe
");

$verificationGroupe->execute([
    "seance_id" => $seanceId,
    "etudiant_id" => $etudiantId
]);

$autorise = $verificationGroupe->fetch(PDO::FETCH_ASSOC);

if (!$autorise) {

    echo json_encode([
        "success" => false,
        "message" => "Cet étudiant n'appartient pas au groupe de cette séance."
    ]);

    exit;
}

if ($statut === "present") {
    $requete = $bdd->prepare("
        DELETE FROM absences
        WHERE etudiant_id = :etudiant_id
        AND seance_id = :seance_id
    ");

    $requete->execute([
        "etudiant_id" => $etudiantId,
        "seance_id" => $seanceId
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Présence enregistrée."
    ]);
    exit;
}

$verification = $bdd->prepare("
    SELECT id_absence
    FROM absences
    WHERE etudiant_id = :etudiant_id
    AND seance_id = :seance_id
");

$verification->execute([
    "etudiant_id" => $etudiantId,
    "seance_id" => $seanceId
]);

$absenceExistante = $verification->fetch(PDO::FETCH_ASSOC);

if ($absenceExistante) {
    $requete = $bdd->prepare("
        UPDATE absences
        SET statut = :statut,
            justifiee = :justifiee,
            commentaire = :commentaire
        WHERE id_absence = :id_absence
    ");

    $requete->execute([
        "statut" => $statut,
        "justifiee" => $justifiee,
        "commentaire" => $commentaire,
        "id_absence" => $absenceExistante["id_absence"]
    ]);
} else {
    $requete = $bdd->prepare("
        INSERT INTO absences
        (etudiant_id, seance_id, statut, justifiee, commentaire)
        VALUES
        (:etudiant_id, :seance_id, :statut, :justifiee, :commentaire)
    ");

    $requete->execute([
        "etudiant_id" => $etudiantId,
        "seance_id" => $seanceId,
        "statut" => $statut,
        "justifiee" => $justifiee,
        "commentaire" => $commentaire
    ]);
}

echo json_encode([
    "success" => true,
    "message" => "Présence enregistrée."
]);
?>