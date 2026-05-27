<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$requete = $bdd->query("
    SELECT
        id_utilisateur,
        prenom,
        nom,
        role
    FROM utilisateurs

    WHERE role != 'etudiant'

    ORDER BY nom ASC
");

$utilisateurs =
    $requete->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "utilisateurs" => $utilisateurs
]);
?>