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

    const reponse = await fetch(
        "../../../backend/Admin/getAdminDashboard.php"
    );

    const resultat = await reponse.json();

    console.log(resultat);

    if (resultat.success) {

        document.getElementById("totalEtudiants").textContent =
            resultat.stats.total_etudiants;

        document.getElementById("totalProfs").textContent =
            resultat.stats.total_profs;

        document.getElementById("totalGroupes").textContent =
            resultat.stats.total_groupes;

        const liste = document.getElementById("listeDerniersUtilisateurs");

        liste.innerHTML = "";

        resultat.utilisateurs.forEach(utilisateur => {
            liste.innerHTML += `
                <tr>
                    <td>${utilisateur.prenom} ${utilisateur.nom}</td>
                    <td>${utilisateur.role}</td>
                    <td>${utilisateur.date_creation}</td>
                </tr>
            `;
        });
    }
});