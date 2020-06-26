export default class testDungeon extends Phaser.scene {
  currentLevel

  constructor() {
    super({ key: 'testDungeon'})
  }

  init(props) {
    const { level= 0 } = props
    this.currentLevel = level
  }

  preload () {
    this.load.image('tiles', 'assets/spritesheets/sprite_sheet.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/test_dungeon.json');
    this.load.spritesheet('pc','assets/princess.png',
      {
        frameWidth: 24,
        frameHeight: 32,
      }
    );
  }
  
  create() {
    console.log(this.currentLevel)

    const map = this.make.tilemap({key: 'map'});

    // Adding sprite sheet
    const tileset = map.addTilesetImage('test3','tiles');
    //  A simple background for our game
    //this.add.image(400, 300, "sky");

    const floor = map.createStaticLayer('floor', tileset, 0, 0); 
    const walls = map.createStaticLayer('walls', tileset, 0, 0);
    walls.setCollisionByExclusion(-1, true);
    const doors = map.createStaticLayer('doors', tileset, 0, 0);

    // The player and its settings
    player = this.physics.add.sprite(80, 80, "pc");
    

    //  Player physics properties.
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
    };

    update() {
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
    }
}