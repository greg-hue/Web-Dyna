document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur || utilisateur.role !== "admin") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    document.getElementById("btnDeconnexion")
    .addEventListener("click", () => {

        localStorage.removeItem("utilisateurConnecte");

        window.location.href =
            "../../authentification.html";
    });

    const reponse = await fetch(
        "../../../backend/Admin/getAdminUtilisateurs.php"
    );

    const resultat = await reponse.json();

    const liste =
        document.getElementById("listeUtilisateurs");

    if (resultat.success) {

        resultat.utilisateurs.forEach(utilisateur => {

            liste.innerHTML += `
                <tr>
                    <td>
                        ${utilisateur.prenom}
                        ${utilisateur.nom}
                    </td>

                    <td>
                        ${utilisateur.email}
                    </td>

                    <td>
                        ${utilisateur.role}
                    </td>

                    <td>
                        ${utilisateur.date_creation}
                    </td>
                </tr>
            `;
        });
    }
});