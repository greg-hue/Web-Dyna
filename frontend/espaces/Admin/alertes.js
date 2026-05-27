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

    const reponse = await fetch("../../../backend/Admin/getAdminAlertes.php");
    const resultat = await reponse.json();

    const liste = document.getElementById("listeAlertes");

    if (resultat.success) {
        resultat.alertes.forEach(alerte => {
            liste.innerHTML += `
                <tr>
                    <td>${alerte.date_creation}</td>
                    <td>${alerte.titre}</td>
                    <td>${alerte.message}</td>
                </tr>
            `;
        });
    }
});