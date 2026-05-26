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
        "../../../backend/getProfMessages.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    const listeMessages = document.getElementById("listeMessages");

    if (resultat.success) {
        resultat.messages.forEach(message => {
            listeMessages.innerHTML += `
                <tr 
                    onclick="window.location.href='message.html?id=${message.id_message}'"
                    style="cursor:pointer;"
                >
                    <td>${message.expediteur_prenom} ${message.expediteur_nom}</td>
                    <td>${message.sujet}</td>
                    <td>${message.date_envoi}</td>
                </tr>
            `;
        });
    }
});