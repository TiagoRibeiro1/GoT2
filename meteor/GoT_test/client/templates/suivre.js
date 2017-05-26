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
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
    let cols = [];
    for (var i = 1; i <= nbTours+1; i++) {
      cols.push(i);
    }
    return cols;
  },
  eldLignes: function(idT){
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
    let joueurs = Math.pow(2, nbTours);
    let lignes = [];
    for (var i = 0; i < (joueurs/2)*3; i++) {
      lignes.push(i);
    }
    return lignes;
  },
  eldCases: function(l, c, idT){
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
    let joueurs = Math.pow(2, nbTours);
    let nbrMagique = joueurs*(3/8);
    let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c));
    let antiNbrMagiqueTour = nbrMagiqueTour*(2/3);
    if (c < 4) {
      if (c == 1 && l % 3 != 0) {
        return true;
      } else if (c == 2 && l % 2 == 0 && l % 3 != 0) {
        return true;
      } else if (c == 3 && l % 2 != 0 && l % 3 == 0) {
        return true;
      }
    } else {
      for (var i = c; i < (joueurs/2)*3; i++) {
        if (l % nbrMagiqueTour == 0 && l%antiNbrMagiqueTour != 0) {
          return true;
        }
      }
    }
    // if (c == 1 && l % 3 != 0) {
    //   return true;
    // } else if (c == 2 && l % 2 == 0 && l % 3 != 0) {
    //   return true;
    // } else if (c == 3 && l % 2 != 0 && l % 3 == 0) {
    //   return true;
    // } else if (c == 4 && l % 6 == 0 && l % 4 != 0 && l % 12 != 0) {
    //   return true;
    // } else if (c == 5 && l % 12 == 0 && l % 8 != 0 && l % 24 != 0) {
    //   return true;
    // } else if (c == 6 && l % 24 == 0 && l % 16 != 0 && l % 48 != 0) {
    //   return true;
    // }
  },
  selectJ1: function(l, c, idT) {
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
    let joueurs = Math.pow(2, nbTours);
    let casesColonnes = (joueurs/2)*3;
    let match;
    let nuMatch = 1;

    if (c < 3) {
      let divTour = (-1/6)*c + 1/2;
      nuMatch = Math.round((divTour*l)+(2/3));
    } else {
      let divTour = + 3/4;
    }
    match = Matchs.findOne({
      idTournoi: idT,
      nuMatchTour: [c,nuMatch]
    });

    if (match) {
      return match.j1.name;
    } else {
      // console.log("pasmatch");
      return "j1";
    }
  },
  eldDiffJoueurs: function(l, c, idT) {
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
    let joueurs = Math.pow(2, nbTours);
    let casesColonnes = (joueurs/2)*3
    let nbrMagique = joueurs*(3/8);
    let antiNbrMagique = nbrMagique*(2/3);
    let nbrMagiqueTour = nbrMagique / Math.pow(2, (nbTours - c));
    if (c < 3) {
      for (var i = c; i <= casesColonnes; i+=3*c) {
        if (i == l) {
          return true;
        }
      }
      return false;
    } else if (c < nbTours) {
      for (var i = nbrMagiqueTour; i < casesColonnes ; i += (nbrMagiqueTour*4)) {
        if (i == l) {
          return true;
        }
      }
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
    let tournoi = Tournois.findOne({_id: idT});
    let nbTours = Math.ceil(Math.log(tournoi.joueurs.length)/Math.LN2);
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
