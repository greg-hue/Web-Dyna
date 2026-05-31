document.addEventListener("DOMContentLoaded", async () => {

    //vérif qu'un étudiant est connecté
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "etudiant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //affichage des infos utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Étudiant";

    //déconnexion
    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {
            localStorage.removeItem("utilisateurConnecte");
            window.location.href = "../../../authentification.html";
        });

    try {

        //recup des notes de l'étudiant
        const reponse = await fetch("../../../../backend/Etudiant/getEtudiantNotes.php?id_utilisateur=" + utilisateur.id);
        const resultat = await reponse.json();
        const listeNotes = document.getElementById("listeNotes");

        if (resultat.success) {

            //affichage des notes dans le tableau
            resultat.notes.forEach(note => {

                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.titre}</td>
                        <td>${note.type_evaluation}</td>
                        <td>${note.note}</td>
                        <td>${note.coefficient}</td>
                    </tr>
                `;
            });
        }

    } catch (erreur) {

        //gestion des erreurs de chargement
        console.error(erreur);
        alert("Erreur chargement notes");
    }
});