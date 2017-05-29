/*****
 * Events pour le template [suivre]
 * 
 * TODO: message d'erreur sur la page plutôt qu'alert
*****/
Template.suivre.events({
    
    /***** click #boutonSuivre
     * Input: event (clic)
     * Output: redirection
    *****/
    'click #boutonSuivre  ': function(event) {
        let url = $('#inputSuivre').val(); // récupère la valeur du champ texte [inputSuivre]
        if (Tournois.findOne({_id : url})) { // si le tournoi existe
            Router.go(`/suivre/${url}`); // redirige vers la page du tournoi
        } else {
            alert("Pas de tournoi avec cet id"); // si le tournoi n'existe pas, affiche une alerte
        }
    }
});

/*****
 * Helpers pour le template [classement]
*****/
Template.classement.helpers({
    
    /***** matchJoue
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: Nombre de matchs joués par nj
    *****/
    matchJoue: function(nj, idT) {
      return Matchs.find({ $or: [{"j1.name": nj},{"j2.name": nj}], termine: true, idTournoi: idT}).count();
    },
    
    /***** matchPerdu
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: Nombre de matchs perdus par nj
     * 
     * TODO: Comment faire sans $where ???
    *****/
    matchPerdu: function(nj, idT) {
      return Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        $or: [ // Soit l'une ou l'autre des deux conditions suivantes
          {$and: [{"j1.name": nj}, {$where: "this.j1.score < this.j2.score"}]}, // nj est le joueur 1, et a eu un score plus bas que le joueur 2
          {$and: [{"j2.name": nj}, {$where: "this.j2.score < this.j1.score"}]} // nj est le joueur 2, et a eu un score plus bas que le joueur 1
        ]}).count();
    },
    
    /***** matchNul
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: Nombre de matchs nuls joués par nj
     * 
     * TODO: Comment faire sans $where ???
    *****/
    matchNul: function(nj, idT) {
      return Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        $or: [ // Soit l'une ou l'autre des deux conditions suivantes
          {$and: [{"j1.name": nj}, {$where: "this.j1.score == this.j2.score"}]}, // nj est le joueur 1, et a eu un score  égal à celui du joueur 2
          {$and: [{"j2.name": nj}, {$where: "this.j2.score == this.j1.score"}]} // nj est le joueur 2, et a eu un score  égal à celui du joueur 1
        ]}).count();
    },
    
    /***** matchGagne
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: Nombre de matchs gagnés par nj
     * 
     * TODO: Comment faire sans $where ???
    *****/
    matchGagne: function(nj, idT) {
      return Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        $or: [ // Soit l'une ou l'autre des deux conditions suivantes
          {$and: [{"j1.name": nj}, {$where: "this.j1.score > this.j2.score"}]}, // nj est le joueur 1, et a eu un score plus haut que le joueur 2
          {$and: [{"j2.name": nj}, {$where: "this.j2.score > this.j1.score"}]} // nj est le joueur 2, et a eu un score plus haut que le joueur 1
        ]}).count();
    },
    
    /***** scorePositif
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: nombre total de points marqués lors des matchs
    *****/
    scorePositif: function(nj, idT) {
      let scorePos = 0; // initialise le total des points à 0

      
      Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        "j1.name": nj
      }).forEach(function(match){
        scorePos += match.j1.score; // Ajoute les points marqués par nj lorsqu'il est joueur 1
      });

      Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        "j2.name": nj
      }).forEach(function(match){
        scorePos += match.j2.score; // Ajoute les points marqués par nj lorsqu'il est joueur 2
      });

      return scorePos;
    },
    
    /***** scoreNegatif
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: nombre total de points encaissés lors des matchs
    *****/
    scoreNegatif: function (nj, idT) {
      let scoreNeg = 0; // initialise le total des points à 0

      Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        "j1.name": nj
      }).forEach(function(match){
        scoreNeg += match.j2.score; // Ajoute les points encaissés par  nj lorsqu'il est joueur 1
      });

      Matchs.find({
        idTournoi: idT, // sélectionne le tournoi qui va bien
        termine: true, // si le match est terminé
        "j2.name": nj
      }).forEach(function(match){
        scoreNeg += match.j1.score; // Ajoute les points encaissés par  nj lorsqu'il est joueur 2
      });

      return scoreNeg;
    },
    
    /***** diffScore
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: différence entre les points marqués et encaissés
    *****/
    diffScore: function (nj, idT) {
      let scorePos = 0; // initialise le total des points marqués à 0
      let scoreNeg = 0; // initialise le total des points encaissés à 0

      Matchs.find({idTournoi: idT, termine: true, "j1.name": nj}).forEach(function(match){scorePos += match.j1.score;}); // Additionne les points marqués par nj lorsqu'il est joueur 1
      Matchs.find({idTournoi: idT, termine: true, "j2.name": nj}).forEach(function(match){scorePos += match.j2.score;}); // Additionne les points marqués par nj lorsqu'il est joueur 2

      Matchs.find({idTournoi: idT, termine: true, "j1.name": nj}).forEach(function(match){scoreNeg += match.j2.score;}); // Additionne les points encaissés par  nj lorsqu'il est joueur 2
      Matchs.find({idTournoi: idT, termine: true, "j2.name": nj}).forEach(function(match){scoreNeg += match.j1.score;}); // Additionne les points encaissés par  nj lorsqu'il est joueur 1

      return scorePos - scoreNeg; // soustrait les point encaissés aux points marqués
    },
    
    /***** totalPoints
     * Input: nj (nom du joueur), idT (ID du tournoi)
     * Output: total des points de nj
     * 
     * TODO: Comment faire sans $where ???
    *****/
    totalPoints: function(nj, idT) {
      let nuls = Matchs.find({
            idTournoi: idT, // sélectionne le tournoi qui va bien
            termine: true, // si le match est terminé
            $or: [
                {$and: [{"j1.name": nj}, {$where: "this.j1.score == this.j2.score"}]}, // nj est le joueur 1, et a eu un score  égal à celui du joueur 2
                {$and: [{"j2.name": nj}, {$where: "this.j2.score == this.j1.score"}]} // nj est le joueur 2, et a eu un score  égal à celui du joueur 1
            ]}).count();

      let victoires = Matchs.find({
            idTournoi: idT, // sélectionne le tournoi qui va bien
            termine: true, // si le match est terminé
            $or: [
                {$and: [{"j1.name": nj}, {$where: "this.j1.score > this.j2.score"}]}, // nj est le joueur 1, et a eu un score plus haut que le joueur 2
                {$and: [{"j2.name": nj}, {$where: "this.j2.score > this.j1.score"}]} // nj est le joueur 2, et a eu un score plus haut que le joueur 1
            ]}).count();

      return nuls + victoires*3; // Additionne les points (1 par match nul, 3 par victoire)
    }
});


