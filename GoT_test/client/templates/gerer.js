Template.page_gerer.helpers({
  'tournoisCrees': function(){
    var currentUser = Meteor.userId();
    return Tournois.find({admin: currentUser}, {sort: {date: -1}});
  }
});

Template.page_gerer.events ({
  'click .suppr-tournoi': function(event){
      event.preventDefault();
      var IdTournoi = this._id;
      var confirmation = window.confirm("Supprimer définitivement ce tournoi ?");
      if(confirmation){
          Tournois.remove({ _id: IdTournoi });
      }
  }
});
