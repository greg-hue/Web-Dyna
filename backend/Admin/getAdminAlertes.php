<?php
header("Content-Type: application/json");

require_once "../connexionBDD.php";

$requete = $bdd->query("
    SELECT
        notifications.titre,
        notifications.message,
        notifications.est_lue,
        notifications.date_creation,
        utilisateurs.prenom,
        utilisateurs.nom,
        utilisateurs.role
    FROM notifications

    INNER JOIN utilisateurs
        ON notifications.utilisateur_id = utilisateurs.id_utilisateur

    WHERE utilisateurs.role = 'admin'

    ORDER BY notifications.date_creation DESC
");

echo json_encode([
    "success" => true,
    "alertes" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>