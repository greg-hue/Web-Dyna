<?php
$host = "localhost";
$dbname = "ifsi_smartcampus";
$username = "root";
$password = "root";
$port = "3306"

try {
    $bdd = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur de connexion à la base de données",
        "details" => $e->getMessage()
    ]);
    exit;
}
?>