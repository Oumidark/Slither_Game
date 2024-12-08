// Déclaration des variables principales
let vehicles = []; // Tableau pour stocker les segments du serpent principal
let target; // Vecteur cible pour le serpent
const flock = []; // Tableau pour stocker les "boids" (poissons)
let mode = "snake"; // Mode de jeu (par défaut "snake")
let particleA, particleB; // Particules utilisées dans le jeu
let obstacles = []; // Tableau pour les obstacles
const food = []; // Tableau pour stocker les aliments
let enemySnakes = []; // Tableau pour les serpents ennemis
let sliderVitesseMaxVehicules; // Slider pour régler la vitesse max des véhicules
let enemiesEaten = 0; // Compteur pour les ennemis mangés
let qtree; // QuadTree pour la gestion des collisions
let alimentsManges = 0; // Compteur pour les aliments consommés
let segmentSize = 20; // Taille d'un segment de serpent
const foodColors = []; // Tableau pour stocker les couleurs des aliments

// Variables pour la gestion de la brillance du serpent joueur
let isGlowing = false; // Indique si le serpent est en mode brillance
let glowTimer = 0; // Durée de la brillance

// Préchargement des images nécessaires
function preload() {
  backgroundImage = loadImage('assets/infinite.png'); // Image de fond
  particleImage = loadImage('assets/enemy.png'); // Image des ennemis
  fishImage = loadImage('assets/butterflie.png'); // Image des "boids"
}

// Initialisation du canvas et des entités du jeu
function setup() {
  createCanvas(windowWidth, windowHeight); // Créer un canvas couvrant tout l'écran
// Création de sliders pour ajuster les paramètres des véhicules
    // "label", min, max, val, pas, posX, posY, couleur, propriété à changer
    createMonSlider("maxSpeed", 1, 20, 7, 1, 10, 0, "white", "maxSpeed");
    createMonSlider("maxForce", 0.1, 1, 0.5, 0.05, 10, 30, "white", "maxForce");
 // createCanvas(800, 800);
//quadtree start
// Configuration du QuadTree pour la gestion des collisions
let boundary = new Rectangle(800, 800, 1920, 1920);
  qtree = new QuadTree(boundary, 4);
  for (let i = 0; i < 300; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);
    qtree.insert(p);
  }
// Initialisation des particules 
 particleA = new Particle(320, 60);
 particleB = new Particle(320, 300);
  target = createVector(width / 2, height / 2);
  const posYSliderDeDepart = 200;
// Génère un obstacle avec une couleur aléatoire
//obstacles.push(new Obstacle(width / 3, height / 1.5, 80, color(random(255), random(255), random(255))));
//obstacles.push(new Obstacle(width / 1, height / 6, 100, color(random(255), random(255), random(255))));
//obstacles.push(new Obstacle(width / 2, height / 8, 100, color(random(255), random(255), random(255))));

let rayon = 10;
creerSerpent(5, rayon); // Créer un serpent avec 5segments
  
  
  // Créer des serpents ennemis
  for (let i = 0; i < 10; i++) {
    let enemy = new EnemySnakes(random(width), random(height), 5); // Le serpent ennemi commence avec 5 segments
    enemySnakes.push(enemy);
  }


  // On créer les "boids". Un boid en anglais signifie "un oiseau" ou "un poisson"
  // Dans cet exemple c'est l'équivalent d'un véhicule dans les autres exemples
  for (let i = 0; i < 200; i++) {
    const b = new Boid(random(width), random(height), fishImage);
    b.r = random(8, 50);
    flock.push(b);
  }
}
  

