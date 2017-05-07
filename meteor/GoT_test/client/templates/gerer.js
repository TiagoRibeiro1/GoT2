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
  },
  'matchRestants': function(idT){
    console.log("débile");
    return Matchs.find({
      idTournoi: idT,
      termine: false
    })
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
  },
  // Updating match score
  'keypress [name=scoreInputJ1]': function(event){
    let idMatch = this._id;
    let score = parseInt($(event.target).val());
    Matchs.update({ _id : idMatch}, {$set: {"j1.score" : score}})
  },
  'keypress [name=scoreInputJ2]': function(event){
    let idMatch = this._id;
    let score = parseInt($(event.target).val());
    Matchs.update({ _id : idMatch}, {$set: {"j2.score" : score}})
  },
  'click .glyphicon-ok': function(event){
    let idMatch = this._id;
    Matchs.update({ _id: idMatch}, {$set: {termine: true}})
  }
});
