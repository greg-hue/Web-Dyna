<?php
//Configure la reponse pour renvoyer du json au frontend
header("Content-Type: application/json");

//Inclusion du fichier pour se connecter a la BDD
require_once "../connexionBDD.php";

//Execution de la requete avec un INNER JOIN pour recup toutes les alertes liées aux admins triées par date
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

//Envoi des alertes recuperees en json au frontend
echo json_encode([
    "success" => true,
    "alertes" => $requete->fetchAll(PDO::FETCH_ASSOC)
]);
?>