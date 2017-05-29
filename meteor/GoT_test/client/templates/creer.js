// code qui permet d'intervenir sur le formulaire de création
AutoForm.hooks({
    // formulaire visé
    creationTournoi: {
        // Si la soumission du formulaire est fructueuse, alors création des matchs et redirection
        onSuccess: function (formType, idT) {
            let tournoi = Tournois.findOne(idT);
/*****
 *  POUR LES CHAMPIONNATS
*****/
            if (tournoi.typeTournoi == "CHP") {
                let m = 1; //numéro de match
                for (let t = 0; t < tournoi.optionChmpt; t++){ // t = nombre de match contre chaque équipe
                    let tour = [];
                    for (let i = 0; i < tournoi.joueurs.length-1; i++) { // i = Joueur 1
                        for (let j = i+1; j <= tournoi.joueurs.length-1; j++) { // j = Joueur 2
                            let jr1 = tournoi.joueurs[i]
                            let jr2 = tournoi.joueurs[j]
                            if (t%2 == 1) { // inverse les joueurs dans 1 match sur 2
                                let temp = jr1;
                                jr1 = jr2;
                                jr2 = temp;
                            }
                            // Création du match
                            tour.push({
                                idTournoi: idT,
                                j1: {
                                    name: jr1,
                                    score: 0
                                },
                                j2: {
                                    name: jr2,
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
/*****
 *  POUR LES ÉLIMINATIONS DIRECTES
*****/
            } else if (tournoi.typeTournoi == "ELD") {
                let nbInscrits = tournoi.joueurs.length;
                let nbJoueurs = tournoi.joueurs;

                shuffleArray = function(array) {
                    for (var i = array.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                    }
                    return array;
                }
                shuffleArray(nbJoueurs);
                // Making array.length a power of two for conveniency TODO change comment #Lucas
                for(let i = 1; i < 9; i++){
                    if((Math.pow(2,i) < nbInscrits) && (nbInscrits < Math.pow(2,i+1))){
                        let jManquants = Math.pow(2,i+1) - nbInscrits;
                        let index = 0;
                        for(let k = 0; k < jManquants; k++){
                            nbJoueurs.splice(index, 0, "exempt");
                            index+=2;
                        }
                    }
                }

                let m = 1; //numéro de match
                let nbTours = Math.log(nbJoueurs.length)/Math.LN2; // nombre de tours nécessaires
                for (let t = 0; t < nbTours; t++){
                    if (t == 0){ // Pour le 1er tour
                        for (let i = 0; i < nbJoueurs.length-1; i+=2){ // i = Joueur 1
                            let j = i+1; // j = Joueur 2
                            let fini = false;
                            if (nbJoueurs[i] == "exempt" || nbJoueurs[j] == "exempt") {
                                fini = true;
                            }
                            // Création du match
                            Matchs.insert({
                                idTournoi : idT,
                                j1: {
                                    name: nbJoueurs[i],
                                    score: 0
                                },
                                j2: {
                                    name: nbJoueurs[j],
                                    score: 0
                                },
                                termine: fini,
                                tour: t+1,
                                nuMatch: m,
                                nuMatchTour: [t+1,m],
                                timeStamp: new Date(),
                                date: 0
                            });
                            m++;
                        }
                    } else { // Pour les tours suivants
                        let nbMatch = nbJoueurs.length/Math.pow(2,t+1);
                        for(mTour = 0; mTour < nbMatch; mTour++){
                            // Création du match
                            Matchs.insert({
                                idTournoi : idT,
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
/***** C'EST QUOI ? *****/
                setNextMatch = function(idT, nbT){
                    Matchs.find({ $or: [{"j1.name": "exempt"},{"j2.name": "exempt"}], termine: true, idTournoi: idT})
                    .forEach(function(match){
                        let nextMatch = [];
                        if (match.j1.name == "exempt" && match.j2.name != "") {
                            if(match.nuMatchTour[1] % 2 == 0){
                                nextMatch = [match.nuMatchTour[0]+1,match.nuMatchTour[1]/2];
                                let nxtM = Matchs.findOne({idTournoi: idT, nuMatchTour: nextMatch});
                                Matchs.update({_id: nxtM._id}, {$set: {"j2.name": match.j2.name}});
                            } else {
                                nextMatch = [match.nuMatchTour[0]+1,(match.nuMatchTour[1]+1)/2];
                                let nxtM = Matchs.findOne({idTournoi: idT, nuMatchTour: nextMatch});
                                Matchs.update({_id: nxtM._id}, {$set: {"j1.name": match.j2.name}});
                            }
                        }
                    });
                }

                setNextMatch(idT, nbTours);
                
/*****
 *  NI CHAMPIONNATS, NI ÉLIMINATION DIRECTE
*****/
            } else {
                console.log("Chmp puis Eldi");
            }

            // Redirection sur la page gerer
            Router.go(`/gerer/${idT}`);
        }
    }
});
