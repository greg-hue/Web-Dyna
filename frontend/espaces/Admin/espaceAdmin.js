document.addEventListener("DOMContentLoaded", () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    // Sécurité
    if (!utilisateur || utilisateur.role !== "admin") {
        window.location.href = "../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    // Déconnexion
    document.getElementById("btnDeconnexion")
    .addEventListener("click", () => {

        localStorage.removeItem("utilisateurConnecte");

        window.location.href = "../authentification.html";
    });

});