function creerSerpent(nb, rayon) {
  for (let i = 0; i < nb; i++) {
    // Initialisation en ligne droite (peut être modifié pour une courbe)
    let x = width / 2 - i * rayon * 2; // Espacement régulier entre les segments
    let y = height / 2;
    let vehicle = new Vehicle(x, y);
    vehicle.r = rayon;
    vehicles.push(vehicle);
  }
}
function createMonSlider(label, min, max, val, step, x, y, color, prop) {
  // Vérifier si un slider existe déjà pour éviter la duplication
  if (!this.sliders) {
    this.sliders = {};
  }

  if (this.sliders[label]) {
    this.sliders[label].remove(); // Supprimer l'ancien slider
    this.sliders[label + "_label"].remove(); // Supprimer l'ancien label
    this.sliders[label + "_value"].remove(); // Supprimer l'ancienne valeur
  }

  // Créer un slider
  let slider = createSlider(min, max, val, step);
  slider.position(x + 100, y + 17); // Ajuster la position
  this.sliders[label] = slider;

  // Créer un label
  let labelHTML = createP(label);
  labelHTML.style('color', 'white');
  labelHTML.position(x, y);
  this.sliders[label + "_label"] = labelHTML;

  // Afficher la valeur
  let labelValue = createP(slider.value());
  labelValue.style('color', color);
  labelValue.position(x + 250, y);
  this.sliders[label + "_value"] = labelValue;

  // Mettre à jour la valeur dynamiquement
  slider.input(() => {
    labelValue.html(slider.value());
    vehicles.forEach(vehicle => {
      vehicle[prop] = slider.value();
    });
  });
}

