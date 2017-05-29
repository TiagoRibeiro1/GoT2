/*****
 * Événements pour le template [page_enregistrer]
*****/
Template.page_enregistrer.events({
    'submit form': function(event){ // Lors de la soumission du formulaire
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({ // Création du compte utilisateur
            email: email,
            password: password
        });
        Router.go('/creer'); // Redirection vers la page de création
    }
});

/*****
 * Événements pour le template [login]
*****/
Template.login.events({
    'submit form': function(event){ // Lors de la soumission du formulaire
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password); // Login
    }
});
