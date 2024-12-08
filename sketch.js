let vehicles = [];
let target;
const flock = [];
let mode = "snake";
let particleA,particleB;
let obstacles = [];
const food = [];
let enemySnakes = [];
let sliderVitesseMaxVehicules;
let enemiesEaten = 0;
//let enemySnakes = [];
let qtree;
let alimentsManges=0 ;
let segmentSize = 20;
const foodColors = []; // Stocker les couleurs de chaque nourriture
// Variables pour la brillance du serpent joueur
let isGlowing = false;
let glowTimer = 0;

// Equivalent du tableau de véhicules dans les autres exemples
/*
const flock = [];
let fishImage;
let requinImage;
let posYSliderDeDepart = 10;
let alignSlider, cohesionSlider, separationSlider;
let labelNbBoids;
*/



function preload() {
  // Charger l'image du fond
  backgroundImage = loadImage('assets/infinite.png');
  particleImage = loadImage('assets/enemy.png');
   // Assurez-vous que l'image est dans le dossier 'assets'
 fishImage = loadImage('assets/butterflie.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas sur tout l'écran
 // createCanvas(800, 800);
//quadtree start

let boundary = new Rectangle(800, 800, 1920, 1920);
  qtree = new QuadTree(boundary, 4);
  for (let i = 0; i < 300; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);
    qtree.insert(p);
  }

 particleA = new Particle(320, 60);
 particleB = new Particle(320, 300);
  target = createVector(width / 2, height / 2);
  const posYSliderDeDepart = 200;
// Génère un obstacle avec une couleur aléatoire
//obstacles.push(new Obstacle(width / 3, height / 1.5, 80, color(random(255), random(255), random(255))));
//obstacles.push(new Obstacle(width / 1, height / 6, 100, color(random(255), random(255), random(255))));
//obstacles.push(new Obstacle(width / 2, height / 8, 100, color(random(255), random(255), random(255))));
  let rayon = 10;
  creerSerpent(5, rayon); // Créer un serpent avec 10 segments
  
  
  // Créer des serpents ennemis
  for (let i = 0; i < 10; i++) {
    let enemy = new EnemySnakes(random(width), random(height), 5); // Le serpent ennemi commence avec 5 segments
    enemySnakes.push(enemy);
  }
  // "label", min, max, val, pas, posX, posY, couleur, propriété à changer
  createMonSlider("maxSpeed", 1, 20, 15, 1, 10, 0, "white", "maxSpeed");
  createMonSlider("maxForce", 1, 5, 1, 0.01, 10, 30, "white", "maxForce");

  // On créer les "boids". Un boid en anglais signifie "un oiseau" ou "un poisson"
  // Dans cet exemple c'est l'équivalent d'un véhicule dans les autres exemples
  for (let i = 0; i < 200; i++) {
    const b = new Boid(random(width), random(height), fishImage);
    b.r = random(8, 50);
    flock.push(b);
  }
/*
  // Créer un label avec le nombre de boids présents à l'écran
   labelNbBoids = createP("Nombre de boids : " + flock.length );
  // couleur blanche
  labelNbBoids.style('color', 'white');
  labelNbBoids.position(10, posYSliderDeDepart+180);
*/
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
  // On crée un slider pour régler la vitesse max
  // des véhicules
  // slider les paramètres : Min, Max, Valeur, Pas
  let slider = createSlider(min, max, val, step);
  // on positionne le slider en haut à gauche du canvas
  slider.position(100, y + 17);
  // Label à gauche du slider "maxSpeed"
  labelHTML = createP(label);
  // label en blanc
  labelHTML.style('color', 'white');
  // on le positionne en x=10 y = 10
  labelHTML.position(x, y);
  // On affiche la valeur du slider à droite du slider
  let labelValue = createP(slider.value());
  labelValue.style('color', color);
  labelValue.position(250, y);
  // on veut que la valeur soit mise à jour quand on déplace
  // le slider
  slider.input(() => {
    labelValue.html(slider.value());
    // On change la propriété de tous les véhicules
    vehicles.forEach(vehicle => {
      vehicle[prop] = slider.value();
    });
  });



}

function draw() {
  background(0);
  // Affiche les instructions par-dessus


  // particles




  //
  // drawEnemySnakes(); // Dessine les serpents ennemis
  // updateEnemySnakes(); // Met à jour les serpents ennemis
  // Dessiner l'image hexagonale de fond
  imageMode(CENTER);

  // Draw the background image, ensuring it's centered and stretched
  image(backgroundImage, width / 2, height / 2, width, height);
  displayInstructions();
  qtree.show();
  // L'image s'adapte à la taille de la fenêtre
  //boids 


  for (let boid of flock) {
    //boid.edges();
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
  
/*
    // mettre à jour le nombre de boids
    labelNbBoids.html("Nombre de boids : " + flock.length);
    for (let boid of flock) {
      //boid.edges();
      boid.flock(flock);
  
      boid.fleeWithTargetRadius(target);
  
      boid.update();
      boid.show();
    }  */

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

  