/*****
 * Helpers pour le template [suivre]
*****/
Template.suivre.helpers({
  
  /***** checkTypeTournoi
   * Définit le type de tournoi sélectionné
   * true: championnat
   * false: élimination directe
   * 
   * TODO: utiliser une méthode permettant d'intégrer le championnat à élimination directe
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
    
    /***** place
     * Input: j (nom du joueur), joueurs (liste des joueurs)
     * Output: position du joueur dans le classement
    *****/
    place: function(j, joueurs) {
        return joueurs.indexOf(j) + 1;
    },
        nbrToursELD: function(idT) {
        let tours =[];
        let nbTours = Math.log(Matchs.find({idTournoi: idT}).count()+1)/Math.LN2;
        for (var i = 1; i <= nbTours+1; i++) {
            tours.push(i);
        }
        return tours;
    },
    
    /***** labelTours
     * Input: idT (ID du tournoi), tour (tour en cours)
     * Output: étiquette du tour traité
    *****/
    labelTours: function(idT, tour){
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
    
    /***** eldColonnes
     * Input: idT (ID du tournoi)
     * Output: tableau des tours (pour la création des colonnes)
    *****/
    eldColonnes: function(idT) {
        // Cette fonction retourne un array avec les tours pour créer les colonnes
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let cols = [];
        for (var i = 1; i <= nbTours+1; i++) {
            // on utilise t+1 pour créer la finale
            cols.push(i);
        }
        return cols;
    },
    
    /***** eldLignes
     * Input: idT (ID du tournoi)
     * Output: tableau des tours (pour la création des lignes)
    *****/
    eldLignes: function(idT){
        // Cette fonction retourne un array avec les tours pour créer les lignes
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let joueurs = Math.pow(2, nbTours);
        let lignes = [];
        // joueurs/2*3 = le nombre de cases à rmeplir du premier tour (j1, j2, espace)
        for (var i = 0; i < (joueurs/2)*3; i++) {
            lignes.push(i);
        }
        return lignes;
    },
    
    /***** eldCases
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: présence d'un joueur dans la case traitée
    *****/
    eldCases: function(l, c, idT){
        // Cette fonction détermine s'il y a un joueur dans la case en question
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let joueurs = Math.pow(2, nbTours);
        let nbrMagique = joueurs*(3/8); // Indice de la première ligne au dernier tour (pour t>=3)
        let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c)); // Indice de la première ligne remplie par tour (pour t>=3)
        let antiNbrMagiqueTour = nbrMagiqueTour*(2/3); // Nombre pour ne pas remplir la case au milieu des joueurs
        // Si le tour est inférieur à 4, les conditions sont fixées par tour
        if (c < 4) {
            if (c == 1 && l % 3 != 0) {
                return true;
            } else if (c == 2 && l % 2 == 0 && l % 3 != 0) {
                return true;
            } else if (c == 3 && l % 2 != 0 && l % 3 == 0) {
                return true;
            }
            // Sinon on utilise la formule générique pour trouver les cases avec joueurs
        } else {
            for (var i = c; i < (joueurs/2)*3; i++) {
                if (l % nbrMagiqueTour == 0 && l % antiNbrMagiqueTour != 0) {
                    return true;
                }
            }
        }
    },
    
    /***** selectJ1
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: joueur 1 dans la case traitée
    *****/
    selectJ1: function(l, c, idT) {
        // Cette fonction attribue les joueurs1 dans les cases correspondantes
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let joueurs = Math.pow(2, nbTours);
        let nbrMagique = joueurs*(3/8); // Indice de la première ligne au dernier tour (pour t>=3)
        let casesColonnes = (joueurs/2)*3;
        let match;
        let nuMatch = 1;

        if (c < 3) {
            // Pour les deux premiers tour, fonction linéaire pour retrouver le nuMatch du tour en question
            let divTour = (-1/6)*c + 1/2;
            nuMatch = Math.round((divTour*l)+(2/3));
            // sinon utilisation d'une boucle pour retrouver le numatch, avec incrémentation en fonction du tour
        } else {
            let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c));
            let j = 1;
            for (var i = nbrMagiqueTour; i < casesColonnes; i+= (nbrMagiqueTour*4)) {
                if (i == l) {
                    nuMatch = j;
                }
                j++;
            }
        }
        // Trouver le match en question
        match = Matchs.findOne({
            idTournoi: idT,
            nuMatchTour: [c,nuMatch]
        });
        // Si le joueur du match est connu, alors afficher son nom et score
        if (match.termine) {
            if (match.j1.name) {
                if (match.j1.name != 'exempt') {
                    return ` ${match.j1.name}: ${match.j1.score} `;
                } else {
                    return "-";
                }
            } else {
                return "-";
            }
        } else {
            return ` ${match.j1.name}`;
        }
    },
    
    /***** selectJ2
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: joueur 2 dans la case traitée
    *****/
    selectJ2: function(l, c, idT) {
        // Cette fonction attribue les joueurs2 dans les cases correspondantes
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let joueurs = Math.pow(2, nbTours);
        let nbrMagique = joueurs*(3/8);// Indice de la première ligne au dernier tour (pour t>=3)
        let casesColonnes = (joueurs/2)*3;
        let match;
        let nuMatch = 1;
        // Pour les deux premiers tour, fonction linéaire pour retrouver le nuMatch du tour en question
        if (c < 3) {
            let divTour = (-1/6)*c + 1/2;
            nuMatch = Math.round((divTour*l)+(1/3));
            // sinon utilisation d'une boucle pour retrouver le numatch, avec incrémentation en fonction du tour
        } else {
            let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c));
            let j = 1;
            for (var i = nbrMagiqueTour*3; i < casesColonnes; i+= (nbrMagiqueTour*4)) {
                if (i == l) {
                    nuMatch = j;
                }
                j++;
            }
        }
        // Trouver le match en question
        match = Matchs.findOne({
            idTournoi: idT,
            nuMatchTour: [c,nuMatch]
        });
        // Si le joueur du match est connu, alors afficher son nom et score
        if (match.termine) {
            if (match.j2.name) {
                if (match.j1.name == 'exempt') {
                    return ` ${match.j2.name}`
                }
                return ` ${match.j2.name}: ${match.j2.score} `;
            } else {
                return "-";
            }
        } else {
            return ` ${match.j2.name}`;
        }
    },
    
    /***** vainqueur
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: nom du vainqueur
    *****/
    vainqueur: function(l, c, idT) {
        // Cette fonction affiche le nom du vainqueur
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        // c'est forcément le dernier match
        let match = Matchs.findOne({
            idTournoi: idT,
            tour: nbTours,
            termine: true
        });
        // Retourne le nom du vainqueur
        if (match) {
            if (match.j1.score > match.j2.score) {
                return match.j1.name;
            } else {
                return match.j2.name;
            }
        }
    },
    
    /***** eldDiffJoueurs
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: différence entre j1 et j2
    *****/
    eldDiffJoueurs: function(l, c, idT) {
        // Cette fonctoin différencie les j1 des j2
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let joueurs = Math.pow(2, nbTours);
        let casesColonnes = (joueurs/2)*3 // cases à remplir
        let nbrMagique = joueurs*(3/8); // Indice de la première ligne au dernier tour (pour t>=3)
        let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c)); // Indice de la première ligne remplie par tour (pour t>=3)
        // Pour les 2 premiers tours, les j1 sont placés toutes les 3*tour cases, sinon ce sont des j2
        if (c < 3) {
            for (var i = c; i <= casesColonnes; i+=3*c) {
                if (i == l) {
                    return true;
                }
            }
            return false;
            // Pour les autres tours, il faut partir de la première case remplie du tour et incrémenter de 4* la distance
        } else if (c < nbTours) {
        for (var i = nbrMagiqueTour; i < casesColonnes ; i += (nbrMagiqueTour*4)) {
            if (i == l) {
                return true;
            }
        }
        // Dernier tour
        } else if (c == nbTours) {
            for (var i = nbrMagique; i < casesColonnes; i*=4) {
                if (i == l) {
                    return true;
                }
            }
        }
        return false;
    },
    
    /***** eldVainqueur
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: case du vainqueur
    *****/
    eldVainqueur: function(l, c, idT) {
        // Cette fonction retourne la case du vainqueur
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        // si la case est au-delà du nbr de tour, alors c'est le vainqueur
        if (c > nbTours) {
            return true;
        }
    },
    
    /***** lignesArbre
     * Input: l (ligne du tableau), c (colonne du tableau), idT (ID du tournoi)
     * Output: 
    *****/
    lignesArbre: function(l, c, idT) {
        let tournoi = Tournois.findOne({_id: idT});
        let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
        let joueurs = Math.pow(2, nbTours);
        let casesColonnes = (joueurs/2)*3 // cases à remplir
        let nbrMagique = joueurs*(3/8); // Indice de la première ligne au dernier tour (pour t>=3)
        let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c)); // Indice de la première ligne remplie par tour (pour t>=3)

        if (c == 2) {
            if (l % 2 != 0 && l % 3 == 0) {
                return true;
            }
        } else if (c < 2 || c > nbTours) {
            return false;
        } else if (c > 2) {
            for (i = nbrMagiqueTour; i < casesColonnes; i += nbrMagiqueTour*4) {
                if (l > i && l < i+nbrMagiqueTour*2) {
                return true;
                }
            }
        }
    }
        /* TODO checker pour voir si cette fonction joue --> peu importe la méthode
        classementColore: function(idT){
            let r2 = document.getElementById("rang1");
            console.log(r2);
            if (Matchs.find({idTournoi: idT,termine: false}).count() == 0) {
                console.log("dans le if");
                console.log($('#rang1'));
                $('tr').addClass("success");
                let r1 = document.getElementById("rang1");
                r1.className = "success";
            }
        }*/
});


