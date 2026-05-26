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

    const parametres = new URLSearchParams(window.location.search);
    const idMessage = parametres.get("id");

    if (!idMessage) {
        alert("Aucun message sélectionné.");
        window.location.href = "messagerie.html";
        return;
    }

    const reponse = await fetch(
        "../../../backend/getMessage.php?id_message=" + idMessage +
        "&id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    if (!resultat.success) {
        alert(resultat.message);
        window.location.href = "messagerie.html";
        return;
    }

    const message = resultat.message;

    document.getElementById("expediteurMessage").textContent =
        message.expediteur_prenom + " " + message.expediteur_nom +
        " (" + message.expediteur_role + ")";

    document.getElementById("sujetMessage").textContent =
        message.sujet;

    document.getElementById("dateMessage").textContent =
        message.date_envoi;

    document.getElementById("contenuMessage").textContent =
        message.contenu;
});