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
          // i = Joueur 1
          for (let i = 0; i < tournoi.joueurs.length-1; i++) {
            // j = Joueur 2
            for (let j = i+1; j <= tournoi.joueurs.length-1; j++) {
              Matchs.insert({
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
        }

      } else if (tournoi.typeTournoi == "ELD") {
        console.log("Elimination directe");

      } else {
        console.log("Chmp puis Eldi");
      }

      // Matchs.insert({
      //   name: result
      // });
      // Redirection sur la page suivre
      Router.go(`/suivre/${idTournoi}`);
    }
  }
});
