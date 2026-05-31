document.addEventListener("DOMContentLoaded", async () => {

    // Vérifie qu'un étudiant est connecté
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "etudiant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    // affichage des informations utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Étudiant";

    // Déconnexion
    document.getElementById("btnDeconnexion")
        .addEventListener("click", () => {
            localStorage.removeItem("utilisateurConnecte");
            window.location.href ="../../../authentification.html";
        });

    // Récupération des messages de l'étudiant
    const reponse = await fetch("../../../../backend/Etudiant/getEtudiantMessages.php?id_utilisateur=" + utilisateur.id); 
    const resultat = await reponse.json();
    const listeMessages = document.getElementById("listeMessages");

    if (resultat.success) {

        //affichage des messages dans le tableau
        resultat.messages.forEach(message => {

            listeMessages.innerHTML += `
                <tr
                    onclick="window.location.href='message.html?id=${message.id_message}'"
                    style="cursor:pointer;"
                >

                    <td>
                        ${message.prenom}
                        ${message.nom}
                    </td>

                    <td>
                        ${message.sujet}
                    </td>

                    <td>
                        ${message.date_envoi}
                    </td>

                </tr>
            `;
        });
    }
});