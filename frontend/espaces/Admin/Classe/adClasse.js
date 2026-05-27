document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "admin") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    const reponse = await fetch("../../../../backend/Admin/getAdminClasses.php");
    const resultat = await reponse.json();

    const liste = document.getElementById("listeClasses");

    if (resultat.success) {
        resultat.classes.forEach(classe => {
            liste.innerHTML += `
                <tr>
                    <td>${classe.groupe}</td>
                    <td>${classe.nombre_etudiants}</td>
                    <td>Promotion 2026</td>
                </tr>
            `;
        });
    }
});