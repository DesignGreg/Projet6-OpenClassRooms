/* 1. Model */
/*----------*/

// Les joueurs
function Joueur (nom, visuel, vie) {
    this.nom = nom;
    this.visuel = visuel;
    this.vie = vie;
}

let joueur1 = new Joueur("Joueur 1", "images/joueur1.png", 100);
let joueur2 = new Joueur("Joueur 2", "images/joueur2.png", 100);



// Les 4 types d'armes
function Arme (nom, visuel, dégâts) {
    this.nom = nom;
    this.visuel = visuel;
    this.dégâts = dégâts;
}

let epee = new Arme("Epée", "images/epee.png", 10);
let dague = new Arme("Dague", "images/dague.png", 5);
let hache = new Arme("Hache", "images/hache.png", 20);


/* 2. Controller */
/*----------*/

// Déplacement des joueurs
/* Ne passe pas à travers une case Lave ou un Joueur, ramasse l'arme située sur la même case que son déplacement, se bat contre l'autre joueur si adjacent HOR ou VER. 

Pas de gestion de tours.
Si un joueur arrive à côté d'un autre, attaque automatique puis fin du tour.
Fin du tour à la fin du mouvement sinon.

Touches directionnelles pour se déplacer.
Touche A pour attaquer et D pour se défendre. */



/* 3. View */
/*----------*/

// Génération du plateau de jeu
/* Plateau de jeu avec 80% de cases pave, libre de mouvement, et 20% de cases lave, obstacles. */

// Génération de 4 armes
/* 4 armes différentes (objets) disposées aléatoirement sur le plateau.
2 des armes sont celles qui équipent par défaut les joueurs.


// Placement des joueurs sur le plateau
/* Les joueurs sont disposés aléatoirement au chargement, ils ne peuvent pas se toucher ni se trouver côte à côte. */