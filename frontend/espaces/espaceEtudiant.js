document.addEventListener("DOMContentLoaded", () => {

    // Récupération des données utilisateur
    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    // Vérification sécurité
    if (!utilisateur) {

        // Retour à la page de connexion
        window.location.href = "../authentification.html";
        return;
    }

    // Affichage du nom
    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    // Affichage du rôle
    document.getElementById("roleUtilisateur").textContent =
        utilisateur.role;

    
        // Bouton déconnexion
    document.getElementById("btnDeconnexion")
    .addEventListener("click", () => {

        localStorage.removeItem("utilisateurConnecte");

        window.location.href = "../authentification.html";
    });
});

