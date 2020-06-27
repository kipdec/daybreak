// index.js

import Phaser from 'phaser';
import TestDungeon from './levels/TestDungeon';

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
  scene: [TestDungeon],
};

var game = new Phaser.Game(config);

