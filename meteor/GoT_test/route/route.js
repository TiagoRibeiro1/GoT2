Router.configure({
  layoutTemplate: 'navBar',
  loadingTemplate: 'navBar',
  notFoundTemplate: 'page_notFound'
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

// Make stupidproof to avoid invalid url
Router.route('/suivre/:_id', {
    template: 'page_suivre',
    data: function(){
        return Tournois.findOne({ _id: this.params._id });
    }
});

Router.route('/gerer/:_id', {
    template: 'page_gerer',
    data: function(){
        return Tournois.findOne({ _id: this.params._id });
    }
});
