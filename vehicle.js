class Vehicle {
  static debug = false;

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 20;
    this.maxForce = 1;
    this.r = 16;
    this.rayonZoneDeFreinage = 100;
    this.isGlowing = isGlowing; // Propriété de brillance

    
  }


  //avoid function 
  avoid(obstacles) {

    // calcul d'un vecteur ahead devant le véhicule
    // il regarde par exemple 50 frames devant lui
    let ahead = this.vel.copy();
    ahead.mult(75);
    // Calcul de ahead2 situé au milieu de ahead
    let ahead2 = ahead.copy();
    ahead2.mult(25);

 /*   if (Vehicle.debug) {
      // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
      this.drawVector(this.pos, ahead, "yellow");
      // on dessine le vecteur ahead2 en bleu
      this.drawVector(this.pos, ahead2, "blue");
    }
*/
    // Calcul des coordonnées du point au bout de ahead
    let pointAuBoutDeAhead = this.pos.copy().add(ahead);
    // Calcul des coordonnées du point au bout de ahead2
    let pointAuBoutDeAhead2 = this.pos.copy().add(ahead2);


    // Detection de l'obstacle le plus proche
    let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);

    // Si pas d'obstacle, on renvoie un vecteur nul
    if (obstacleLePlusProche == undefined) {
      return createVector(0, 0);
    }

    // On calcule la distance entre l'obstacle le plus proche 
    // et le bout du vecteur ahead
    let distance = pointAuBoutDeAhead.dist(obstacleLePlusProche.pos);
    // idem avec ahead2
    let distance2 = pointAuBoutDeAhead2.dist(obstacleLePlusProche.pos);
    // idem avec la position du véhicule
    let distance3 = this.pos.dist(obstacleLePlusProche.pos);


   /* if (Vehicle.debug) {
      // On dessine avec un cercle le point au bout du vecteur ahead pour debugger
      fill(255, 0, 0);
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
      // et un au bout de ahead2
      fill(0, 255, 0);
      circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, 10);

      // On dessine la zone d'évitement
      // Pour cela on trace une ligne large qui va de la position du vaisseau
      // jusqu'au point au bout de ahead
      stroke(100, 100);
      strokeWeight(this.largeurZoneEvitementDevantVaisseau);
      line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
    }*/

    // Calcul de la plus petite distance entre distance et distance2
    distance = min(distance, distance2);
    // calcul de la plus petite distance entre distance et distance3
    distance = min(distance, distance3);

    // si la distance est < rayon de l'obstacle
    // il y a collision possible et on dessine l'obstacle en rouge
    if (distance < obstacleLePlusProche.r + this.r*2) {

      // calcul de la force d'évitement. C'est un vecteur qui va
      // du centre de l'obstacle vers le point au bout du vecteur ahead
      // on va appliquer force = vitesseDesiree - vitesseActuelle
      let desiredVelocity;
      if (distance == distance2) {
        desiredVelocity = p5.Vector.sub(pointAuBoutDeAhead2, obstacleLePlusProche.pos);
      } else if (distance == distance3) {
        desiredVelocity = p5.Vector.sub(this.pos, obstacleLePlusProche.pos);
      } else {
        desiredVelocity = p5.Vector.sub(pointAuBoutDeAhead, obstacleLePlusProche.pos);
      }

      if (Vehicle.debug) {
        // on le dessine en jaune pour vérifier qu'il est ok (dans le bon sens etc)
        this.drawVector(obstacleLePlusProche.pos, desiredVelocity, "yellow");
      }
      // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
      // on limite ce vecteur desiredVelocity à  maxSpeed
      desiredVelocity.setMag(this.maxSpeed);

      // on calcule la force à appliquer pour atteindre la cible avec la formule
      // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
      let force = p5.Vector.sub(desiredVelocity, this.vel);

      // on limite cette force à la longueur maxForce
      force.limit(this.maxForce);

      return force;
    } else {
      //obstacleLePlusProche.color = "green";
      return createVector(0, 0);
    }

  }


  //

  drawVector(pos, v, color) {
    push();
    // Dessin du vecteur vitesse
    // Il part du centre du véhicule et va dans la direction du vecteur vitesse
    strokeWeight(3);
    stroke(color);
    line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
    // dessine une petite fleche au bout du vecteur vitesse
    let arrowSize = 0.5;
    translate(pos.x + v.x, pos.y + v.y);
    rotate(v.heading());
    translate(-arrowSize / 2, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
  //
  getObstacleLePlusProche(obstacles) {
    let plusPetiteDistance = 100000000;
    let obstacleLePlusProche = undefined;
  
    obstacles.forEach(o => {
      // Je calcule la distance entre le vaisseau et l'obstacle
      const distance = this.pos.dist(o.pos);
  
      if (distance < plusPetiteDistance) {
        plusPetiteDistance = distance;
        obstacleLePlusProche = o;
      }
    });
  
    return obstacleLePlusProche;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  arrive(target, d = 0) {
    // 2nd argument true enables the arrival behavior
    // 3rd argumlent d is the distance behind the target
    // for "snake" behavior
    return this.seek(target, true, d);
  }

  flee(target) {
    
    // recopier code de flee de l'exemple précédent
  }
  eat(list, nutrition, perception) {
    let record = Infinity;
    let closest = null;

    // on parcourt la liste des éléments à manger
    // on cherche le plus proche
    for (let i = list.length - 1; i >= 0; i--) {
      const d = this.position.dist(list[i]);

      // si l'élément est à portée
      // on le mange et on gagne de la vie ou on en perd
      // selon que c'est de la nourriture ou du poison
      // on a pris this.maxspeed qui vaut 5 ici pour la distance
      // à partir de laquelle on mange l'élément. On aurait pu
      // definir une nouvelle variable
      if (d < 5) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        // si l'élément n'est pas à portée, 
        // on cherche le plus proche
        if (d < record && d < perception) {
          // on garde en mémoire la distance et l'élément
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!
    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  // TODO : modifier pour ajouter un 3ème paramètre d
  // qui dira à quelle distance derrière le véhicule on doit s'arrêter
  // si d=0 c'est le comportement arrival normal
  seek(target, arrival, d = 0) {
    let desiredSpeed = p5.Vector.sub(target, this.pos);
    let desiredSpeedMagnitude = this.maxSpeed;

    if (arrival) {
      // on dessine un cercle de rayon 100 
      // centré sur le point d'arrivée

      if (Vehicle.debug) {
        noFill();
        stroke("white")
        circle(target.x, target.y, this.rayonZoneDeFreinage)
      }
      
      // on calcule la distance du véhicule
      // par rapport au centre du cercle
      const dist = p5.Vector.dist(this.pos, target);

      if (dist < this.rayonZoneDeFreinage) {
        // on va diminuer de manière proportionnelle à
        // la distance, la vitesse
        // on va utiliser la fonction map(...) de P5
        // qui permet de modifier une valeur dans un 
        // intervalle initial, vers la même valeur dans un
        // autre intervalle
        // newVal = map(value, start1, stop1, start2, stop2, [withinBounds])
        desiredSpeedMagnitude = map(dist, d, this.rayonZoneDeFreinage, 0, this.maxSpeed)
      }
    }

    // equation force = vitesseDesiree - vitesseActuelle
    desiredSpeed.setMag(desiredSpeedMagnitude);
    let force = p5.Vector.sub(desiredSpeed, this.vel);
    // et on limite la force
    force.limit(this.maxForce);
    return force;
  }
 
  seekCorrectionSnake(target, arrival = false, d) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      // On définit un rayon de 100 pixels autour de la cible
      // si la distance entre le véhicule courant et la cible
      // est inférieure à ce rayon, on ralentit le véhicule
      // desiredSpeed devient inversement proportionnelle à la distance
      // si la distance est petite, force = grande
      // Vous pourrez utiliser la fonction P5 
      // distance = map(valeur, valeurMin, valeurMax, nouvelleValeurMin, nouvelleValeurMax)
      // qui prend une valeur entre valeurMin et valeurMax et la transforme en une valeur
      // entre nouvelleValeurMin et nouvelleValeurMax

      // 1 - dessiner le cercle de rayon 100 autour de la target
      if (Vehicle.debug) {
        stroke(255, 255, 255);
        noFill();
        circle(target.x, target.y, this.rayonZoneDeFreinage);
      }

      // 2 - calcul de la distance entre la cible et le véhicule
      let distance = p5.Vector.dist(this.pos, target);

      // 3 - si distance < rayon du cercle, alors on modifie desiredSPeed
      // qui devient inversement proportionnelle à la distance.
      // si d = rayon alors desiredSpeed = maxSpeed
      // si d = 0 alors desiredSpeed = 0
      if (distance < this.rayonZoneDeFreinage) {
        desiredSpeed = map(distance, d, this.rayonZoneDeFreinage, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show(index) {
    noStroke();
    if (index === 0) {
      // La tête du serpent
      fill(255, 100, 200); // Couleur différente pour la tête
      circle(this.pos.x, this.pos.y, this.r * 3);
   
      // Ajouter des "yeux" pour la tête
      fill(0); // Couleur noire pour les yeux
      let eyeOffset = this.r * 1;
      ellipse(this.pos.x - eyeOffset, this.pos.y - eyeOffset, this.r * 0.8, this.r * 0.8);
      ellipse(this.pos.x + eyeOffset, this.pos.y - eyeOffset, this.r * 0.8, this.r * 0.8);
  
      // Ajouter une langue animée
      push();
      stroke(255, 0, 0); // Rouge pour la langue
      strokeWeight(2); // Épaisseur de la langue
  
      let tongueLength = this.r * 1; // Longueur de la langue
      let tongueOscillation = sin(frameCount * 0.2) * this.r; // Mouvement oscillant pour la langue
      let tongueX = this.pos.x + (tongueLength + tongueOscillation) * cos(this.vel.heading());
      let tongueY = this.pos.y + (tongueLength + tongueOscillation) * sin(this.vel.heading());
  
      // Dessiner la langue avec animation
      line(this.pos.x, this.pos.y, tongueX, tongueY);
      pop();
    } else {
  
      // Corps du serpent
      fill(lerpColor(color(255, 100, 200), color(100, 0, 255), index / vehicles.length));
      stroke(0);
      strokeWeight(1);
      circle(this.pos.x, this.pos.y, this.r * 2.5);
  
      // Relier les segments avec des cercles
      let prevVehicle = vehicles[index - 1];
      let connectorRadius = this.r * 1.2; // Taille des cercles reliant les segments
      let midX = (this.pos.x + prevVehicle.pos.x) / 2;
      let midY = (this.pos.y + prevVehicle.pos.y) / 2;
  
      // Dessiner un cercle de connexion
      fill(lerpColor(color(255, 100, 200), color(100, 0, 255), (index - 0.5) / vehicles.length));
      noStroke();
      circle(midX, midY, connectorRadius);


    }
    if (isGlowing) {
      push();
      noFill();
      strokeWeight(4);
      stroke(lerpColor(color(255, 255, 100, 150), color(255, 100, 0, 50), sin(frameCount * 0.2)));
      ellipse(this.pos.x, this.pos.y, this.r * 5); // Halo autour du segment
      pop();
    }

    
  }
  
  
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    stroke(255);
    strokeWeight(1);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
  }
}
