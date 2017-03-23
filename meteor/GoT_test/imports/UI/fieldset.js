import { Template } from 'meteor/templating';

import './fieldset.html';

// Le helper permet d'exécuter du code JS dans le template
Template.fieldset.helpers({

});

Template.fieldset.events({

    'submit .btn_submit'(event) {
        // Prevent default browser form submit
        event.preventDefault();
    },
    // 'submit .creer'(event) {
    //     // À MODIFIER (cf. route.js & layoutApp.html)
    //     window.open('/creer','_self');
    // },
});
