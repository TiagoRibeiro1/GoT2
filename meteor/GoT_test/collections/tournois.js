import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

Tournois = new Mongo.Collection("tournois");

Tournois.attachSchema(new SimpleSchema({
// Récupère l'utilisateur actuel et l'assigne comme admin du tournoi
  admin: {
    type: String,
    autoValue: function () {
      return Meteor.userId();
    }
  }, // Assigne le moment où a été créé le tournoi
  date: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }, // Nom du tournoi
  name: {
    type: String,
    label: "Nom du tournoi",
    max: 200
  }, // Type de tournoi
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
  }, // Option du nbr de match du Championnat
  optionChmpt: {
    type: Number,
    label: "Nombre de match contre chaque équipe",
    max: 8,
    min: 1,
    optional: true,
    custom: function(){
      // Si ce n'est pas une élimination directe, champ obligatoire
      if(this.field("typeTournoi").value !== "ELD" && this.value === undefined){
        return "required";
      }
    }
  }, // Option pour l'élimination directe
  optionElDir: {
    type: String,
    label: "Format pour l'élimination directe",
    autoform: {
      type: `select-radio`,
      options: function(){
        return [
          {label:"Match unique", value:"1M"},
          {label:"Match A/R", value:"AR"},
          {label:"Série", value:"Serie"}
      ]}
    },
    optional: true,
    custom: function(){
      // Si ce n'est pas un championnat, alors le champ est obligatoire
      if(this.field("typeTournoi").value !== "CHP" && this.value === undefined){
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
      // Si Serie a été sélectionné, champ obligatoire
        if(this.field("optionElDir").value === "Serie" && this.value === undefined){
          return "required";
        }
    }
  },
  joueurs: {
    type: String,
    label: "Liste des équipes (1 par ligne)"
  }
}, { tracker: Tracker }));
