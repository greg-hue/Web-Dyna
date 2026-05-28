<?php
header("Content-Type: application/json");
require_once "../../connexionBDD.php";

// On récupère l'ID du cours envoyé par le bouton vert
$idSeance = $_POST["id_seance"] ?? null;

if (!$idSeance) {
    echo json_encode(["success" => false, "message" => "ID de la séance manquant."]);
    exit;
}

try {
    // 1. On génère une clé secrète aléatoire et unique (le fameux Token)
    $token = bin2hex(random_bytes(16)); 

    // 2. On insère cette clé dans la table de la séance pour que les étudiants puissent la comparer
    $requete = $bdd->prepare("UPDATE seances SET qr_token = :token WHERE id_seance = :id_seance");
    $succes = $requete->execute([
        "token" => $token,
        "id_seance" => $idSeance
    ]);

    // 3. On renvoie le feu vert au JavaScript avec la clé
    if ($succes) {
        echo json_encode([
            "success" => true, 
            "token" => $token
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Erreur BDD lors de l'enregistrement du token."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Erreur serveur : " . $e->getMessage()
    ]);
}
?>