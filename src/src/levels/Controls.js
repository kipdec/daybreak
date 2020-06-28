// Controls.js

import Phaser, { GameObjects } from 'phaser'
import { game } from '../index'
import controls from '../assets/tilemaps/controls.json';
import controlScreenSheet from '../assets/spritesheets/control_screen.png';

export default class Controls extends Phaser.Scene {
  constructor() {
    super({ key: 'Controls' })
  }

  preload () {
    this.load.image('control_tiles', controlScreenSheet);
    this.load.tilemapTiledJSON('control_tilemap', controls);
  }

  create () {
    // adding tilemap
    const map = this.make.tilemap({key: 'control_tilemap'});
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('controls','control_tiles');

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
