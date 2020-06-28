// TestDungeon.js

import Phaser, { GameObjects } from 'phaser'
import { game } from '../index'
import testDungeon from '../assets/tilemaps/test_dungeon_fullersize.json';
import pcImg from '../assets/talia.png';
import sS from '../assets/spritesheets/sprite_sheet.png';
import fireball from '../assets/fireball.png';
import reticleImg from '../assets/reticle.png';
import Attack from '../common/Attack.js';
import enemyImg from '../assets/pc.png'
import bearImg from '../assets/bear.png';
import heartImg from '../assets/heart.png';

var player;
var enemies;
var reticle;
var cursors;
var gameOver = false;
const bearSpeed = 10;

export default class TestDungeon extends Phaser.Scene {
  constructor() {
    super({ key: 'TestDungeon' })
  }

  preload () {
    this.load.image('tiles', sS);
    this.load.tilemapTiledJSON('map', testDungeon);
    this.load.spritesheet('pc',pcImg,{
      frameWidth: 20,
      frameHeight: 20
    });
    this.load.image('attack', fireball);
    this.load.image('enemy', enemyImg);
    this.load.spritesheet('bear', bearImg, {
      frameWidth: 14,
      frameHeight: 15
    });
    this.load.image('reticle', reticleImg);
    this.load.spritesheet('heart', heartImg, {
      frameWidth: 7,
      frameHeight: 6
    });
  }

