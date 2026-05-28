<?php
header("Content-Type: application/json");
require_once "../../connexionBDD.php";

$idSeance = $_POST["id_seance"] ?? null;

if (!$idSeance) {
    echo json_encode(["success" => false, "message" => "ID de la séance manquant."]);
    exit;
}

try {
    $token = bin2hex(random_bytes(16)); 

    // On utilise les bonnes colonnes : token et token_expiration (Heure actuelle + 1 minute)
    $requete = $bdd->prepare("
        UPDATE seances 
        SET token = :token, 
            token_expiration = DATE_ADD(NOW(), INTERVAL 1 MINUTE) 
        WHERE id_seance = :id_seance
    ");
    
    $succes = $requete->execute([
        "token" => $token,
        "id_seance" => $idSeance
    ]);

    if ($succes) {
        echo json_encode(["success" => true, "token" => $token]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur BDD lors de l'enregistrement du token."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Erreur serveur : " . $e->getMessage()]);
}
?>