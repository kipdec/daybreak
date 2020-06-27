import Phaser from 'phaser'

let Attack = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize:

  // Attack constructor
  function Attack (scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'attack');
    this.speed = 0.08
    this.born = 0
    this.direction = 0
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.setSize(2, 2, true);
  },

  // shoots off a spell from the attacker to the crosshair
  shoot: function (attacker, target) {
    this.setPosition(attacker.x, attacker.y); // Initial position
    this.direction = Math.atan( (target.x-this.x) / (target.y-this.y));

    // Calculate X and y velocity of spell to move it from attacker to target
    if (target.y >= this.y)
    {
      this.xSpeed = this.speed*Math.sin(this.direction);
      this.ySpeed = this.speed*Math.cos(this.direction);
    }
    else
    {
      this.xSpeed = -this.speed*Math.sin(this.direction);
      this.ySpeed = -this.speed*Math.cos(this.direction);
    }

    this.rotation = attacker.rotation; // angle spell with attackers rotation
    this.born = 0; // Time since new spell spawned
  },

  // Updates the position of the spell each cycle
  update: function (time, delta)
  {
      this.x += this.xSpeed * delta;
      this.y += this.ySpeed * delta;
      this.born += delta;
      if (this.born > 1800)
      {
          this.setActive(false);
          this.setVisible(false);
      }
  }

})

export default Attack