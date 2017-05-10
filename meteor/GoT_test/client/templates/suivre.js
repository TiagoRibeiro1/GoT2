Template.suivre.events({
    'click .btn': function(event) {
        let url = $('#lienSuivre').val();
        Router.go(`/suivre/${url}`);
    }
});

Template.classement.helpers({
    matchCount: function() {
      return Matchs.find().count();
    },
    matchJoue: function(nj, idT) {
        return Matchs.find({ $or: [{"j1.name": nj},{"j2.name": nj}], termine: true, idTournoi: idT}).count();
        //return e;
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
  // TODO : launch function only when updating Matchs db
  petitsJoueurs: function(idT, joueurs) {
    function compare(a,b) {
      if (a.score > b.score)
        return -1;
      if (a.score < b.score)
        return 1;
      return 0;
    }
    let classement = [];
    joueurs.forEach(function(j) {
      let nuls = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": j}, {$where: "this.j1.score == this.j2.score"}]},{$and: [{"j2.name": j}, {$where: "this.j2.score == this.j1.score"}]}]}).count();
      let victoires = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": j}, {$where: "this.j1.score > this.j2.score"}]}, {$and: [{"j2.name": j}, {$where: "this.j2.score > this.j1.score"}]}]}).count();
      let pts = nuls + victoires * 3;
      let joueur = {};
      joueur.nom = j;
      joueur.score = pts;
      classement.push(joueur)
    })
    classement.sort(compare);
    let joueursTries = Object.keys(classement).map(key => classement[key].nom);
    Tournois.update({_id : idT}, {$set : { "joueurs" : joueursTries}});

  },
  place: function(j, joueurs) {
    return joueurs.indexOf(j) + 1;
  }
})

Template.aJouer.helpers({
  matchRestants: function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: false
    });
  }
});

Template.termine.helpers({
  matchTermines: function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: true
    }, {limit: 5, sort:{dateModif: -1}})
 }
});
