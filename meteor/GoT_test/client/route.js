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
