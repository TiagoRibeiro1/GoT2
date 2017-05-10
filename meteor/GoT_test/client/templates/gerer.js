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
  },
  'click .glyphicon-ok': function(event){
    let idMatch = this._id;
    let idT = this.idTournoi;
    let joueurs;
    Tournois.find({_id : idT}).forEach(function(t){
      joueurs = t.joueurs;
    })
    sort = function(idT, joueurs) {
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

    let date = `${new Date().getDate()}/${new Date().getMonth()+1} ${new Date().getHours()}:${new Date().getMinutes()}`
    Matchs.update({ _id: idMatch}, {$set: {termine: true, dateModif: date}})
      console.log("c0est oui");
    }
    sort(idT, joueurs);
  }
});
