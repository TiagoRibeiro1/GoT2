Template.navBar.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});

Template.navBar.helpers({
    logo: function() {
      return Meteor.absoluteUrl("favicon.png");
    }
});
