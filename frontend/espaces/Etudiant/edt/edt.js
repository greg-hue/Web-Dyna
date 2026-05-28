document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur || utilisateur.role !== "etudiant") {

        window.location.href =
            "../../../authentification.html";

        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Étudiant";

    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {

            localStorage.removeItem(
                "utilisateurConnecte"
            );

            window.location.href =
                "../../../authentification.html";
        });

    try {

        const reponse = await fetch(
            "../../../../backend/Etudiant/getEtudiantSeances.php?id_utilisateur="
            + utilisateur.id
        );

        const resultat = await reponse.json();

        const listeSeances =
            document.getElementById("listeSeances");

        if (resultat.success) {
            let dateActuelle = null;
            listeSeances.innerHTML = "";

            resultat.seances.forEach(seance => {

                if (seance.date_seance !== dateActuelle) {
                    dateActuelle = seance.date_seance;
                    
                    listeSeances.innerHTML += `
                       <tr>
                            <td>
                                Journée du ${dateActuelle}
                            </td>
                        </tr>
                    `;
                }


                listeSeances.innerHTML += `
                    <tr>
                        <td>${seance.titre}</td>
                        <td>${seance.date_seance}</td>
                        <td>
                            ${seance.heure_debut}
                            -
                            ${seance.heure_fin}
                        </td>
                        <td>${seance.salle}</td>
                        <td>${seance.type_seance}</td>
                    </tr>
                `;
            });
        }

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur emploi du temps");
    }

});
