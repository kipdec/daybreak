// index.js

import Phaser from 'phaser';
import TestDungeon from './levels/TestDungeon';

document.body.style.cursor = 'none';  // removes cursor so we can use crosshair instead

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
