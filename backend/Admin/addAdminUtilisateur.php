<?php
header("Content-Type: application/json");
require_once "../connexionBDD.php";

$prenom = $_POST["prenom"] ?? "";
$nom = $_POST["nom"] ?? "";
$email = $_POST["email"] ?? "";
$motDePasse = $_POST["mot_de_passe"] ?? "";
$role = $_POST["role"] ?? "";

if (!$prenom || !$nom || !$email || !$motDePasse || !$role) {
    echo json_encode(["success" => false, "message" => "Tous les champs sont obligatoires."]);
    exit;
}

try {
    $bdd->beginTransaction();

    $req = $bdd->prepare("
        INSERT INTO utilisateurs
        (prenom, nom, email, mot_de_passe, role, telephone, date_creation)
        VALUES
        (:prenom, :nom, :email, :mot_de_passe, :role, '', NOW())
    ");

    $req->execute([
        "prenom" => $prenom,
        "nom" => $nom,
        "email" => $email,
        "mot_de_passe" => $motDePasse,
        "role" => $role
    ]);

    $idUtilisateur = $bdd->lastInsertId();

    if ($role === "etudiant") {
        $req = $bdd->prepare("
            INSERT INTO etudiants
            (utilisateur_id, numero_etudiant, promotion, niveau, groupe, date_naissance, adresse, contact_urgence)
            VALUES
            (:id, CONCAT('ETU', :id), 'Promotion 2026', 1, 'TD1', '2005-01-01', '', '')
        ");
        $req->execute(["id" => $idUtilisateur]);
    }

    if ($role === "enseignant") {
        $req = $bdd->prepare("
            INSERT INTO enseignants
            (utilisateur_id, specialisation, date_embauche)
            VALUES
            (:id, 'Non définie', CURDATE())
        ");
        $req->execute(["id" => $idUtilisateur]);
    }

    if ($role === "admin") {
        $req = $bdd->prepare("
            INSERT INTO administrateurs
            (utilisateur_id)
            VALUES
            (:id)
        ");
        $req->execute(["id" => $idUtilisateur]);
    }

    $bdd->commit();

    echo json_encode(["success" => true, "message" => "Utilisateur ajouté."]);

} catch (Exception $e) {
    $bdd->rollBack();

    echo json_encode([
        "success" => false,
        "message" => "Erreur ajout utilisateur.",
        "details" => $e->getMessage()
    ]);
}
?>