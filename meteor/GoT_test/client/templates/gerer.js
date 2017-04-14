Template.page_gerer.helpers({
  'tournoisCrees': function(){
    var currentUser = Meteor.userId();
    return Tournois.find({admin: currentUser}, {sort: {date: -1}});
  }
});
