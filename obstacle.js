class Obstacle {
  constructor(x, y, r, couleur) {
    this.pos = createVector(x, y); // Obstacle position
    this.r = r; // Obstacle radius
    this.color = couleur; // Obstacle fill color
    this.health = 100; // Obstacle health
    this.borderColor = color(random(255), random(255), random(255)); // Random border color
  }

  show() {
    // Draw the obstacle
    push();
    fill(this.color);
    stroke(this.borderColor);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.r * 2); // Outer circle
    fill(0);
    ellipse(this.pos.x, this.pos.y, 10); // Inner circle
    pop();

    // Display health above the obstacle
    fill(255);
    textAlign(CENTER);
    textSize(12);
    text(this.health, this.pos.x, this.pos.y - this.r - 10);
  }

  takeDamage(amount) {
    
    this.health -= amount; // Reduce obstacle health
    if (this.health%10===0) {
      let i = this.health ;
      obstacles.splice(i, 1);
      console.log('Obstacle destroyed!'); // Log message when destroyed
    }
  }

  collideWithParticle(particle) {
    let distance = p5.Vector.dist(this.pos, particle.position); // Distance between obstacle and particle

    if (distance < this.r + particle.r) {
      // Collision detected
      let collisionNormal = p5.Vector.sub(particle.position, this.pos).normalize(); // Direction of collision
      let overlap = this.r + particle.r - distance; // Calculate overlap

      particle.position.add(collisionNormal.copy().mult(overlap)); // Push particle out of obstacle

      particle.velocity.reflect(collisionNormal); // Reflect particle velocity

      this.takeDamage(50); // Obstacle takes damage
    }
  }
}
