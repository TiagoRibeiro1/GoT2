import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Books = new Mongo.Collection("books");
Books.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Nom du tournoi",
    max: 200
  },
  typeTournoi: {
    type: String,
    label: "Type de tournoi",
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
  truc: {
    type: String,
    label: "La condition marche",
    optional: true
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
