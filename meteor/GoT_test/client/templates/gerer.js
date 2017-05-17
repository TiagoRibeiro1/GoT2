Template.page_gerer.helpers({
  'plusieursTournois': function(){
    let currentUser = Meteor.userId();
    let count = Tournois.find({admin: currentUser}, {sort: {date: -1}}).count();
    if(count >= 1){
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
    return Matchs.find({
      idTournoi: idT,
      termine: false
    });
  },
  'nbrMatchRestants': function(idT){
    return Matchs.find({
      idTournoi: idT,
      termine: false
    }).count();
  }
});

Template.page_gerer.events ({
  // To delete tournoi and all related matches
  'click .suppr-tournoi': function(event){
    event.preventDefault();
    let idTournoi = this._id;
    let confirmation = window.confirm("Supprimer définitivement ce tournoi et les matchs associés?");
    if(confirmation){
      Router.go('/gerer');
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
  'keydown [name=scoreInputJ1], blur [name=scoreInputJ1]': function(event){
    let idMatch = this._id;
    let score = parseInt($(event.target).val());
    if (isNaN(score) || score === '') {
      $(event.currentTarget).css("background-color", "lightSalmon");
      $(`span#${event.target.classList[2]}`).removeClass("glyphicon-ok").addClass("glyphicon-alert");
    } else {
      if (isNaN($('[name=scoreInputJ2]').val()) || $('[name=scoreInputJ2]').val() === '') {
        $(`[name=scoreInputJ2].${event.target.classList[2]}`).css("background-color", "lightSalmon");
        $(event.currentTarget).css("background-color", "");
      } else {
        $(`span#${event.target.classList[2]}`).removeClass("glyphicon-alert").addClass("glyphicon-ok");
        $(event.currentTarget).css("background-color", "");
        if (event.type == 'focusout' || (event.which == 13 || event.which == 27 || event.which == 9)){
          Matchs.update({ _id : idMatch}, {$set: {"j1.score" : score}});
        }
      }
    }
  },
  'keydown [name=scoreInputJ2], blur [name=scoreInputJ2]': function(event){
    let idMatch = this._id;
    let score = parseInt($(event.target).val());
    if (isNaN(score) || score === '') {
      $(event.currentTarget).css("background-color", "lightSalmon");
      $(`span#${event.target.classList[2]}`).removeClass("glyphicon-ok").addClass("glyphicon-alert");
    } else {
      if (isNaN($('[name=scoreInputJ1]').val()) || $('[name=scoreInputJ1]').val() === '') {
        $(`[name=scoreInputJ1].${event.target.classList[2]}`).css("background-color", "lightSalmon");
        $(event.currentTarget).css("background-color", "");
      } else {
        $(`span#${event.target.classList[2]}`).removeClass("glyphicon-alert").addClass("glyphicon-ok");
        $(event.currentTarget).css("background-color", "");
        if (event.type == 'focusout' || (event.which == 13 || event.which == 27 || event.which == 9)){
          Matchs.update({ _id : idMatch}, {$set: {"j2.score" : score}});
        }
      }
    }
  }, // Validation du score du match
  'click .glyphicon-ok': function(event){
    let idMatch = this._id; // Retrieve match id
    let idT = this.idTournoi; // Retrieve tournament id
    let joueurs; // Create an array and assign the players in it
    Tournois.find({_id : idT}).forEach(function(t){
      joueurs = t.joueurs;
    });
    // This function sorts the players according to their points
    sort = function(idT, joueurs) {
      // Define the function to compare scores
      function compare(a,b) {
        if (a.score > b.score)
          return -1;
        if (a.score < b.score)
          return 1;
        return 0;
      }
      let classement = []; // This array will contain player objects with name and score
      joueurs.forEach(function(j) {
        let nuls = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": j}, {$where: "this.j1.score == this.j2.score"}]},{$and: [{"j2.name": j}, {$where: "this.j2.score == this.j1.score"}]}]}).count();
        let victoires = Matchs.find({idTournoi: idT, termine: true, $or: [ /* TODO Comment faire sans $where ???*/ {$and: [{"j1.name": j}, {$where: "this.j1.score > this.j2.score"}]}, {$and: [{"j2.name": j}, {$where: "this.j2.score > this.j1.score"}]}]}).count();
        let pts = nuls + victoires * 3;
        let joueur = {};
        joueur.nom = j; // add name to object
        joueur.score = pts; // add score to object
        classement.push(joueur); // add player to array
      });
      classement.sort(compare); // Sort the array by score
      let joueursTries = Object.keys(classement).map(key => classement[key].nom); // Retrieve only the names of player sorted
      Tournois.update({_id : idT}, {$set : { "joueurs" : joueursTries}}); // Change the array of player to have them in order
    };
    sort(idT, joueurs); // Sort the players by score

    let now = new Date(); // Create a date
    let date; // Create a custom date
    if (now.getMinutes() < 10) { // if single minute --> add a 0 before. ex. 9 -> 09
      date = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:0${now.getMinutes()}`;
    } else {
      date = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:${now.getMinutes()}`;
    }
    Matchs.update({ _id: idMatch}, {$set: {termine: true, dateModif: date, timeStamp: now}}); //set the match as ended, add customDate & timeStamp
  }
});
