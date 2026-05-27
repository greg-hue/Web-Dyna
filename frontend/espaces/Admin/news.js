document.addEventListener("DOMContentLoaded", () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "admin") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent =
        utilisateur.prenom + " " + utilisateur.nom;

    document.getElementById("roleUtilisateur").textContent =
        "Administrateur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    const formulaire = document.getElementById("formNews");
    const messageNews = document.getElementById("messageNews");

    formulaire.addEventListener("submit", async (event) => {

        event.preventDefault();

        const donnees = new FormData();

        donnees.append("auteur_id", utilisateur.id);
        donnees.append("titre", document.getElementById("titreNews").value);
        donnees.append("categorie", document.getElementById("categorieNews").value);
        donnees.append("contenu", document.getElementById("contenuNews").value);

        const reponse = await fetch(
            "../../../backend/Admin/addAdminNews.php",
            {
                method: "POST",
                body: donnees
            }
        );

        const resultat = await reponse.json();

        if (resultat.success) {
            messageNews.style.color = "green";
            messageNews.textContent = "News publiée.";

            formulaire.reset();
        } else {
            messageNews.style.color = "red";
            messageNews.textContent = resultat.message;
        }
    });
});