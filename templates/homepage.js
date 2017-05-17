Template.homepage.events({
  'click #btnCreer': function(event) {
    event.preventDefault();
    Router.go('/creer');
  },
  'click #btnSuivre': function(event) {
    event.preventDefault();
    let url = $('#inputSuivre').val();
    if (Tournois.findOne({_id : url})) {
      Router.go(`/suivre/${url}`);
    } else {
      alert("Pas de tournoi avec cet id"); // TODO message d'erreur sur la page plutôt qu'alerte
    }
  }
})
