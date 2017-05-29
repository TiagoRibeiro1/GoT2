# Gestion online de Tournois (GoT2)

## Description
Avec GoT2, concentrez-vous sur le fun, et laissez notre application calculer les classements de vos tournois.

Grâce à votre compte -gratuit et ne générant aucun envoi de spam!- vous pourrez créer vos tournois, les gérer, et retrouver vos anciens faits d'arme dans votre espace personnel.

Créez autant de tournois que vous le désirez, avec autant de joueuses et de joueurs que nécessaire. Choisissez votre type de tournoi, le nombre de matchs à jouer. Ensuite, contentez-vous de battre vos adversaires et d'entrer les scores dans l'application. Tout le reste est automatiquement mis à jour, en temps réel!

Partagez vos résultats avec vos amies et vos amis sur toute la planète (voire plus!) grâce à la page de suivi, également mise à jour en temps réel sans besoin de demander un rafraîchissement!

## Fonctionnalités
Actuellement, l'application gère les tournois en mode championnat et en élimination directe.

## Interface
La page d'accueil permet de choisir entre la création d'un tournoi, ou le suivi en tant que spectateur.

Le menu principal permet de revenir en tout temps à la page d'accueil en cliquant sur le logo GoT. Il dispose également de raccourcis vers les pages de création, de suivi et de gestion des tournois, ainsi qu'un accès rapide pour se connecter ou se déconnecter de son compte.

La liste des tournois liés à un compte sont accessibles par le lien "Gérer ses tournois", dans le menu principal.

## Base de données
Les données sont organisées dans des collection MongoDB

- _users_ pour les utilisateurs (adresse mail)
- _tournois_ pour les tournois (nom, type, noms des joueurs, id de l'administrateur, date de création)
- _matchs_ pour les matchs (noms des joueurs, scores des joueurs, nombre de tour, nomb

## Dépendances
Cette application demande les dépendances suivantes:
 - babel-runtime
 - simpl-schema
 - meteor-node-stubs

Leur installation est décrite dans la section "Installation" ci-dessous

GoT2 utilise également les packages suivants (déjà contenus dans le code, aucune installation nécessaire):
 - iron:router
 - autoform (nécessite simpl-schema)

## Installation (Windows)
- Meteor

    1. Aller sur https://www.meteor.com/install
    2. [Download Installer]
    3. InstallMeteor.exe (ça prend un moment)

- git

    1. https://git-scm.com/download/win
    2. Git-2.13.0-64-bit.exe (all defaults)

- Installer GoT2
    1. CMD.exe
    2. mkdir github
    3. cd github
    4. git clone https://github.com/TiagoRibeiro1/GoT2

- Installer les dépendances
    1. cd GoT2/meteor/GoT_test
    2. meteor npm install --save babel-runtime
    3. meteor npm install --save simpl-schema
    4. meteor npm install --save meteor-node-stubs

- Lancer GoT2
    1. meteor (accepter la règle de firewall, au besoin)

- Accéder à GoT2
    1. Ouvrir son navigateur
    2. Accéder à localhost:3000

## Auteurs
Cette application a été créée par Raphaël BUBLOZ, Jean CEPPI, Lucas MARTINEZ et Tiago RIBEIRO dans le cadre du séminaire de Programmation pour Internet II sous la supervision d'Isaac PANTE lors du semestre de printemps 2017 à l'UNIL (Université de Lausanne).
