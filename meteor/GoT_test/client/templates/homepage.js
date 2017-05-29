/*****
 * Événements pour le template [homepage]
*****/
Template.homepage.events({
    
    /***** click #btnCreer'
     * Input: event (clic)
     * Output: redirection vers la page de création de tournoi
    *****/
  'click #btnCreer': function(event) {
    event.preventDefault();
    Router.go('/creer');
  },
    
    /***** click #btnSuivre'
     * Input: event (clic)
     * Output: redirection vers la page de création de suivi d'un tournoi
     * 
     * TODO: message d'erreur sur la page plutôt qu'alerte
    *****/
  'click #btnSuivre': function(event) {
    event.preventDefault();
    let url = $('#inputSuivre').val();
    if (Tournois.findOne({_id : url})) {
      Router.go(`/suivre/${url}`);
    } else {
      alert("Pas de tournoi avec cet id");
    }
  }
})
 
