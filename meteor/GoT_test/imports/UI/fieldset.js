import { Template } from 'meteor/templating';

import './fieldset.html';

// Le helper permet d'exécuter du code JS dans le template
Template.fieldset.helpers({
   
   // Création du tag "fs_title"
   'fs_title' : function(title){
       return title;
    }
});

Template.fieldset.events({
  'click .fieldset'() {
      alert('test');
  },
});
