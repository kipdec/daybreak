// index.js

import Phaser from 'phaser';
import importsWork from './test.js';
import pcImg from './assets/princess.png';
import sS from './assets/spritesheets/sprite_sheet.png';
import testDungeon from './assets/tilemaps/test_dungeon.json';

var config = {
  pixelArt: true,
  type: Phaser.WEBGL,
  scale: {
    height: 160,
    width: 160
  },
  zoom: 5,
  physics: {
    default: "arcade",
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', sS
  );
  this.load.tilemapTiledJSON('map', testDungeon);
  this.load.spritesheet('pc',pcImg,{
    frameWidth: 24,
    frameHeight: 32
  });
}

function create() {
  // adding tilemap
  const map = this.make.tilemap({key: 'map'});

  // Adding sprite sheet
  const tileset = map.addTilesetImage('test3','tiles');
  //  A simple background for our game
  //this.add.image(400, 300, "sky");

  const floor = map.createStaticLayer('floor', tileset, 0, 0); 
  const walls = map.createStaticLayer('walls', tileset, 0, 0);
  walls.setCollisionByExclusion(-1, true);
  const doors = map.createStaticLayer('doors', tileset, 0, 0);
  importsWork();


  //  The platforms group contains the ground and the 2 ledges we can jump on
  //platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  //platforms
  //  .create(400, 568, "ground")
  //  .setScale(2)
  //  .refreshBody();

  //  Now let's create some ledges
  //platforms.create(600, 400, "ground");
  //platforms.create(50, 250, "ground");
  //platforms.create(750, 220, "ground");

  //// The player and its settings
  player = this.physics.add.sprite(80, 80, "pc");
  //

  ////  Player physics properties.
  player.setCollideWorldBounds(true);
  
  this.physics.add.collider(player, walls);

  //  Our player animations, turning, walking left and walking right.
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

  //  Input Events
  cursors = this.input.keyboard.addKeys(
    {up:Phaser.Input.Keyboard.KeyCodes.W,
    down:Phaser.Input.Keyboard.KeyCodes.S,
    left:Phaser.Input.Keyboard.KeyCodes.A,
    right:Phaser.Input.Keyboard.KeyCodes.D,
    space:Phaser.Input.Keyboard.KeyCodes.SPACE});

  ////  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  //stars = this.physics.add.group({
  //  key: "star",
  //  repeat: 11,
  //  setXY: { x: 12, y: 0, stepX: 70 },
  //});

  //stars.children.iterate(function(child) {
  //  //  Give each star a slightly different bounce
  //  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  //});

  //bombs = this.physics.add.group();

  ////  The score
  //scoreText = this.add.text(16, 16, "score: 0", {
  //  fontSize: "32px",
  //  fill: "#000",
  //});

  ////  Collide the player and the stars with the platforms
  //this.physics.add.collider(player, platforms);
  //this.physics.add.collider(stars, platforms);
  //this.physics.add.collider(bombs, platforms);

  ////  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  //this.physics.add.overlap(player, stars, collectStar, null, this);

  //this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-100);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(100);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    player.setVelocityY(100)
  } else {
    player.setVelocityY(0)
  }
  
  // const dodge = () => {
  //   if (cursors.left.isDown) {
  //     player.setPosition(player.x - 1, player.y);
  //     player.anims.play("left", true);
      
  //   } else if (cursors.right.isDown) {
  //     player.setPosition(player.x + 1, player.y);
      
  //     player.anims.play("right", true);
  //   } else {
  //     player.setVelocityX(0);
  
  //     player.anims.play("turn");
  //   }
  
  //   if (cursors.up.isDown) {
  //     player.setPosition(player.x, player.y - 1);

  //   } else if (cursors.down.isDown) {
  //     player.setPosition(player.x, player.y + 1);

  //   } else {
  //     player.setVelocityY(0)
  //   }
  // }

  // cursors.space.on('down', dodge)  

}

function collectStar(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;
}
