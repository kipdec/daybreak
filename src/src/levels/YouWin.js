// YouWin.js

import Phaser, { GameObjects } from 'phaser'
import { game } from '../index'
import gameover from '../assets/tilemaps/YouWin.json';
import gameoverScreenSheet from '../assets/spritesheets/win_screen.png';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'YouWin' })
  }

  preload () {
    this.load.image('yw_tiles', gameoverScreenSheet);
    this.load.tilemapTiledJSON('yw_tilemap', gameover);
  }

  create () {
    // adding tilemap
    const map = this.make.tilemap({key: 'yw_tilemap'});
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('youwin_tset','yw_tiles');

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
