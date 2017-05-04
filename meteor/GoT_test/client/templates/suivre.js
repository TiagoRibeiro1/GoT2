Template.page_suivre.helpers({
  'matchCrees': function(){
    console.log(Matchs.find({idTournoi: this._id}));
  }
});

Template.test.helpers({
  'position': function(){
    let tournoi = Tournois.findOne({idTournoi: this._id});
    for(i = 0; i < tournoi.joueurs.length; i++){
      let array = [];
      // for(i = 0; i < 10; i++){
        array.push(i)
        array.push(tournoi.joueurs[i]);
        array.push("ciao")
        return array;
      // }
    }
  },
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
    }
});
