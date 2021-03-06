// Title.js

import Phaser, { GameObjects } from 'phaser'
import { game } from '../index'
import title from '../assets/tilemaps/introscreen.json';
import titleScreenSheet from '../assets/spritesheets/title_screen.png';

export default class Title extends Phaser.Scene {
  constructor() {
    super({ key: 'Title' })
  }

  preload () {
    this.load.image('title_tiles', titleScreenSheet);
    this.load.tilemapTiledJSON('title_map', title);
  }

  create () {
    // adding tilemap
    const map = this.make.tilemap({key: 'title_map'});
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('title_screen','title_tiles');

    // add the background
    const background = map.createStaticLayer('background', tileset, 0,0);
    background.setInteractive({useHandCursor: true});

    // get buttons
    const buttonsObjects = map.getObjectLayer('buttons')['objects'];

    let buttons = this.physics.add.group({});
    
    buttonsObjects.forEach(buttonObject => {
      const button = buttons.create(buttonObject.x, buttonObject.y).setOrigin(0);
      button.name = buttonObject.name;
      console.log(button.name);
      button.setDisplaySize(buttonObject.width, buttonObject.height);
      button.enableBody = true;
      button.setInteractive({useHandCursor: true});
      button.alpha = 0.000000000000001;
      switch (button.name) {
        case 'play':
          button.on('pointerdown', () => this.scene.start('TestDungeon'));
          break;
        case 'about':
          button.on('pointerdown', () => this.scene.switch('About'));
          break;
        case 'controls':
          button.on('pointerdown', () => this.scene.switch('Controls'));
          break;
        case 'credits':
          button.on('pointerdown', () => this.scene.switch('Credits'));
          break;
        default:
          console.log('not implemented');
      }

    });
  }
  
  update () {
  }
}
