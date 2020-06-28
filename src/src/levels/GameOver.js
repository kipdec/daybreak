// GameOver.js

import Phaser, { GameObjects } from 'phaser'
import { game } from '../index'
import gameover from '../assets/tilemaps/gameover.json';
import gameoverScreenSheet from '../assets/spritesheets/game_over.png';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' })
  }

  init(data)
  {
    console.log('init', data);
    this.score = data.score;
  };

  preload () {
    this.load.image('go_tiles', gameoverScreenSheet);
    this.load.tilemapTiledJSON('go_tilemap', gameover);
  }

  create () {
    var scoreText = '0';
    // adding tilemap
    const map = this.make.tilemap({key: 'go_tilemap'});
    const score = this.score;
  
    // Adding sprite sheet
    const tileset = map.addTilesetImage('gameover_tset','go_tiles');

    // add the background
    const background = map.createStaticLayer('background', tileset, 0,0);
    background.setInteractive({useHandCursor: true});

    // get buttons
    const buttonsObjects = map.getObjectLayer('buttons')['objects'];
    const overlayObjects = map.getObjectLayer('overlay')['objects'];
    const scoreObject = overlayObjects.filter(o => o.name == 'score')[0];
    scoreText = this.add.text(scoreObject.x, scoreObject.y, score, { fontSize: '12px', fill: '#fff' });

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
