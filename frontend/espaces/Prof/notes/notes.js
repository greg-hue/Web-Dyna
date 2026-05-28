document.addEventListener("DOMContentLoaded", async () => {

    //Recup utilisateur
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    //Verif authentification
    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //Affichage utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Professeur";

    //Déconnexion
    document.getElementById("btnDeconnexion").addEventListener("click", () => {
        localStorage.removeItem("utilisateurConnecte");
        window.location.href = "../../../authentification.html";
    });

    //Elements html
    const listeNotes = document.getElementById("listeNotes");
    const selectEtudiant = document.getElementById("etudiantId");
    const selectCours = document.getElementById("coursId");
    const messageNote = document.getElementById("messageNote");

    //Chargement des notes
    async function chargerNotes() {
        const reponse = await fetch("../../../../backend/Prof/note/getProfNotes.php?id_utilisateur=" + utilisateur.id);
        //Converison json
        const resultat = await reponse.json();
        //Réinitialisation contenu
        listeNotes.innerHTML = "";
        selectEtudiant.innerHTML = `<option value="">Choisir un étudiant</option>`;
        selectCours.innerHTML = `<option value="">Choisir un cours</option>`;

        //Données dispo
        if (resultat.success) {
            //Liste étudiants
            resultat.etudiants.forEach(etudiant => {
                selectEtudiant.innerHTML += `
                    <option value="${etudiant.id_etudiant}">
                        ${etudiant.prenom} ${etudiant.nom} (${etudiant.groupe})
                    </option>
                `;
            });
            //Liste cours
            resultat.cours.forEach(cours => {
                selectCours.innerHTML += `
                    <option value="${cours.id_cours}">
                        ${cours.titre}
                    </option>
                `;
            });
            //Liste notes
            resultat.notes.forEach(note => {
                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.prenom} ${note.nom} (${note.groupe})</td>
                        <td>${note.matiere}</td>
                        <td>${note.type_evaluation}</td>
                        <td>${note.note}/20</td>
                        <td>${note.coefficient}</td>
                        <td>
                            <button onclick="modifierNote(
                                ${note.id_note},
                                '${note.note}',
                                '${note.type_evaluation}',
                                '${note.coefficient}'
                            )">
                                Modifier
                            </button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    //Ajout note
    document.getElementById("formAjoutNote").addEventListener("submit", async (event) => {
        event.preventDefault();

        const donnees = new FormData();
        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("cours_id", selectCours.value);
        donnees.append("type_evaluation", document.getElementById("typeEvaluation").value);
        donnees.append("note", document.getElementById("note").value);
        donnees.append("coefficient", document.getElementById("coefficient").value);

        //Requête ajout note
        const reponse = await fetch("../../../../backend/Prof/note/addProfNote.php", {
            method: "POST",
            body: donnees
        });
        //converison json
        const resultat = await reponse.json();

        //Ajout réussi
        if (resultat.success) {
            messageNote.style.color = "green";
            messageNote.textContent = "Note ajoutée.";
            event.target.reset();
            chargerNotes();
        //Erreur d'ajout
        } else {
            messageNote.style.color = "red";
            messageNote.textContent = resultat.message;
        }
    });

    //Modification note
    window.modifierNote = async function(idNote, noteActuelle, typeActuel, coefficientActuel) {
        const nouvelleNote = prompt("Nouvelle note :", noteActuelle);
        if (nouvelleNote === null) return;

        const nouveauType = prompt("Type d'évaluation :", typeActuel);
        if (nouveauType === null) return;

        const nouveauCoefficient = prompt("Coefficient :", coefficientActuel);
        if (nouveauCoefficient === null) return;
        //Création données formulaire
        const donnees = new FormData();
        donnees.append("id_note", idNote);
        donnees.append("note", nouvelleNote);
        donnees.append("type_evaluation", nouveauType);
        donnees.append("coefficient", nouveauCoefficient);

        //Requête modification
        const reponse = await fetch("../../../../backend/Prof/note/updateProfNote.php", {
            method: "POST",
            body: donnees
        });
        //Conversion json
        const resultat = await reponse.json();

        //Modif reussi
        if (resultat.success) {
            messageNote.style.color = "green";
            messageNote.textContent = "Note modifiée.";
            chargerNotes();
        //erreur de modif
        } else {
            messageNote.style.color = "red";
            messageNote.textContent = resultat.message;
        }
    };
    chargerNotes();
});