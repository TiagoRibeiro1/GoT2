import { Template } from 'meteor/templating';

import './fieldset.html';

Template.fieldset.events({
  'click .fieldset'() {
      alert('test');
  },
});
