/*****
 * Helpers pour le template [page_gerer]
*****/
Template.page_gerer.helpers({
    /***** checkTypeTournoi
     * Input: idT (ID du tournoi)
     * Output: type de tournoi (bool)
     * 
     * TODO: prévoir 3 cas de figure
    *****/
    'checkTypeTournoi': function(idT){
        if (this.typeTournoi == "CHP") {
            return true;
        } else if (this.typeTournoi == "ELD") {
            return false;
        } else if (this.typeTournoi == "CHE") {
            // prévoir ce cas
        }
    },
    
    /***** plusieursTournois
     * Input: N/A
     * Output: nombre de tournoi (bool; 1 / >1)
    *****/
    'plusieursTournois': function(){
        let currentUser = Meteor.userId();
        let count = Tournois.find({admin: currentUser}, {sort: {date: -1}}).count();
        if(count >= 1){
            return true;
        } else {
            return false;
        }
    },
    
    /***** tournoisCrees
     * Input: N/A
     * Output: tournois créés par l'utilisateur connecté
    *****/
    'tournoisCrees': function(){
        let currentUser = Meteor.userId();
        return Tournois.find({admin: currentUser}, {sort: {date: -1}});
    },
    
    /***** matchRestants
     * Input: idT (ID du tournoi), t (tour du tournoi)
     * Output: matchs encore à jouer dans le tournoi
    *****/
    'matchRestants': function(idT, t){
        return Matchs.find({
            idTournoi: idT,
            termine: false,
            tour: t
        });
    },
    
    /***** nbrMatchRestants
     * Input: idT (ID du tournoi)
     * Output: nombre de matchs encore à jouer dans le tournoi
    *****/
    'nbrMatchRestants': function(idT){
        return Matchs.find({
            idTournoi: idT,
            termine: false
        }).count();
    },
    
    /***** nbrMatchRestantsTour
     * Input: idT (ID du tournoi), t (tour du tournoi)
     * Output: nombre de matchs encore à jouer dans le tour
    *****/
    'nbrMatchRestantsTour': function(idT, t){
        return Matchs.find({
            idTournoi: idT,
            termine: false,
            tour: t
        }).count();
    },
    
    /***** nbrToursELD
     * Input: idT (ID du tournoi)
     * Output: nombre de tours nécessaire au tournoi à élimination directe
    *****/
    'nbrToursELD': function(idT) {
        let tours =[];
        let nbTours = Math.log(Matchs.find({idTournoi: idT}).count()+1)/Math.LN2;
        for (var i = 1; i <= nbTours; i++) {
            tours.push(i);
        }
        return tours;
    },
    
    /***** labelTours
     * Input: idT (ID du tournoi), tour (tour du tournoi)
     * Output: étiquette pour le nom du tour
    *****/
    'labelTours': function(idT, tour){
        let labels = [];
        let tournoi = Tournois.findOne({_id:idT});
        let nbTours = Math.log(Matchs.find({idTournoi: idT}).count()+1)/Math.LN2;
        // Boucle pour remplir les valeurs des tours
        for (var i = nbTours; i > 0; i--) {
            // Les 4 derniers tours sont appelés par leurs noms, sinon calcul du tour
            if (i == 1) {
                labels.push("Finale");
            } else if (i == 2) {
                labels.push("Demi-finales");
            } else if (i == 3) {
                labels.push("Quarts de finale");
            } else if (i == 4) {
                labels.push("Huitièmes de finale");
            } else {
                // Si le nbr de joueurs inscrit n'est pas une puissance de 2, alors le premier tour est préliminaire
                if (tournoi.joueurs.length != Math.pow(2, nbTours)) {
                    // Si c'est le tour préliminaire, il faut ajuster les numéros de tour restants
                    if (i == nbTours) {
                        labels.push("Tour préliminaire");
                    } else {
                        labels.push(`Tour ${nbTours-i}`)
                    }
                } else {
                    labels.push(`Tour ${nbTours-i+1}`);
                }
            }
        }
        return labels[tour-1];
    },
    
    /***** nbrToursCHP
     * Input: nbT (nombre de tours)
     * Output: nombre de tours d'un tournoi championnat
    *****/
    'nbrToursCHP': function(nbT) {
        let tours =[];
        for (let i = 1; i <= nbT; i++) {
            tours.push(i);
        }
        return tours;
    },
    
    /***** matchJouable
     * Input: idM (ID du match)
     * Output: Définit si les deux joueurs sont connus
    *****/
    'matchJouable': function(idM) {
        let match = Matchs.findOne({_id : idM});
        if(match.j1.name == "" || match.j2.name == ""){
            return false;
        } else {
            return true;
        }
    },
    
    /***** matchValide
     * Input: idMatch (ID du match)
     * Output: Définit si les joueurs sont connus et le score n'est pas égalité
    *****/
    'matchValide': function(idMatch){
        let match = Matchs.findOne({_id : idMatch});
        if(match.j1.name == "" || match.j2.name == "" || match.j1.score == match.j2.score){
            return false;
        } else {
            return true;
        }
    },
    
    /***** belleDate
     * Input: d (timestamp)
     * Output: Date au format JJ.MM.AAAA / HH:MM
    *****/
    'belleDate': function(d) {
        let mins = d.getMinutes();
        if (mins < 10) {
            mins = `0${mins}`
        }
        return `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()} / ${d.getHours()}:${mins}`;
    }
});

