<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$totalUtilisateurs = $bdd->query("
    SELECT COUNT(*) AS total FROM utilisateurs
")->fetch(PDO::FETCH_ASSOC)["total"];

$moyenneGenerale = $bdd->query("
    SELECT ROUND(AVG(note), 2) AS moyenne FROM notes
")->fetch(PDO::FETCH_ASSOC)["moyenne"];

$totalAbsences = $bdd->query("
    SELECT COUNT(*) AS total FROM absences
")->fetch(PDO::FETCH_ASSOC)["total"];

$totalSeances = $bdd->query("
    SELECT COUNT(*) AS total FROM seances
")->fetch(PDO::FETCH_ASSOC)["total"];

$tauxAbsence = 0;

if ($totalSeances > 0) {
    $tauxAbsence = ROUND(($totalAbsences / $totalSeances) * 100, 2);
}

echo json_encode([
    "success" => true,
    "stats" => [
        "total_utilisateurs" => $totalUtilisateurs,
        "moyenne_generale" => $moyenneGenerale,
        "total_absences" => $totalAbsences,
        "taux_absence" => $tauxAbsence
    ]
]);
?>