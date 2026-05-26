document.addEventListener("DOMContentLoaded", async () => {

    // =========================
    // Vérification utilisateur
    // =========================

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur || utilisateur.role !== "etudiant") {

        alert("Accès refusé");

        window.location.href = "../../../authentifications.html";

        return;
    }

    // =========================
    // Affichage utilisateur
    // =========================

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        utilisateur.role;

    // =========================
    // Déconnexion
    // =========================

    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {

            localStorage.removeItem("utilisateurConnecte");

            window.location.href = "../../../authentifications.html";
        });

    // =========================
    // Récupération des cours
    // =========================

    try {

        const reponse = await fetch(
            "../../../backend/Etudiant/getEtudiantCours.php?id_utilisateur="
            + utilisateur.id
        );

        const cours = await reponse.json();

        console.log(cours);

        const listeCours =
            document.getElementById("listeCours");

        listeCours.innerHTML = "";

        cours.forEach(coursItem => {

            listeCours.innerHTML += `
                <tr>
                    <td>${coursItem.code}</td>
                    <td>${coursItem.titre}</td>
                    <td>${coursItem.semestre}</td>
                    <td>${coursItem.credits}</td>
                    <td>${coursItem.enseignant}</td>
                </tr>
            `;
        });

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur lors du chargement des cours");
    }

});