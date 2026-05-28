document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Professeur";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    const selectSeance = document.getElementById("seanceId");
    const selectEtudiant = document.getElementById("etudiantId");
    const listePresences = document.getElementById("listePresences");
    const messagePresence = document.getElementById("messagePresence");
    const btnGenererQR = document.getElementById("btnGenererQR");
    const zoneQrCode = document.getElementById("qrcode");

    let etudiantsParSeance = {};
    let toutesLesAbsences = []; //On stocke tout en mémoire pour filtrer

   //affichage d'un message de succes ou d'erreur
    function afficherMessage(type, texte) {
        messagePresence.className = "";
        if (type === "success") {
            messagePresence.classList.add("message-success");
            messagePresence.style.color = "green";
        } else {
            messagePresence.classList.add("message-error");
            messagePresence.style.color = "red";
        }
        messagePresence.textContent = texte;
    }

   //on chargge les donnees
    // L'argument initial évite de reinitialiser les menus quand on actualise en arriere plan
    async function chargerPresences(initial = true) {
        try {
            const reponse = await fetch("../../../../backend/Prof/presence/getProfPresences.php?id_utilisateur=" + utilisateur.id);
            const resultat = await reponse.json();

            if (resultat.success) {
                etudiantsParSeance = resultat.etudiants_par_seance;
                toutesLesAbsences = resultat.absences;

                // On reconstruit la liste deroulante que la première fois
                if (initial) {
                    selectSeance.innerHTML = `<option value="">Choisir une séance</option>`;
                    selectEtudiant.innerHTML = `<option value="">Choisir un étudiant</option>`;
                    zoneQrCode.innerHTML = "";
                    
                    resultat.seances.forEach(seance => {
                        selectSeance.innerHTML += `
                            <option value="${seance.id_seance}">
                                ${seance.date_seance} - ${seance.heure_debut} - ${seance.titre} (${seance.groupe}) - ${seance.salle}
                            </option>
                        `;
                    });
                }

                // On met à jour le tableau visuel en fonction du menu selectionne
                actualiserTableau(selectSeance.value);

            } else if (initial) {
                afficherMessage("error", "❌ " + resultat.message);
            }
        } catch (e) {
            console.error("Erreur de rafraîchissement réseau");
        }
    }

    //on actualise le tableau des filtres de seance
    function actualiserTableau(idSeanceFiltre) {
        listePresences.innerHTML = "";

        let presencesAafficher = toutesLesAbsences;

        // Si le prof a choisi une seance, on filtre pour ne montrer que cette séance
        if (idSeanceFiltre) {
            presencesAafficher = toutesLesAbsences.filter(abs => abs.seance_id == idSeanceFiltre || abs.id_seance == idSeanceFiltre);
        }

        if (presencesAafficher.length === 0) {
            listePresences.innerHTML = `<tr><td colspan="7" style="text-align:center;">Aucune donnée pour cette sélection.</td></tr>`;
            return;
        }

        presencesAafficher.forEach(absence => {
            // differente couleures pour les differentes statuts de presence
            let couleurStatut = "black";
            if (absence.statut.toLowerCase() === 'present') couleurStatut = 'green';
            if (absence.statut.toLowerCase() === 'absent') couleurStatut = 'red';
            if (absence.statut.toLowerCase() === 'retard') couleurStatut = 'darkorange';

            listePresences.innerHTML += `
                <tr>
                    <td>${absence.date_seance}</td>
                    <td>${absence.prenom} ${absence.nom}</td>
                    <td>${absence.groupe}</td>
                    <td>${absence.titre}</td>
                    <td style="color:${couleurStatut}; font-weight:bold;">${absence.statut}</td>
                    <td>${absence.justifiee == 1 ? "Oui" : "Non"}</td>
                    <td>${absence.commentaire || ""}</td>
                </tr>
            `;
        });
    }

    //on change la seance dans le menu
    selectSeance.addEventListener("change", () => {
        const idSeance = selectSeance.value;

        //On filtre le tableau en bas 
        actualiserTableau(idSeance);

        //On met a jour la liste des etudiants pour l ajustement manuel
        selectEtudiant.innerHTML = `<option value="">Choisir un étudiant</option>`;
        zoneQrCode.innerHTML = "";

        if (!idSeance || !etudiantsParSeance[idSeance]) return;

        etudiantsParSeance[idSeance].forEach(etudiant => {
            selectEtudiant.innerHTML += `
                <option value="${etudiant.id_etudiant}">
                    ${etudiant.prenom} ${etudiant.nom} (${etudiant.groupe})
                </option>
            `;
        });
    });

    //generation d'un QR code pour la seance selectionnee
    btnGenererQR.addEventListener("click", async () => {
        const idSeance = selectSeance.value;

        if (!idSeance) {
            alert("⚠️ Veuillez sélectionner une séance.");
            return;
        }

        const formData = new FormData();
        formData.append("id_seance", idSeance);

        try {
            const reponse = await fetch("../../../../backend/Prof/presence/genererQRSeance.php", {
                method: "POST",
                body: formData
            });
            const resultat = await reponse.json();

            if (resultat.success) {
                zoneQrCode.innerHTML = "";
                const carte = document.createElement("div");
                carte.className = "carte-qrcode";
                const titre = document.createElement("h3");
                titre.textContent = "✅ L'appel QR Code est lancé !";
                const qrImage = document.createElement("div");
                qrImage.id = "qr-image";
                qrImage.className = "qr-image";
                const texteSecours = document.createElement("p");
                texteSecours.className = "code-manuel";
                texteSecours.innerHTML = `Code de secours : <span class="code-token">${resultat.token}</span>`;

                carte.appendChild(titre);
                carte.appendChild(qrImage);
                carte.appendChild(texteSecours);
                zoneQrCode.appendChild(carte);

                new QRCode(qrImage, {
                    text: resultat.token,
                    width: 200,
                    height: 200
                });
            } else {
                alert("❌ Erreur lors de la génération : " + resultat.message);
            }
        } catch (e) {
            alert("❌ Erreur réseau : Impossible de joindre le serveur.");
        }
    });

   //enregistrement manuellement de la presencee
    document.getElementById("formPresence").addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!selectSeance.value) {
            alert("⚠️ Veuillez sélectionner une séance.");
            return;
        }

        const donnees = new FormData();
        donnees.append("seance_id", selectSeance.value);
        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("statut", document.getElementById("statut").value);
        donnees.append("justifiee", document.getElementById("justifiee").value);
        donnees.append("commentaire", document.getElementById("commentaire").value);

        const reponse = await fetch("../../../../backend/Prof/presence/addProfPresence.php", {
            method: "POST",
            body: donnees
        });

        const resultat = await reponse.json();

        if (resultat.success) {
            afficherMessage("success", " Ajustement enregistré avec succès.");
            event.target.reset();
            chargerPresences(true); // On recharge tout pour la sécurité
        } else {
            afficherMessage("error", + resultat.message);
        }
    });

    
    chargerPresences(true); // Au lancement de la page

    // Le tableau se rafraîchit discrètement toutes les 3 secondes.
    // L'étudiant scanne -> Son nom apparaît en present
    setInterval(() => {
        chargerPresences(false);
    }, 3000);

});