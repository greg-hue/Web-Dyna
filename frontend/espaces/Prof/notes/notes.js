document.addEventListener("DOMContentLoaded", async () => {

    //Recup les données de la session
    const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

    //securite pour la connexion de l'utilisateur
    if (!utilisateur || utilisateur.role !== "enseignant") {
        window.location.href = "../../../authentification.html";
        return;
    }

    //maj des infos de l'utilisateur
    document.getElementById("nomUtilisateur").textContent = utilisateur.prenom + " " + utilisateur.nom;
    document.getElementById("roleUtilisateur").textContent = "Professeur";

    //gere la deconnexion avec le bouton
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
        
        //en recupere des données et on convertit en json pour l utiliser
        const resultat = await reponse.json();

        //on reinisialise le tout
        listeNotes.innerHTML = "";
        selectEtudiant.innerHTML = `<option value="">Choisir un étudiant</option>`;
        selectCours.innerHTML = `<option value="">Choisir un cours</option>`;

        //Donnees dispo
        if (resultat.success) {
            
            //Liste des etudiants
            resultat.etudiants.forEach(etudiant => {
                selectEtudiant.innerHTML += `
                    <option value="${etudiant.id_etudiant}">
                        ${etudiant.prenom} ${etudiant.nom} (${etudiant.groupe})
                    </option>
                `;
            });
            
            //Liste des cours
            resultat.cours.forEach(cours => {
                selectCours.innerHTML += `
                    <option value="${cours.id_cours}">
                        ${cours.titre}
                    </option>
                `;
            });

            //Liste des notes
            resultat.notes.forEach(note => {
                listeNotes.innerHTML += `
                    <tr>
                        <td>${note.prenom} ${note.nom} (${note.groupe})</td>
                        <td>${note.matiere}</td>
                        <td>${note.type_evaluation}</td>
                        <td>${note.note}/20</td>
                        <td>${note.coefficient}</td>
                        <td>

                        //bouton pour mofieir la note 
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

    //Ajouter une note
    document.getElementById("formAjoutNote").addEventListener("submit", async (event) => {
        event.preventDefault();

        const donnees = new FormData();
        donnees.append("etudiant_id", selectEtudiant.value);
        donnees.append("cours_id", selectCours.value);
        donnees.append("type_evaluation", document.getElementById("typeEvaluation").value);
        donnees.append("note", document.getElementById("note").value);
        donnees.append("coefficient", document.getElementById("coefficient").value);

        //Requete pour ajouter une note
        const reponse = await fetch("../../../../backend/Prof/note/addProfNote.php", {
            method: "POST",
            body: donnees
        });
        
        //en recupere des données et on convertit en json pour l utiliser
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

    //Modification de la note
    window.modifierNote = async function(idNote, noteActuelle, typeActuel, coefficientActuel) {
        const nouvelleNote = prompt("Nouvelle note :", noteActuelle);
        if (nouvelleNote === null) return;

        const nouveauType = prompt("Type d'évaluation :", typeActuel);
        if (nouveauType === null) return;

        const nouveauCoefficient = prompt("Coefficient :", coefficientActuel);
        if (nouveauCoefficient === null) return;
        
        //Creation des donnees du formulaire
        const donnees = new FormData();
        donnees.append("id_note", idNote);
        donnees.append("note", nouvelleNote);
        donnees.append("type_evaluation", nouveauType);
        donnees.append("coefficient", nouveauCoefficient);

        //Requete pour lamodification
        const reponse = await fetch("../../../../backend/Prof/note/updateProfNote.php", {
            method: "POST",
            body: donnees
        });
        
        //en recupere des données et on convertit en json pour l utiliser
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