// Fonction principale d'affichage
function draw() {
  background(0);
  
  imageMode(CENTER);

  // Draw the background image, ensuring it's centered and stretched
  image(backgroundImage, width / 2, height / 2, width, height);
  displayInstructions();
  qtree.show();
 

// Affichage des "boids" et de leur comportement
  for (let boid of flock) {
    boid.flock(flock);
    boid.fleeWithTargetRadius(vehicles);
    boid.update();
    boid.show();
  }
  //
  // Mise à jour des serpents ennemis
  for (let enemySnake of enemySnakes) {
    enemySnake.update();
    enemySnake.move();
    enemySnake.eatFood();
    enemySnake.draw();
  }


  // Brillance du serpent joueur
  if (isGlowing) {
    glowTimer--;
    if (glowTimer <= 0) {
      isGlowing = false; // Désactiver la brillance après 5 secondes
    }
  }

  // Dessiner la nourriture et la gérer
  for (let i = 0; i < food.length; i++) {
    push();
    fill(foodColors[i]);
    noStroke();
    ellipse(food[i].x, food[i].y, 10, 10);  // Dessiner la nourriture
    pop();
  }
  // Cible qui suit la souris, cercle rouge de rayon 5
  target.x = mouseX;
  target.y = mouseY;

  obstacles.forEach(o => {
    o.show();
  })
  for (let obstacle of obstacles) {
    obstacle.collideWithParticle(particleA);
    obstacle.collideWithParticle(particleB);
  }
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 5);

  // On fait apparaitre aléatoirement de la nourriture
  if (random(1) < 0.1) {
    const x = random(width);
    const y = random(height);
    food.push(createVector(x, y));

    // Couleur aléatoire pour chaque nourriture
    const foodColor = color(random(100, 255), random(100, 255), random(100, 255), 200);
    foodColors.push(foodColor);
  }

  for (let i = 0; i < food.length; i++) {
    // Effet de brillance : halo lumineux
    push();
    stroke(foodColors[i]);
    strokeWeight(6); // Taille du halo
    noFill();
    ellipse(food[i].x, food[i].y, 3 + sin(frameCount * 0.5) * 5); // Animation du halo
    pop();

    // Nourriture colorée
    push();
    fill(foodColors[i]);
    noStroke();
    ellipse(food[i].x, food[i].y, 1, 1); // Nourriture principale
    pop();

    // Attirer la nourriture si la tête du serpent est proche
    const distanceToHead = dist(food[i].x, food[i].y, vehicles[0].pos.x, vehicles[0].pos.y);
    if (distanceToHead < 40) { // Seuil de proximité
      const attraction = p5.Vector.sub(vehicles[0].pos, food[i]); // Calculer le vecteur d'attraction
      attraction.setMag(2); // Intensité de l'attraction
      food[i].add(attraction); // Déplacer la nourriture vers la tête
    }
  }

  vehicles.forEach((vehicle, index) => {
    let steeringForce;
    let avoidForce = vehicle.avoid(obstacles);
    if (index === 0) {
      // Premier véhicule suit la souris
      steeringForce = vehicle.arrive(target, 0);
      // Combiner la force d'évitement et la force d'attraction
      steeringForce.add(avoidForce.mult(1.5)); // Donnez une priorité à l'évitement


      // Collision avec les serpents ennemis
      for (let i = enemySnakes.length - 1; i >= 0; i--) {
        const enemySnake = enemySnakes[i];
        for (let part of enemySnake.body) {
          const d = dist(vehicle.pos.x, vehicle.pos.y, part.x, part.y);
          if (d < vehicle.r + enemySnake.size / 2) {
            enemySnakes.splice(i, 1);
            
            startGlowing(); // Démarre la brillance
          }
        }
      }
      // Vérifier si tous les serpents ennemis ont été mangés
      if (enemySnakes.length === 0) {
        displayVictoryScreen(); // Afficher l'écran de victoire
        noLoop(); // Arrêter le jeu
      }


      // Gestion de la nourriture consommée
      for (let i = food.length - 1; i >= 0; i--) {
        const d = dist(vehicle.pos.x, vehicle.pos.y, food[i].x, food[i].y);

        if (d < 5) {
          food.splice(i, 1); // Supprimer l'aliment mangé
          foodColors.splice(i, 1); // Supprimer la couleur associée
          alimentsManges++;
          // Incrémenter le compteur

          if (alimentsManges % 5 === 0) { // Si 10 aliments sont consommés
            ajouterSegment(); // Ajouter un segment
          }

        }
      }
    } else {
      // Chaque véhicule suit le précédent
      let vehiculePrecedent = vehicles[index - 1];
      steeringForce = vehicle.arrive(vehiculePrecedent.pos, 10);
      // je relie les vehicules avec eux avec des ligne
      // Couleurs de départ et de fin
      let startColor = color(255, 0, 0); // Rouge
      let endColor = color(0, 0, 255);   // Bleu
      let gradientColor = lerpColor(startColor, endColor, index / vehicles.length);

      // Dessiner une ligne avec un dégradé
      stroke(gradientColor)
      // stroke(20);
      strokeWeight(22);
      line(vehiculePrecedent.pos.x, vehiculePrecedent.pos.y, vehicle.pos.x, vehicle.pos.y);
      // Couleurs de départ et de fin

    }
    avoidForce = vehicle.avoid(obstacles);

    vehicle.applyForce(steeringForce);
    vehicle.applyForce(avoidForce);
    vehicle.update();
    vehicle.show(index);
  });
  


      particleA.collide(particleB);
      
particleA.update();
particleB.update();

particleA.edges();
particleB.edges();

particleA.show();
particleB.show();
for (let vehicle of vehicles) { // Check all segments of the snake
  if (dist(vehicle.pos.x, vehicle.pos.y, particleA.position.x, particleA.position.y) < vehicle.r + particleA.r ||
      dist(vehicle.pos.x, vehicle.pos.y, particleB.position.x, particleB.position.y) < vehicle.r + particleB.r) {
    console.log("Game Over! The snake touched a particle.");
    noLoop(); // Stop the game loop
    displayGameOverScreen();
    return;
  }
}
}
function ajouterSegment() {
  // Ajouter un nouveau segment à la position du dernier segment
  const dernierVehicule = vehicles[vehicles.length - 1];
  const nouveauVehicule = new Vehicle(dernierVehicule.pos.x, dernierVehicule.pos.y);
  nouveauVehicule.r = dernierVehicule.r; // Garder le même rayon
  vehicles.push(nouveauVehicule);
}
function startGlowing() {
  isGlowing = true;
  glowTimer = 100; // 3 secondes de brillance
}

