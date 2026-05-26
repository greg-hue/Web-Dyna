document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent = "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    const reponse = await fetch(
        "../../../backend/getProfCours.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    const listeCours = document.getElementById("listeCours");

    if (resultat.success) {
        resultat.cours.forEach(cours => {
            listeCours.innerHTML += `
                <tr>
                    <td>${cours.titre}</td>
                    <td>Niveau ${cours.niveau} - Semestre ${cours.semestre}</td>
                    <td>${cours.capacite_max} étudiants max</td>
                </tr>
            `;
        });
    }
});