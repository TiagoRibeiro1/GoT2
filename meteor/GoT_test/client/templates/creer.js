// code qui permet d'intervenir sur le formulaire de création
AutoForm.hooks({
  // formulaire visé
  creationTournoi: {
    // Si la soumission du formulaire est fructueuse, alors création des matchs et redirection
    onSuccess: function (formType, idTournoi) {
      let tournoi = Tournois.findOne(idTournoi);
        // Logique pour les championnats
      if (tournoi.typeTournoi == "CHP") {
        let m = 1; //numéro de match
        // Avec t = le nombre de match contre chaque équipe
        for (let t = 0; t < tournoi.optionChmpt; t++){
          let tour = [];
          // i = Joueur 1
          for (let i = 0; i < tournoi.joueurs.length-1; i++) {
            // j = Joueur 2
            for (let j = i+1; j <= tournoi.joueurs.length-1; j++) {
              tour.push({
                idTournoi: idTournoi,
                j1: {
                  name: tournoi.joueurs[i],
                  score: 0
                },
                j2: {
                  name: tournoi.joueurs[j],
                  score: 0
                },
                termine: false,
                tour: t+1,
                nuMatch: m,
                timeStamp: new Date(),
                date: 0
              })
              m++;
            }
          }
          shuffleArray = function(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
          }
          shuffleArray(tour);
          tour.forEach(function(t){
            Matchs.insert(t);
          })
        }

      } else if (tournoi.typeTournoi == "ELD") {
        let m = 1; //numéro de match
        let nbTours = Math.log(tournoi.joueurs.length)/Math.LN2;
        console.log(nbTours);
        for (let t = 0; t < nbTours; t++){
          if (t == 0){
            // i = Joueur 1
            for (let i = 0; i < tournoi.joueurs.length-1; i+=2){
              // j = Joueur 2
              j = i+1;
                Matchs.insert({
                  idTournoi : idTournoi,
                  j1: {
                    name: tournoi.joueurs[i],
                    score: 0
                  },
                  j2: {
                    name: tournoi.joueurs[j],
                    score: 0
                  },
                  termine: false,
                  tour: t+1,
                  nuMatch: m,
                  nuMatchTour: [t+1,m],
                  timeStamp: new Date(),
                  date: 0
                })
                m++;
              }
          } else {
            let nbMatch = tournoi.joueurs.length/Math.pow(2,t+1);
            for(mTour = 0; mTour < nbMatch; mTour++){
              Matchs.insert({
                idTournoi : idTournoi,
                j1: {
                  name: "",
                  score: 0
                },
                j2: {
                  name: "",
                  score: 0
                },
                termine: false,
                tour: t+1,
                nuMatch: m,
                nuMatchTour: [t+1,mTour+1],
                timeStamp: new Date(),
                date: 0,
                label: `1/${nbMatch} finale`
              })
              m++;
            }
          }
        }
        console.log("Elimination directe");

      } else {
        console.log("Chmp puis Eldi");
      }

      // Matchs.insert({
      //   name: result
      // });
      // Redirection sur la page suivre
      Router.go(`/gerer/${idTournoi}`);
    }
  }
});
