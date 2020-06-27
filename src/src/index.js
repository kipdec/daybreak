// index.js

import Phaser from 'phaser';
import TestDungeon from './levels/TestDungeon';

var config = {
  pixelArt: true,
  type: Phaser.WEBGL,
  scale: {
    mode: Phaser.Scale.FIT,
    height: 288,
    width: 288
  },
  zoom: 4,
  physics: {
    default: "arcade",
  },
  scene: [TestDungeon],
};

var game = new Phaser.Game(config);

