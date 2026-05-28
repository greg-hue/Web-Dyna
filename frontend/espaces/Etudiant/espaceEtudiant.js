document.addEventListener("DOMContentLoaded", async () => {

    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    if (!utilisateur || utilisateur.role !== "etudiant") {
        window.location.href = "../../authentification.html";
        return;
    }

    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Étudiant";

    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../authentification.html";
    });

    let toutesLesSeances = [];
    let toutesLesNotes = [];
    let datePivot = new Date(); 

    /* =====================================
       1. CHARGEMENT DES SÉANCES
    ===================================== */
    try {
        const reponseSeances = await fetch("../../../backend/Etudiant/getEtudiantSeances.php?id_utilisateur=" + utilisateur.id);
        const resultatSeances = await reponseSeances.json();

        if (resultatSeances.success) {
            toutesLesSeances = resultatSeances.seances;
            if (toutesLesSeances.length > 0) {
                datePivot = new Date(toutesLesSeances[0].date_seance);
            }
        }

        /* =====================================
           2. CHARGEMENT DES NOTES & MOYENNE
        ===================================== */
        const reponseNotes = await fetch("../../../backend/Etudiant/getEtudiantNotes.php?id_utilisateur=" + utilisateur.id);
        const resultatNotes = await reponseNotes.json();
        const listeNotes = document.getElementById("listeNotes");

        let moyenne = 0;
        let totalCoef = 0;

        if (resultatNotes.success) {
            toutesLesNotes = resultatNotes.notes;
            listeNotes.innerHTML = "";

            if (toutesLesNotes.length === 0) {
                listeNotes.innerHTML = `<tr><td colspan="3" style="text-align:center;">Aucune note pour l'instant.</td></tr>`;
                document.getElementById("moyenneGenerale").textContent = "-";
            } else {
                toutesLesNotes.slice(0, 3).forEach(note => {
                    listeNotes.innerHTML += `
                        <tr>
                            <td>${note.titre}</td>
                            <td><strong>${note.note}</strong></td>
                            <td>${note.coefficient}</td>
                        </tr>
                    `;
                    moyenne += parseFloat(note.note) * parseFloat(note.coefficient);
                    totalCoef += parseFloat(note.coefficient);
                });

                if (totalCoef > 0) {
                    document.getElementById("moyenneGenerale").textContent = (moyenne / totalCoef).toFixed(2);
                }
            }
        }

        /* =====================================
           3. CHARGEMENT DES ABSENCES
        ===================================== */
        const reponseAbsences = await fetch("../../../backend/Etudiant/getEtudiantAbsences.php?id_utilisateur=" + utilisateur.id);
        const resultatAbsences = await reponseAbsences.json();
        const listeAbsences = document.getElementById("listeAbsences");

        if (resultatAbsences.success) {
            listeAbsences.innerHTML = "";
            document.getElementById("nombreAbsences").textContent = resultatAbsences.absences.length;

            if (resultatAbsences.absences.length === 0) {
                listeAbsences.innerHTML = `<tr><td colspan="2" style="text-align:center;">Aucune absence signalée.</td></tr>`;
            } else {
                resultatAbsences.absences.slice(0, 3).forEach(absence => {
                    let couleurStatut = absence.statut.toLowerCase() === 'retard' ? 'darkorange' : 'red';
                    listeAbsences.innerHTML += `
                        <tr>
                            <td>${absence.titre}<br><small style="color:gray;">${absence.date_seance}</small></td>
                            <td style="color:${couleurStatut}; font-weight:bold;">${absence.statut}</td>
                        </tr>
                    `;
                });
            }
        }

        /* =====================================
           4. DERNIÈRE NOTIFICATION (FOOTER DYNAMIQUE)
        ===================================== */
        try {
            const reponseNotifs = await fetch("../../../backend/Etudiant/getEtudiantNotifications.php?id_utilisateur=" + utilisateur.id);
            const resultatNotifs = await reponseNotifs.json();

            if (resultatNotifs.success && resultatNotifs.notifications && resultatNotifs.notifications.length > 0) {
                const derniereNotif = resultatNotifs.notifications[resultatNotifs.notifications.length - 1]; 
                const spansFooter = document.querySelectorAll(".barre-actualites span");
                
                if (spansFooter.length > 1) {
                    const texteAafficher = `${derniereNotif.titre} - ${derniereNotif.message}`;
                    spansFooter[1].textContent = texteAafficher;
                }
            }
        } catch (e) {
            console.error("Erreur lors du chargement de la dernière notification", e);
        }

        actualiserSemaineDynamique();

    } catch (erreur) {
        console.error(erreur);
        alert("Erreur lors du chargement du tableau de bord");
    }
    
    /* =====================================
       OUTILS POUR LA SEMAINE DYNAMIQUE
    ===================================== */
    function obtenirLimitesSemaine(date) {
        const jour = date.getDay();
        const distanceAuLundi = (jour === 0) ? -6 : 1 - jour;

        const lundi = new Date(date);
        lundi.setDate(date.getDate() + distanceAuLundi);
        lundi.setHours(0, 0, 0, 0);

        const dimanche = new Date(lundi);
        dimanche.setDate(lundi.getDate() + 6);
        dimanche.setHours(23, 59, 59, 999);

        return { lundi, dimanche };
    }

    function formaterDateCourte(date) {
        const j = String(date.getDate()).padStart(2, "0");
        const m = String(date.getMonth() + 1).padStart(2, "0");
        return `${j}/${m}`;
    }

    function actualiserSemaineDynamique() {
        const { lundi, dimanche } = obtenirLimitesSemaine(datePivot);
        document.getElementById("labelSemaine").textContent = `Du ${formaterDateCourte(lundi)} au ${formaterDateCourte(dimanche)}`;
        const listeSeances = document.getElementById("listeSeances");
        listeSeances.innerHTML = "";

        let seancesDeLaSemaine = toutesLesSeances.filter(seance => {
            const dateSeance = new Date(seance.date_seance);
            return dateSeance >= lundi && dateSeance <= dimanche;
        });

        seancesDeLaSemaine.sort((a, b) => {
            return new Date(a.date_seance + "T" + a.heure_debut) - new Date(b.date_seance + "T" + b.heure_debut);
        });

        const interrosSemaine = seancesDeLaSemaine.filter(seance => {
            const type = seance.type_seance ? seance.type_seance.toLowerCase() : "";
            return type.includes("eval") || type.includes("exam") || type.includes("td");
        }).length;
        document.getElementById("nombreControles").textContent = interrosSemaine;

        if (seancesDeLaSemaine.length === 0) {
            listeSeances.innerHTML = `
                <tr>
                    <td colspan="5" class="message-vide" style="text-align:center; padding: 20px;">
                        Aucun cours planifié pour cette semaine.
                    </td>
                </tr>
            `;
        } else {
            let dateEnCours = null;

            seancesDeLaSemaine.forEach(seance => {
                if (seance.date_seance !== dateEnCours) {
                    dateEnCours = seance.date_seance;
                    
                    listeSeances.innerHTML += `
                        <tr style="background-color: #e2e8f0;">
                            <td colspan="5" style="text-align: center; font-weight: bold; padding: 8px; color: #334155; text-transform: uppercase; letter-spacing: 1px;">
                                Journée du ${dateEnCours}
                            </td>
                        </tr>
                    `;
                }

                listeSeances.innerHTML += `
                    <tr>
                        <td style="color: gray;"><em>${seance.date_seance}</em></td>
                        <td>${seance.heure_debut.substring(0, 5)} - ${seance.heure_fin.substring(0, 5)}</td>
                        <td><span class="badge-type">${seance.type_seance || 'Cours'}</span></td>
                        <td class="titre-cours">${seance.titre}</td>
                        <td>${seance.salle}</td>
                    </tr>
                `;
            });
        }
    }

    document.getElementById("semainePrecedente").addEventListener("click", () => {
        datePivot.setDate(datePivot.getDate() - 7);
        actualiserSemaineDynamique();
    });

    document.getElementById("semaineSuivante").addEventListener("click", () => {
        datePivot.setDate(datePivot.getDate() + 7);
        actualiserSemaineDynamique();
    });

    /* =====================================
       VALIDATION DU QR CODE
    ===================================== */
    const messageZone = document.getElementById("messageAppel");
    const inputToken = document.getElementById("codePresence");
    const lecteurQR = document.getElementById("lecteur-qr");

    function appliquerMessage(type, texte) {
        messageZone.className = "";
        messageZone.classList.add(type === "success" ? "message-success" : type === "error" ? "message-erreur" : type === "warning" ? "message-attention" : "message-info");
        messageZone.textContent = texte;
    }

    async function validerTokenServeur(token) {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("id_utilisateur", utilisateur.id);

        try {
            const reponse = await fetch("../../../backend/Etudiant/validerPresenceQR.php", { method: "POST", body: formData });
            const resultat = await reponse.json();

            if (resultat.success) {
                appliquerMessage("success", resultat.message);
                inputToken.value = "";
                document.getElementById("listeAbsences").innerHTML += `
                    <tr>
                        <td>Cours validé à l'instant</td>
                        <td style="color:green; font-weight:bold;">Présent</td>
                    </tr>
                `;
            } else {
                appliquerMessage("error", resultat.message);
            }
        } catch (e) {
            appliquerMessage("error", "Erreur de communication avec le serveur.");
        }
    }

    const btnValiderPresence = document.getElementById("btnValiderPresence");
    if (btnValiderPresence) {
        btnValiderPresence.addEventListener("click", () => {
            const token = inputToken.value.trim();
            if (!token) return appliquerMessage("warning", "Veuillez entrer un code.");
            validerTokenServeur(token);
        });
    }

    const btnScanner = document.getElementById("btnScanner");
    if (btnScanner) {
        btnScanner.addEventListener("click", () => {
            lecteurQR.classList.add("lecteur-visible");
            messageZone.textContent = "";
            const html5QrcodeScanner = new Html5QrcodeScanner("lecteur-qr", { fps: 10, qrbox: 250 });
            html5QrcodeScanner.render(
                (texteDecode) => {
                    html5QrcodeScanner.clear();
                    lecteurQR.classList.remove("lecteur-visible");
                    appliquerMessage("info", "Vérification en cours...");
                    validerTokenServeur(texteDecode);
                },
                (erreur) => {}
            );
        });
    }
});