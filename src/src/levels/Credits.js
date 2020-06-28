// Credits.js

import Phaser, { GameObjects } from 'phaser'
import { game } from '../index'
import credits from '../assets/tilemaps/credits.json';
import creditScreenSheet from '../assets/spritesheets/credits_screen.png';

export default class Controls extends Phaser.Scene {
  constructor() {
    super({ key: 'Credits' })
  }

  preload () {
    this.load.image('credit_tiles', creditScreenSheet);
    this.load.tilemapTiledJSON('credit_tilemap', credits);
  }

  create () {
    // adding tilemap
    const map = this.make.tilemap({key: 'credit_tilemap'});
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('credits_tset','credit_tiles');

    // add the background
    const background = map.createStaticLayer('background', tileset, 0,0);
    background.setInteractive({useHandCursor: true});

    // get buttons
    const buttonsObjects = map.getObjectLayer('buttons')['objects'];

    let buttons = this.physics.add.group({});
    
    buttonsObjects.forEach(buttonObject => {
      const button = buttons.create(buttonObject.x, buttonObject.y).setOrigin(0);
      button.name = buttonObject.name;
      button.setDisplaySize(buttonObject.width, buttonObject.height);
      button.enableBody = true;
      button.setInteractive({useHandCursor: true});
      button.alpha = 0.000000000000001;
      switch (button.name) {
        case 'back':
          button.on('pointerdown', () => this.scene.switch('Title'));
          break;
        default:
          console.log('not implemented');
      }

    });
  }
  
  update () {
  }
}
