document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "admin") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    const reponse = await fetch("../../../backend/Admin/getAdminStats.php");
    const resultat = await reponse.json();

    if (resultat.success) {
        document.getElementById("moyenneGenerale").textContent =
            resultat.stats.moyenne_generale + "/20";

        document.getElementById("totalAbsences").textContent =
            resultat.stats.total_absences;

        document.getElementById("tauxAbsence").textContent =
            resultat.stats.taux_absence + "%";

        document.getElementById("totalUtilisateurs").textContent =
            resultat.stats.total_utilisateurs;
    }
});