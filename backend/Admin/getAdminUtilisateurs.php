<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$requete = $bdd->query("
    SELECT
        id_utilisateur,
        prenom,
        nom,
        email,
        role,
        date_creation
    FROM utilisateurs
    ORDER BY nom ASC
");

$utilisateurs = $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "utilisateurs" => $utilisateurs
]);
?>