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
    max: 8,
    min: 2,
    optional: true,
    custom: function(){
      // If tournament is Championnat or championat & playoff
      if(this.field("typeTournoi").value !== "ELD" && this.value === undefined){
        return "required";
      }
    }
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
    },
    optional: true,
    custom: function(){
      // If tournament is Elimination directe
      if(this.field("typeTournoi").value === "ELD" && this.value === undefined){
        return "required";
      }
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
    },
    optional: true,
    custom: function(){
      // If tournament has serie of match
        if(this.field("optionElDir").value === "PM" && this.value === undefined){
          return "required";
        }
    }
  },
  joueurs: {
    type: String,
    label: "Liste des équipes (1 par ligne)"
  }
}, { tracker: Tracker }));
