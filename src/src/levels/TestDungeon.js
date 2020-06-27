// TestDungeon.js

import Phaser from 'phaser'
import { game } from '../index'
import testDungeon from '../assets/tilemaps/test_dungeon_fullersize.json';
import pcImg from '../assets/princess.png';
import sS from '../assets/spritesheets/sprite_sheet.png';
import fireball from '../assets/fireball.png';
import reticle from '../assets/reticle.png';
import Attack from '../common/Attack.js';

var player;
var cursors;
var gameOver = false;

export default class TestDungeon extends Phaser.Scene {
  constructor() {
    super({ key: 'TestDungeon' })
  }

  preload () {
    this.load.image('tiles', sS);
    this.load.tilemapTiledJSON('map', testDungeon);
    this.load.spritesheet('pc',pcImg,{
      frameWidth: 24,
      frameHeight: 32
    });
    this.load.image('attack', fireball);
    this.load.image('reticle', reticle);
  }

  create () {
    // adding tilemap
    const map = this.make.tilemap({key: 'map'});
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('test3','tiles');
  
    // create map
    const floor = map.createStaticLayer('floor', tileset, 0, 0); 
    const walls = map.createStaticLayer('walls', tileset, 0, 0);
    walls.setCollisionByExclusion(-1, true);
    const doors = map.createStaticLayer('doors', tileset, 0, 0);

    // The player and its settings
    player = this.physics.add.sprite(80, 80, "pc");
  
    // Player physics properties.
    player.setCollideWorldBounds(true);
    
    this.physics.add.collider(player, walls);
  
    // Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("pc", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
  
    this.anims.create({
      key: "turn",
      frames: [{ key: "pc", frame: 0 }],
      frameRate: 20,
    });
  
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("pc", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    
    // create crosshair which is controlled by player class
    const reticle = this.physics.add.sprite(145, 145, 'reticle');
    reticle.setOrigin(0.5, 0.5).setDisplaySize(50, 25).setCollideWorldBounds(true);
    
    // create group for attack spell objects
    let playerAttacks = this.physics.add.group({ classType: Attack, runChildUpdate: true });

    //  Input Events
    cursors = this.input.keyboard.addKeys(
      {up:Phaser.Input.Keyboard.KeyCodes.W,
      down:Phaser.Input.Keyboard.KeyCodes.S,
      left:Phaser.Input.Keyboard.KeyCodes.A,
      right:Phaser.Input.Keyboard.KeyCodes.D,
      space:Phaser.Input.Keyboard.KeyCodes.SPACE});

    // add doors
    var stairsObjects = map.getObjectLayer('stairs')['objects'];
    var stairs = this.physics.add.group({
      immovable: true,
      visible: false
    });

    //console.log(stairsObjects);

    stairsObjects.forEach(stairsObject => {
      const stair = stairs.create(stairsObject.x, stairsObject.y - 8).setOrigin(0);
      stair.setDisplaySize(stairsObject.width, stairsObject.height);
      stair.visible = false;
    });
    console.log(stairs);
    this.physics.add.collider(player, stairs, () => this.scene.start('TestDungeon'));

    // Fires attack from player on left click of mouse
    this.input.on('pointerdown', function (pointer, time, lastFired) {
      if (player.active === false)
        return;

      // Get attack from attacks group
      var attack = playerAttacks.get().setActive(true).setVisible(true);

      if (attack)
      {
        attack.shoot(player, reticle);
        this.physics.add.collider(attack, walls);
      }
    }, this);

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function () {
      game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
      if (game.input.mouse.locked)
        game.input.mouse.releasePointerLock();
    }, 0, this);

    // Move reticle upon pointer move
    this.input.on('pointermove', function (pointer) {
      reticle.x += pointer.movementX;
      reticle.y += pointer.movementY;
    }, this);
  }
  
  update () {
    if (gameOver) {
      return;
    }
    
    if (cursors.left.isDown) {
      player.setVelocityX(-60);

      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(60);

      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);

      player.anims.play("turn");
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-60);
    } else if (cursors.down.isDown) {
      player.setVelocityY(60)
    } else {
      player.setVelocityY(0)
    }
  }
}
