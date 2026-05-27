<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$requete = $bdd->query("
    SELECT
        groupe,
        COUNT(*) AS nombre_etudiants
    FROM etudiants
    GROUP BY groupe
    ORDER BY groupe
");

echo json_encode([
    "success" => true,
    "classes" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>