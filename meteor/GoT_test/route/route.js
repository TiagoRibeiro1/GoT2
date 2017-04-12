Router.configure({
  layoutTemplate: 'navBar',
  loadingTemplate: 'navBar'
});

Router.route('/', function () {
  this.render('homepage');
});

Router.route('/creer', function () {
  this.render('page_creer');
});

Router.route('/suivre', function () {
  this.render('page_suivre');
});

Router.route('/gerer', function () {
  this.render('page_gerer');
});

Router.route('/disclaimer', function () {
  this.render('page_disclaimer');
});

Router.route('/about', function () {
  this.render('page_about');
});


Router.route('/:_id', {
    template: 'page_suivre',
    data: function(){
        return Tournois.findOne({ _id: this.params._id });
    }
});
