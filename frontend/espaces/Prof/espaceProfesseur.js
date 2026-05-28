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
        "../../../backend/Prof/getProfDashboard.php?id_utilisateur=" + utilisateur.id
    );

    const resultat = await reponse.json();

    if (resultat.success) {
        document.getElementById("totalCoursSemaine").textContent =
            resultat.stats.total_cours_semaine;

        document.getElementById("totalEtudiants").textContent =
            resultat.stats.total_etudiants;

        const planningProf = document.getElementById("planningProf");

        resultat.planning.forEach(seance => {
            planningProf.innerHTML += `
                <tr>
                    <td>${seance.date_seance}</td>
                    <td>${seance.heure_debut} - ${seance.heure_fin}</td>
                    <td>${seance.titre} (${seance.groupe})</td>
                    <td>${seance.salle}</td>
                    <td>
                        <button 
    			            onclick="genererQRCode(${seance.id_seance})"
    			            class="bouton-appel" data-id-seance="${seance.id_seance}"
			            >Faire l'appel</button>
                    </td>
                </tr>
            `;
        });
    }


async function genererQRCode(idSeance) {
    const formData = new FormData();
    formData.append("id_seance", idSeance);

    const reponse = await fetch("../../../backend/Prof/presence/genererQRSeance.php", {
        method: "POST",
        body: formData
    });

    const resultat = await reponse.json();

    if (resultat.success) {
        // Vider l'ancien QR code s'il y en avait un
        document.getElementById("qrcode").innerHTML = "";
        
        // Générer le visuel du QR code avec le token sécurisé
        new QRCode(document.getElementById("qrcode"), {
            text: resultat.token,
            width: 256,
            height: 256
        });
        
        alert("QR Code généré ! Il expirera dans 15 minutes.");
    } else {
        alert(resultat.message);
    }
}
});

window.genererQRCode = async function(idSeance) {
    const formData = new FormData();
    formData.append("id_seance", idSeance);

    const reponse = await fetch("../../../backend/Prof/presence/genererQRSeance.php", {
        method: "POST",
        body: formData
    });

    const resultat = await reponse.json();

    if (resultat.success) {
        document.getElementById("qrcode").innerHTML = "<h3>Scannez ce code pour valider votre présence :</h3><br>";
        new QRCode(document.getElementById("qrcode"), {
            text: resultat.token,
            width: 200,
            height: 200
        });
    } else {
        alert("Erreur : " + resultat.message);
    }
}
