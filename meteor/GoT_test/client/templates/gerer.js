Template.page_gerer.helpers({
  'nombreTournois': function(){
    let currentUser = Meteor.userId();
    let count = Tournois.find({admin: currentUser}, {sort: {date: -1}}).count();
    if(count >= 1){ //A changer s'il y a un seul tournoi > arriver dessus
      return true;
    } else {
      return false;
    }
  },
  'tournoisCrees': function(){
    let currentUser = Meteor.userId();
    return Tournois.find({admin: currentUser}, {sort: {date: -1}});
  }
});

Template.page_gerer.events ({
  // To delete tournoi and all related matches
  'click .suppr-tournoi': function(event){
      event.preventDefault();
      let idTournoi = this._id;
      let confirmation = window.confirm("Supprimer définitivement ce tournoi ?");
      if(confirmation){
          Tournois.remove({ _id: idTournoi });
          let match = Matchs.find({ idTournoi: idTournoi});
          match.forEach(function(match){
            Matchs.remove({_id: match._id});
          });
      }
  },
  'click .goTournoi': function(event){
    event.preventDefault();
    let idTournoi = this._id;
    Router.go(`/gerer/${idTournoi}`);
  }

});