  create () {
    // adding tilemap
    const map = this.make.tilemap({key: 'map'});
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('test3','tiles');
  
    // create map
    const floor = map.createStaticLayer('floor', tileset, 0, 0); 
    const projectileWalls = map.createStaticLayer('projectilewalls', tileset, 0,0);
    const walls = map.createStaticLayer('walls', tileset, 0, 0);
    walls.setCollisionByExclusion(-1, true);
    const doors = map.createStaticLayer('doors', tileset, 0, 0);

    projectileWalls.setCollisionByExclusion(-1, true);

    // The player and its settings
    player = this.physics.add.sprite(80, 80, "pc");
    player.health = 5;
    player.attackDay = true;

    // draw health sprites
    // figure out locations
    const overlayObjects = map.getObjectLayer('overlay')['objects'];
    const heartObject = overlayObjects.filter(o => o.name == 'heart')[0];
    console.log(heartObject);
    // 1px space between
    var heartLocations = []
    // Calculate where the hearts should be
    for (var i = 0; i < player.health; i++){
      const buffSize = 8;
      const buffer = buffSize * (i );
      const coordinates = {
        x: heartObject.x + buffer,
        y: heartObject.y
      };

      heartLocations.push(coordinates);
    }

    console.log(heartLocations);

    // Add hearts
    var hearts = this.physics.add.group();
    heartLocations.forEach(location => {
      const heartSprite = this.physics.add.sprite(location.x, location.y, 'heart');
      hearts.add(heartSprite);
    });
  
    // Player physics properties.
    player.setCollideWorldBounds(true);
    player.isHit = false;
    
    this.physics.add.collider(player, walls);

    this.anims.create({
      key: 'empty',
      frames: this.anims.generateFrameNumbers('heart', {start: 1, end: 2}),
      frameRate: 3,
    });

    this.anims.create({
      key: 'full',
      frames: [{ key: 'heart', frame: 0 }],
      frameRate: 10,
    });
  
    // Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("pc", { start: 1, end: 2 }),
      frameRate: 5,
      repeat: -1,
    });
  
    this.anims.create({
      key: "stand",
      frames: [{ key: "pc", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('pc', { start: 3, end: 4 }),
      frameRate: 5,
    });
  
    // create crosshair which is controlled by player class
    reticle = this.physics.add.sprite(145, 145, 'reticle');
    reticle.setOrigin(0.5, 0.5).setDisplaySize(50, 25).setCollideWorldBounds(true);
    
      //  Input Events
    cursors = this.input.keyboard.addKeys({
      up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D,
      space:Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift:Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    // add doors
    var stairsObjects = map.getObjectLayer('stairs')['objects'];
    var stairs = this.physics.add.group({
      immovable: true,
      visible: false
    });

    // add enemies
    var enemiesObjects = map.getObjectLayer('enemies')['objects'];
    enemies = this.physics.add.group({
      immovable: true,
      visible: true
    })

    //console.log(stairsObjects);

    stairsObjects.forEach(stairsObject => {
      const stair = stairs.create(stairsObject.x, stairsObject.y - 8).setOrigin(0);
      stair.setDisplaySize(stairsObject.width, stairsObject.height);
      stair.visible = false;
    });
    this.physics.add.collider(player, stairs, () => this.scene.start('TestDungeon'));
    
    // create group for attack spell objects
    let playerAttacks = this.physics.add.group({ classType: Attack, runChildUpdate: true });

    enemiesObjects.forEach(enemiesObject => {
      const bearSprite = this.physics.add.sprite(enemiesObject.x, enemiesObject.y, 'bear')
      bearSprite.day = true
      bearSprite.health = 3;
      enemies.add(bearSprite);
    });

    console.log(player.health);
    console.log(enemies)



    // Fires attack from player on left or right (trying to fix right) click of mouse
    this.input.on('pointerdown', () => {

      // Get attack from attacks group
      var attack = playerAttacks.get().setActive(true).setVisible(true);

      if (attack)
      {
        attack.shoot(player, reticle);
      }
    }, this);

    // attack colliders
    this.physics.add.collider(playerAttacks, projectileWalls, (attack) => playerAttacks.remove(attack, true, true));
    this.physics.add.collider(playerAttacks, enemies, (attack, bearSprite) => {
      playerAttacks.remove(attack, true, true);
      
      // check enemy element and match to attack element
      if (bearSprite.day === player.attackDay) {
        // decrement health counter on enemy
        bearSprite.health -= 1;
        console.log(bearSprite.health);
      }
      if(bearSprite.health <= 0) {
        enemies.remove(bearSprite, true, true);
      }

      
    });

    this.physics.add.collider(enemies, player, (player, bear) => {
      var angle = Phaser.Math.Angle.Between(player.x, player.y, bear.x, bear.y);
      player.isHit = true;
      console.log(angle);
      var angleX = 1;
      var angleY = 1;
      // knock player back on opposite angle
      if(angle > 0){
        angleY = -1;
        if(angle < 1.5) angleX = -1;
      }

      if(angle <= 0 && angle > -1.5) {
        angleX = -1;
      }
      
      player.setVelocityX(800 * angleX);
      player.setVelocityY(800 * angleY);
      player.x = player.x + 10 * angleX;
      player.y = player.y + 10 * angleY;

      player.health -= 1;
      if(player.health <= 0) {
        game.input.mouse.releasePointerLock();
        this.scene.start('GameOver');
      }

      const heartToBreak = hearts.children.entries[player.health];
      console.log(heartToBreak);
      heartToBreak.anims.play('empty', true);

    })

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function () {
      game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
      if (game.input.mouse.locked)
        game.input.mouse.releasePointerLock();
    }, 0, this);

    this.input.keyboard.on('keydown_SHIFT', () => {
      player.attackDay = !player.attackDay;
      console.log(`switched to ${player.attackDay ? 'day' : 'night'}`);
    });

    // Move reticle upon pointer move
    this.input.on('pointermove', function (pointer) {
      reticle.x += pointer.movementX;
      reticle.y += pointer.movementY;
    }, this);
  }
  
  update () {
    const rot = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);
    if (gameOver) {
      return;
    }
    
    let moving = false;
    
    player.setVelocityX(0);
    player.setVelocityY(0);

    if (cursors.left.isDown) {
      player.setVelocityX(-60);
      moving = true;
    } else if (cursors.right.isDown) {
      player.setVelocityX(60);
      moving = true;
    } 

    if (cursors.up.isDown) {
      player.setVelocityY(-60);
      moving = true;
    } else if (cursors.down.isDown) {
      player.setVelocityY(60);
      moving = true;
    }

    if (player.isHit) {
      console.log('hit!');
      player.anims.play('hit', true);
      player.isHit = false;
    }

    // see if the bears are dead
    const enemyCount = enemies.children.entries.length;
    if (enemyCount == 0) this.scene.start('YouWon');

    // give the bears some moves
    enemies.children.entries.forEach(enemy => {
      const moreLeft = player.x >= enemy.x;
      const moreUp = player.y >= enemy.y;

      moreLeft ? enemy.setVelocityX(bearSpeed) : enemy.setVelocityX(-bearSpeed);
      moreUp ? enemy.setVelocityY(bearSpeed) : enemy.setVelocityY(-bearSpeed);
    });

    moving && !player.isHit ? player.anims.play('move', true) : player.anims.play('stand');

  }
}
