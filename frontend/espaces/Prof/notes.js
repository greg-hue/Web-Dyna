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
        "../../../backend/getProfNotes.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    const listeNotes = document.getElementById("listeNotes");

    if (resultat.success) {
        resultat.notes.forEach(note => {
            listeNotes.innerHTML += `
                <tr>
                    <td>${note.prenom} ${note.nom}</td>
                    <td>${note.matiere}</td>
                    <td>${note.note}/20</td>
                </tr>
            `;
        });
    }
});