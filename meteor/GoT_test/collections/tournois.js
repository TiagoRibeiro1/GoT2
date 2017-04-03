import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Books = new Mongo.Collection("books");
Books.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  author: {
    type: String,
    label: "Author",
    autoform: {
      type: `select`,
      options: function(){
        return [
          {label:"Championnat", value:"CHP"},
          {label:"Eeeeeuh", value:"EEE"},
          {label:"Elimination", value:"EL"},
      ]}
    }
  },
  copies: {
    type: Number,
    label: "Number of copies",
    min: 0
  },
  lastCheckedOut: {
    type: Date,
    label: "Last date this book was checked out",
    optional: true
  },
  summary: {
    type: String,
    label: "Brief summary",
    optional: true,
    max: 1000
  }
}, { tracker: Tracker }));
