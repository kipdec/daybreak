// index.js

import Phaser from 'phaser';
import TestDungeon from './levels/TestDungeon';
import Title from './levels/Title.js';

document.body.style.cursor = 'none';  // removes cursor so we can use crosshair instead

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
    arcade: {
      debug: true
    }
  },
  scene: [Title,TestDungeon],
};

export var game = new Phaser.Game(config);
