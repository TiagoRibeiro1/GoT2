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
  // 'nombreMatchsRestants': function(idT) {
  //   console.log();
  //   if (Matchs.find({idTournoi: idT, termine: false}).count() == 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },
  'matchRestants': function(idT){
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
      let confirmation = window.confirm("Supprimer définitivement ce tournoi et les matchs associés?");
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
  // To check!!
  'keydown [name=scoreInputJ1], blur [name=scoreInputJ1]': function(event){
    let idMatch = this._id;
    let score = parseInt($(event.target).val());
    if (isNaN(score) || score === '') {
      $(event.currentTarget).css("background-color", "lightSalmon");
      console.log($('#TESST'));
      $('#TESST').removeClass("glyphicon-ok").addClass("glyphicon-alert");
    } else {
      $('#TESST').removeClass("glyphicon-alert").addClass("glyphicon-ok");
      $(event.currentTarget).css("background-color", "");
      if (event.type == 'focusout' || (event.which == 13 || event.which == 27 || event.which == 9)){
        Matchs.update({ _id : idMatch}, {$set: {"j1.score" : score}});
      }
    }
  },
  'keydown [name=scoreInputJ2], blur [name=scoreInputJ2]': function(event){
    let idMatch = this._id;
    let score = parseInt($(event.target).val());
    if (isNaN(score) || score === '') {
      $(event.currentTarget).css("background-color", "lightSalmon");
    } else {
      $(event.currentTarget).css("background-color", "");
      if (event.type == 'focusout' || event.which == 13 || event.which == 27 || event.which == 9){
        Matchs.update({ _id : idMatch}, {$set: {"j2.score" : score}});
      }
    }
  },
  'click .validerScore': function(event){

    console.log(event.target);
    let idMatch = this._id;
    let score1 = $('[name=scoreInputJ1]').val();
    let score2 = $('[name=scoreInputJ2]').val();

    console.log(`1: ${score1}, 2: ${score2}`);

    if (isNaN(score1) || isNaN(score2) || score1 === "" || score2 === "") {
      if (isNaN(score1) || score1 === "") {
        $('input[name=scoreInputJ1]').css("background-color", "red")
      } else {
        $('[name=scoreInputJ2]').css("background-color", "red")
      }
    } else {
      let date = `${new Date().getDate()}/${new Date().getMonth()+1} ${new Date().getHours()}:${new Date().getMinutes()}`
      Matchs.update({ _id: idMatch}, {$set: {termine: true, dateModif: date}})
    }
  }
});
