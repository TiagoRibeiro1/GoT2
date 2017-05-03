import { Template } from 'meteor/templating';

import './title.html';

Template.title.events({
  'click .title'() {
      alert('test');
  },
});
