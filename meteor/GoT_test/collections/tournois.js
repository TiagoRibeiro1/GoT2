import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Tournois = new Mongo.Collection("tournois");

Tournois.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Nom du tournoi",
    max: 200
  },
  typeTournoi: {
    type: String,
    label: "Type de tournoi",
    autoform: {
      type: `select-radio`,
      options: function(){
        return [
          {label:"Championnat", value:"CHP"},
          {label:"Elimination", value:"ELD"},
          {label:"Championnat et playoff", value:"CHE"}
      ]}
    }
  },
  optionChmpt: {
    type: Number,
    label: "Nombre de match contre chaque équipe",
    max: 8
  },
  optionElDir: {
    type: String,
    label: "Format pour l'élimination directe",
    autoform: {
      type: `select-radio`,
      options: function(){
        return [
          {label:"Match unique", value:"1M"},
          {label:"Match A/R", value:"2M"},
          {label:"Série", value:"PM"}
      ]}
    }
  },
  optionSerie: {
    type: String,
    label: "au meilleur des combien de matchs ?",
    autoform: {
      type: `select-radio-inline`,
      options: function(){
        return [
          {label:"3", value:"3M"},
          {label:"5", value:"5M"},
          {label:"7", value:"7M"}
      ]}
    }
  },
  joueurs: {
    type: String,
    label: "Liste des équipes (1 par ligne)"
  }
}, { tracker: Tracker }));
