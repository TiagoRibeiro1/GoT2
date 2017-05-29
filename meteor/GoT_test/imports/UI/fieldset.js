import { Template } from 'meteor/templating';

import './fieldset.html';

Template.fieldset.helpers({

});

/*****
 * Événements pour le template [fieldset]
*****/
Template.fieldset.events({
    
    /***** submit .btn_submit
     * Input: event (clic)
     * Output: évite que le formulaire soit soumis automatiquement
    *****/
    'submit .btn_submit'(event) {
        // Prevent default browser form submit
        event.preventDefault();
    },
});
