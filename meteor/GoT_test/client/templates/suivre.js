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