/*****
 * Événements pour le template [page_gerer]
*****/
Template.page_gerer.events ({
    
    /***** click .suppr-tournoi
     * Input: event (clic)
     * Output: supprime le tournoi et tous les matchs y relatifs
    *****/
    'click .suppr-tournoi': function(event){
        event.preventDefault();
        let idTournoi = this._id;
        let confirmation = window.confirm("Supprimer définitivement ce tournoi et les matchs associés?");
        if(confirmation){
            Router.go('/gerer');
            Tournois.remove({ _id: idTournoi });
            let match = Matchs.find({ idTournoi: idTournoi});
            match.forEach(function(match){
                Matchs.remove({_id: match._id});
            });
        }
    },
    
    /***** click .goTournoi
     * Input: event (clic)
     * Output: affiche la page de gestion du tournoi
    *****/
    'click .goTournoi': function(event){
        event.preventDefault();
        let idTournoi = this._id;
        Router.go(`/gerer/${idTournoi}`);
    },
    
    /***** keydown [name=scoreInputJ1], blur [name=scoreInputJ1]
     * Input: event (keydown; blur)
     * Output: met à jour le score du joueur 1 pour un match
    *****/
    'keydown [name=scoreInputJ1], blur [name=scoreInputJ1]': function(event){
        let tournoi = Tournois.findOne({_id : this.idTournoi});
        let idMatch = this._id;
        let input2 = $(`[name=scoreInputJ2].${event.target.classList[2]}`); //select input j2
        let score1 = parseInt($(event.target).val());
        let score2 = input2.val();
        let glyphicon = $(`span#${event.target.classList[2]}`); //icon of current match
        // check if score1 is valid
        if (isNaN(score1) || score1 === '' || score1 < 0) {
            // if score1 is invalid, change background-color and icon type
            $(event.currentTarget).css("background-color", "lightSalmon");
            glyphicon.removeClass("glyphicon-ok").addClass("glyphicon-alert");
            glyphicon.prop('title', 'Score j1 invalide');
        } else {
            // check if score2 is valid
            if (isNaN(score2) || score2 === '' || score2 < 0) {
                // if score2 is invalid, change background-color and icon type
                input2.css("background-color", "lightSalmon");
                $(event.currentTarget).css("background-color", "");
                glyphicon.prop('title', 'Score j2 invalide');
            } else {
                // check to avoid draw in direct elimination
                if(tournoi.typeTournoi == "ELD" && score1 == score2){
                    // in case of draw, change both background-color and icon type
                    $(event.currentTarget).css("background-color", "PeachPuff");
                    input2.css("background-color", "PeachPuff");
                    glyphicon.removeClass("glyphicon-ok").addClass("glyphicon-alert");
                    glyphicon.prop('title', 'Match nul impossible');
                } else {
                    // if scores are valid, reset background-color and update collection
                    if (event.type == 'focusout' || (event.which == 13 || event.which == 27 || event.which == 9)){
                        Matchs.update({ _id : idMatch}, {$set: {"j1.score" : score1}});
                    }
                    glyphicon.removeClass("glyphicon-alert").addClass("glyphicon-ok");
                    glyphicon.prop('title', 'Valider résultat');
                    $(event.currentTarget).css("background-color", "");
                    input2.css("background-color", "");
                }
            }
        }
    },
    
    /***** keydown [name=scoreInputJ2], blur [name=scoreInputJ2]
     * Input: event (keydown; blur)
     * Output: met à jour le score du joueur 2 pour un match
    *****/
    'keydown [name=scoreInputJ2], blur [name=scoreInputJ2]': function(event){
        let tournoi = Tournois.findOne({_id : this.idTournoi});
        let idMatch = this._id;
        let input1 = $(`[name=scoreInputJ1].${event.target.classList[2]}`); //select input j1
        let score1 = input1.val();
        let score2 = parseInt($(event.target).val());
        let glyphicon = $(`span#${event.target.classList[2]}`); //icon of current match
        // check if score2 is valid
        if (isNaN(score2) || score2 === '' || score2 < 0) {
            // if score2 is invalid, change background-color and icon type
            $(event.currentTarget).css("background-color", "lightSalmon");
            glyphicon.removeClass("glyphicon-ok").addClass("glyphicon-alert");
            glyphicon.prop('title', 'Score j2 invalide');
        } else {
            // check if score1 is valid
            if (isNaN(score1) || score1 === '' || score1 < 0) {
                // if score1 is invalid, change background-color and icon type
                input1.css("background-color", "lightSalmon");
                $(event.currentTarget).css("background-color", "");
                glyphicon.prop('title', 'Score j1 invalide');
            } else {
                // check to avoid draw in direct elimination
                if(tournoi.typeTournoi == "ELD" && score2 == score1){
                    // in case of draw, change both background-color and icon type
                    $(event.currentTarget).css("background-color", "PeachPuff");
                    input1.css("background-color", "PeachPuff");
                    glyphicon.removeClass("glyphicon-ok").addClass("glyphicon-alert");
                    glyphicon.prop('title', 'Match nul impossible');
                } else {
                    // if scores are valid, reset background-color and update collection
                    if (event.type == 'focusout' || (event.which == 13 || event.which == 27 || event.which == 9)){
                        Matchs.update({ _id : idMatch}, {$set: {"j2.score" : score2}});
                    }
                    glyphicon.removeClass("glyphicon-alert").addClass("glyphicon-ok");
                    glyphicon.prop('title', 'Valider résultat');
                    $(event.currentTarget).css("background-color", "");
                    input1.css("background-color", "");
                }
            }
        }
    },
    
    /***** click .glyphicon-ok.validerScoreCHP
     * Input: event (clic)
     * Output: valide le score du match en championnat
    *****/
    'click .glyphicon-ok.validerScoreCHP': function(event){
        let idMatch = this._id; // Retrieve match id
        let idT = this.idTournoi; // Retrieve tournament id
        let joueurs; // Create an array and assign the players in it
        Tournois.find({_id : idT}).forEach(function(t){
            joueurs = t.joueurs;
        });
        // This function sorts the players according to their points
        sort = function(idT, joueurs) {
            // Define the function to compare scores
            function compare(a,b) {
                if (a.pts == b.pts) {
                    if (a.difBut > b.difBut) {
                        return -1;
                    } else if (a.difBut < b.difBut) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    if (a.pts > b.pts)
                        return -1;
                    if (a.pts < b.pts)
                        return 1;
                    return 0;
                }
            }
            let classement = []; // This array will contain player objects with name and score
            joueurs.forEach(function(j) {
                let nuls = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": j}, {$where: "this.j1.score == this.j2.score"}]},{$and: [{"j2.name": j}, {$where: "this.j2.score == this.j1.score"}]}]}).count();
                let victoires = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": j}, {$where: "this.j1.score > this.j2.score"}]}, {$and: [{"j2.name": j}, {$where: "this.j2.score > this.j1.score"}]}]}).count();
                let pts = nuls + victoires * 3;
                let difBut = 0;
                Matchs.find({idTournoi: idT, termine: true, "j1.name": j}).forEach(function(match){difBut += match.j1.score;});
                Matchs.find({idTournoi: idT, termine: true, "j2.name": j}).forEach(function(match){difBut += match.j2.score;});
                Matchs.find({idTournoi: idT, termine: true, "j1.name": j}).forEach(function(match){difBut -= match.j2.score;});
                Matchs.find({idTournoi: idT, termine: true, "j2.name": j}).forEach(function(match){difBut -= match.j1.score;});

                let joueur = {};
                joueur.nom = j; // add name to object
                joueur.pts = pts; // add score to object
                joueur.difBut = difBut;
                classement.push(joueur); // add player to array
            });
            classement.sort(compare); // Sort the array by score
            let joueursTries = Object.keys(classement).map(key => classement[key].nom); // Retrieve only the names of player sorted
            Tournois.update({_id : idT}, {$set : { "joueurs" : joueursTries}}); // Change the array of player to have them in order
        };

        let now = new Date(); // Create a date
        let date; // Create a custom date
        if (now.getMinutes() < 10) { // if single minute --> add a 0 before. ex. 9 -> 09
            date = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:0${now.getMinutes()}`;
        } else {
            date = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:${now.getMinutes()}`;
        }

        Matchs.update({_id: idMatch}, {$set: {termine: true, dateModif: date, timeStamp: now}}); //set the match as ended, add customDate & timeStamp

        sort(idT, joueurs); // Sort the players by score
    },
    
    /***** click .glyphicon-ok.validerScoreELD
     * Input: event (clic)
     * Output: valide le score du match en élimination directe
    *****/
    'click .glyphicon-ok.validerScoreELD': function(event){
        let idMatch = this._id; // Retrieve match id
        let idT = this.idTournoi; // Retrieve tournament id

        //Update data on current match
        let now = new Date(); // Create a date
        let date; // Create a custom date
        if (now.getMinutes() < 10) { // if single minute --> add a 0 before. ex. 9 -> 09
            date = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:0${now.getMinutes()}`;
        } else {
            date = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:${now.getMinutes()}`;
        }
        //Matchs.update({ _id: idMatch}, {$set: {termine: true, dateModif: date, timeStamp: now}}); //set the match as ended, add customDate & timeStamp

        //Getting winner of the match
        let winner;
        if(this.j1.score > this.j2.score){
            winner = this.j1.name;
        } else {
            winner = this.j2.name;
        }
        if (Matchs.find({idTournoi: idT, termine: false}).count() == 1) {
            Matchs.update({_id: idMatch}, {$set: {termine: true, dateModif: date, timeStamp: now}});
        } else {
            //Updating data on next match
            let match = this.nuMatchTour;
            let nextMatch = [];
            //Getting next nuMatchTour;
            if(match[1] % 2 == 0){
                nextMatch = [match[0]+1,match[1]/2];
                let nxtM = Matchs.findOne({idTournoi: idT, nuMatchTour: nextMatch});
                Matchs.update({_id: nxtM._id}, {$set: {"j2.name": winner}});
            } else {
                nextMatch = [match[0]+1,(match[1]+1)/2];
                let nxtM = Matchs.findOne({idTournoi: idT, nuMatchTour: nextMatch});
                Matchs.update({_id: nxtM._id}, {$set: {"j1.name": winner}});
            }
        }
        Matchs.update({_id: idMatch}, {$set: {termine: true, dateModif: date, timeStamp: now}});
    }
});
