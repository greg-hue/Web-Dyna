<?php
//Variables de configuration pour la BDD
$host = "localhost";
$dbname = "ifsi_smartcampus";
$username = "root";
$password = "root";
$port = "3306";

try {

//Tentative de connexion avec l'objet PDO et encodage utf8
    $bdd = new PDO(
        
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    //Active la gestion des erreurs SQL sous forme d'exceptions
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {

//Gere le cas ou la connexion a la BDD foire et renvoie l'erreur en json
    echo json_encode([
        "success" => false,
        "message" => "Erreur connexion BDD",
        "details" => $e->getMessage()
    ]);

    //Arrete l'execution du script
    exit;
}
?>