function displayGameOverScreen() {
  textSize(92);
  fill("255"); // Rouge
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);

  textSize(70);
  fill("green"); // Blanc pour le score
  text("Score: " + vehicles.length, width / 2, height / 2 + 60);

  textSize(25);
  fill(200); // Gris clair pour le texte d'instruction
  text("Click to Try Again", width / 2, height / 2 + 120);
}
//AJOUTER 
function displayInstructions() {
  textSize(22); // Taille du texte
  textAlign(LEFT, TOP); // Alignement à gauche et en haut
  textStyle(BOLD); // Met le texte en gras
  
  let startX = 1162; // Position horizontale de départ
  let startY = 20; // Position verticale de départ
  let lineHeight = 39; // Espacement entre les lignes
  
  // Affichage de la première ligne avec la lettre d en couleur différente
  fill("pink"); // Couleur pour le reste du texte
  text("Press ", startX, startY);
  
  fill("red"); // Couleur spécifique pour <d>
  text("<d>", startX + textWidth("Press "), startY);
  
  fill("pink"); // Revenir à la couleur normale
  text(" for Debug", startX + textWidth("Press <d>"), startY);
  
   // Affichage de la deuxième ligne avec "MouseDragged" en rouge et le reste en rose
   fill("green"); // Couleur spécifique pour "MouseDragged"
   text("MouseDragged", startX, startY + lineHeight);
   
   fill("pink"); // Couleur pour le reste de la phrase
   text(" for more Butterflies", startX + textWidth("MouseDragged"), startY + lineHeight);
   
  // Affichage de la troisième ligne avec la lettre o en couleur différente
  fill("pink"); // Couleur pour le reste du texte
  text("Press ", startX, startY + 2 * lineHeight);
  
  fill("blue"); // Couleur spécifique pour <o>
  text("<o>", startX + textWidth("Press "), startY + 2 * lineHeight);
  
  fill("pink"); // Revenir à la couleur normale
  text(" for obstacles", startX + textWidth("Press <o>"), startY + 2 * lineHeight);
}



function mousePressed() {
 /* let randomColor = color(random(255), random(255), random(255));
  let randomSize = random(5, 100);
  obstacles.push(new Obstacle(mouseX, mouseY, randomSize, randomColor));
  */if (!isLooping()) { // If the game is not running
    resetGame();
    loop(); // Restart the game loop
  } else {
   /* let randomColor = color(random(255), random(255), random(255));
    let randomSize = random(5, 100);
    obstacles.push(new Obstacle(mouseX, mouseY, randomSize, randomColor));
  */}
}
function resetGame() {
  // Reset all necessary variables
  vehicles = [];
  target = createVector(width / 2, height / 2);
  flock.length = 0;
  obstacles = [];
  food.length = 0;
  foodColors.length = 0;
  enemySnakes.length = 0;

  // Reinitialize the game
  setup();
}
function displayVictoryScreen() {
  textSize(92);
  fill("green"); // Couleur du texte de victoire
  textAlign(CENTER, CENTER);
  text("You Win!", width / 2, height / 2);

  textSize(70);
  fill("yellow"); // Couleur du score
  text("Score: " + vehicles.length, width / 2, height / 2 + 60);

  textSize(25);
  fill(200); // Gris clair pour le texte d'instruction
  text("Click to Play Again", width / 2, height / 2 + 120);
}


function mouseDragged() {
  
  const b = new Boid(mouseX, mouseY, fishImage);
  
  b.r = random(8, 40);

  flock.push(b);
  }




function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }else if (key === 'o') {
    let randomColor = color(random(255), random(255), random(255));
    let randomSize = random(10, 80);
    obstacles.push(new Obstacle(mouseX, mouseY, randomSize, randomColor));
  }
  }

  

