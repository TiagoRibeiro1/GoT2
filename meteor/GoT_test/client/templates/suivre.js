Template.suivre.events({
  'click #boutonSuivre  ': function(event) {
    let url = $('#inputSuivre').val();
    if (Tournois.findOne({_id : url})) {
      Router.go(`/suivre/${url}`);
    } else {
      alert("Pas de tournoi avec cet id"); // TODO message d'erreur sur la page plutôt qu'alerte
    }
  }
});

Template.classement.helpers({
    matchJoue: function(nj, idT) {
      return Matchs.find({ $or: [{"j1.name": nj},{"j2.name": nj}], termine: true, idTournoi: idT}).count();
    },
    matchPerdu: function(nj, idT) {
      return Matchs.find({
        idTournoi: idT,
        termine: true,
        $or: [ // TODO Comment faire sans $where ???
          {$and: [{"j1.name": nj}, {$where: "this.j1.score < this.j2.score"}]},
          {$and: [{"j2.name": nj}, {$where: "this.j2.score < this.j1.score"}]}
        ]}).count();
    },
    matchNul: function(nj, idT) {
      return Matchs.find({
        idTournoi: idT,
        termine: true,
        $or: [ // TODO Comment faire sans $where ???
          {$and: [{"j1.name": nj}, {$where: "this.j1.score == this.j2.score"}]},
          {$and: [{"j2.name": nj}, {$where: "this.j2.score == this.j1.score"}]}
        ]}).count();
    },
    matchGagne: function(nj, idT) {
      return Matchs.find({
        idTournoi: idT,
        termine: true,
        $or: [ // TODO Comment faire sans $where ???
          {$and: [{"j1.name": nj}, {$where: "this.j1.score > this.j2.score"}]},
          {$and: [{"j2.name": nj}, {$where: "this.j2.score > this.j1.score"}]}
        ]}).count();
    },
    scorePositif: function(nj, idT) {
      let scorePos = 0;

      Matchs.find({
        idTournoi: idT,
        termine: true,
        "j1.name": nj
      }).forEach(function(match){
        scorePos += match.j1.score;
      });

      Matchs.find({
        idTournoi: idT,
        termine: true,
        "j2.name": nj
      }).forEach(function(match){
        scorePos += match.j2.score;
      });

      return scorePos;
    },
    scoreNegatif: function (nj, idT) {
      let scoreNeg = 0;

      Matchs.find({
        idTournoi: idT,
        termine: true,
        "j1.name": nj
      }).forEach(function(match){
        scoreNeg += match.j2.score;
      });

      Matchs.find({
        idTournoi: idT,
        termine: true,
        "j2.name": nj
      }).forEach(function(match){
        scoreNeg += match.j1.score;
      });

      return scoreNeg;
    },
    diffScore: function (nj, idT) {
      let scorePos = 0;
      let scoreNeg = 0;

      Matchs.find({idTournoi: idT, termine: true, "j1.name": nj}).forEach(function(match){scorePos += match.j1.score;});
      Matchs.find({idTournoi: idT, termine: true, "j2.name": nj}).forEach(function(match){scorePos += match.j2.score;});

      Matchs.find({idTournoi: idT, termine: true, "j1.name": nj}).forEach(function(match){scoreNeg += match.j2.score;});
      Matchs.find({idTournoi: idT, termine: true, "j2.name": nj}).forEach(function(match){scoreNeg += match.j1.score;});

      return scorePos - scoreNeg;
    },
    totalPoints: function(nj, idT) {

      let nuls = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": nj}, {$where: "this.j1.score == this.j2.score"}]},{$and: [{"j2.name": nj}, {$where: "this.j2.score == this.j1.score"}]}
                    ]}).count();

      let victoires = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": nj}, {$where: "this.j1.score > this.j2.score"}]}, {$and: [{"j2.name": nj}, {$where: "this.j2.score > this.j1.score"}]}
                    ]}).count();

      return nuls + victoires*3;
    }
});

Template.suivre.helpers({
  'checkTypeTournoi': function(idT){
    if (this.typeTournoi == "CHP") {
      return true;
    } else if (this.typeTournoi == "ELD") {
      return false;
    } else if (this.typeTournoi == "CHE") {
      // prévoir ce cas
    }
  },
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
    if (match.j1.score > match.j2.score) {
      return match.j1.name;
    } else {
      return match.j2.name;
    }
  },
  eldDiffJoueurs: function(l, c, idT) {
    // Cette fonctoin différencie les j1 des j2
    // Cette fonction détermine s'il y a un joueur dans la case en question
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
  eldVainqueur: function(c, l, idT) {
    // Cette fonction retourne la case du vainqueur
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
    // si la case est au-delà du nbr de tour, alors cêst le vainqueur
    if (c > nbTours) {
      return true;
    }
  },
  place: function(j, joueurs) {
    return joueurs.indexOf(j) + 1;
  }/*, TODO checker pour voir si cette fonction joue --> peu importe la méthode
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
})

Template.aJouer.helpers({
  matchRestants: function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: false
    });
  },
  nbrMatchRestants: function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: false
    }).count();
  }
});

Template.termine.helpers({
  matchTermines: function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: true
    }, {limit: 5, sort:{timeStamp: -1}})
 },
 nbrMatchsTermines: function(idT){
   return Matchs.find({
     idTournoi: idT,
     termine: true
   }).count();
 }
});
