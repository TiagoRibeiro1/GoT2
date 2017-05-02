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
  }
});
