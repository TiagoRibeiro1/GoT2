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

/*
        //si idTournoi = idT
        //  si termine = true
        //    si j1.score = j2.score
        //        exit
        //    si j1.name = nj
        //        si j1.score > j2.score
        //        alors gagne
        //        exit
        //    si j2.name = nj
        //        si j2.score > j1.score
        //        alors gagne
        //        exit
        //return gagne

        //termine:true && idTournoi:idT && j1.score != j2.score && [ j1.name = nj && j1.score > j2.score ] || [ j2.name = nj && j1.score < j2.score ]


            // $or:[{
            //     $and:[{
            //         "j1.name": nj
            //     },{
            //         "j1.score":{ $gt: "j2.score"}
            //     }]
            // },{
            //     $and:[{
            //         "j2.name": nj
            //     },{
            //         "j2.score": {$gt: "j1.score"}
            //     }]
            // }]

        //return Matchs.find({ $or: [{"j1.name": nj},{"j2.name": nj}], termine:true, idTournoi:idT}).count();
        //return e;
        */

});

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
