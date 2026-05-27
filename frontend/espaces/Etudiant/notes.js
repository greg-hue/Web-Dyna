document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateurConnecte")
    );

    if (!utilisateur || utilisateur.role !== "etudiant") {

        window.location.href =
            "../../authentification.html";

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
                "../../authentification.html";
        });

    try {

        const reponse = await fetch(
            "../../../backend/Etudiant/getEtudiantNotes.php?id_utilisateur="
            + utilisateur.id
        );

        const resultat = await reponse.json();

        const listeNotes =
            document.getElementById("listeNotes");

        if (resultat.success) {

            resultat.notes.forEach(note => {

                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.titre}</td>
                        <td>${note.type_evaluation}</td>
                        <td>${note.note}</td>
                        <td>${note.coefficient}</td>
                        <td>
                            ${note.validee == 1
                                ? "Validée"
                                : "En attente"}
                        </td>
                    </tr>
                `;
            });
        }

    } catch (erreur) {

        console.error(erreur);

        alert("Erreur chargement notes");
    }

});

