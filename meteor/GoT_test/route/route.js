Router.configure({
  layoutTemplate: 'navBar',
  loadingTemplate: 'navBar'
});

Router.route('/', function () {
  this.render('homepage');
});

Router.route('/creer', {
  template: 'page_creer',
  onBeforeAction: function() {
    let currentUser = Meteor.userId();
    if (currentUser) {
      this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/suivre', function () {
  this.render('page_suivre');
});

Router.route('/gerer', {
  template: 'page_gerer',
  onBeforeAction: function() {
    let currentUser = Meteor.userId();
    if (currentUser) {
      this.next();
    } else {
      this.render("login");
    }
  }
});

Router.route('/disclaimer', function () {
  this.render('page_disclaimer');
});

Router.route('/about', function () {
  this.render('page_about');
});

Router.route('/senregistrer', function () {
  this.render('page_enregistrer');
});

Router.route('/login', function () {
  this.render('login');
});

Router.route('/:_id', {
    template: 'page_suivre',
    data: function(){
        return Tournois.findOne({ _id: this.params._id });
    }
});
