class EnemySnakes {
  constructor(x, y, initialSize = 5) {  // Ajouter un paramètre pour définir la taille initiale
    this.body = [];
    this.color = color(random(255), random(255), random(255));  // Assigner une couleur aléatoire
    this.size = 20;  // Taille de chaque segment du serpent
    this.speed = 5;  // Vitesse du serpent
    this.direction = createVector(random(-1, 1), random(-1, 1));  // Direction aléatoire

    // Initialiser le serpent avec plusieurs segments
    for (let i = 0; i < initialSize; i++) {
      this.body.push(createVector(x - i * this.size, y));  // Placer les segments du serpent
    }
  }

  // Mettre à jour la position du serpent
  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();  // Supprimer le dernier segment du serpent

    head.add(this.direction.copy().mult(this.speed));  // Avancer la tête

    this.body.push(head);  // Ajouter la nouvelle tête
  
  
  
  }

  // Dessiner le serpent
  draw() {
    for (let i = 0; i < this.body.length; i++) {
      fill(this.color);  // Utiliser la couleur du serpent
      noStroke();
      ellipse(this.body[i].x, this.body[i].y, this.size, this.size);  // Dessiner chaque segment
    }
  }

  // Détecter si un serpent ennemi mange de la nourriture
  eatFood() {
    for (let i = food.length - 1; i >= 0; i--) {
      const d = dist(this.body[this.body.length - 1].x, this.body[this.body.length - 1].y, food[i].x, food[i].y);
      if (d < this.size) {  // Si la tête du serpent touche la nourriture
        food.splice(i, 1);  // Supprimer la nourriture mangée
        foodColors.splice(i, 1);  // Supprimer la couleur de la nourriture
        this.grow();  // Faire grandir le serpent
      }
    }
  }

  // Faire grandir le serpent en ajoutant un segment
  grow() {
    let newSegment = createVector(this.body[0].x, this.body[0].y);
    this.body.unshift(newSegment);  // Ajouter un nouveau segment au début du serpent
  }

  // Déplacer le serpent (logique de base de déplacement)
  move() {
    this.direction = createVector(random(-1, 1), random(-1, 1));  // Déplacement aléatoire pour l'exemple
  }
}
