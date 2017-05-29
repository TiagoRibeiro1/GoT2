/*****
 * Événements pour le template [navBar]
*****/
Template.navBar.events({
    
    /***** click .logout
     * Input: event (clic)
     * Output: déconnexion
    *****/
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});

/*****
 * Helpers pour le template [navBar]
*****/
Template.navBar.helpers({
    
    /***** logo
     * Input: N/A
     * Output: affiche le logo depuis le chemin absolu du dossier public
    *****/
    logo: function() {
      return Meteor.absoluteUrl("favicon.png");
    }
});
