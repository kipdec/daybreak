import testDungeon from './scenes/testDungeon'

const config = {
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
  scene: [testDungeon]
};

var game = new Phaser.Game(config);