/*****
 * Helpers pour le template [aJouer]
*****/
Template.aJouer.helpers({
    
    /***** matchRestants
     * Input: idT (ID du tournoi)
     * Output: liste des matchs non joués
    *****/
    matchRestants: function(idT){
        return Matchs.find({
            idTournoi: idT, // sélectionne le tournoi qui va bien
            termine: false // si le match est en cours
        });
    },
    
    /***** nbrMatchRestants
     * Input: idT (ID du tournoi)
     * Output: nombre de matchs non-joués
    *****/
    nbrMatchRestants: function(idT){
        return Matchs.find({
            idTournoi: idT, // sélectionne le tournoi qui va bien
            termine: false // si le match est en cours
        }).count();
    }
});

/*****
 * Helpers pour le template [termine]
*****/
Template.termine.helpers({
    
    /***** matchTermines
     * Input: idT (ID du tournoi)
     * Output: les 5 derniers matchs joués
    *****/
    matchTermines: function(idT){
            return Matchs.find({
            idTournoi: idT, // sélectionne le tournoi qui va bien
            termine: true // si le match est terminé
        }, {limit: 5, sort:{timeStamp: -1}}) // ne récupère que 5 matchs, triés selon leur date
    },
    
    /***** nbrMatchsTermines
     * Input: idT (ID du tournoi)
     * Output: nombre de matchs joués
    *****/
    nbrMatchsTermines: function(idT){
        return Matchs.find({
            idTournoi: idT, // sélectionne le tournoi qui va bien
            termine: true // si le match est terminé
        }).count();
    }
});
