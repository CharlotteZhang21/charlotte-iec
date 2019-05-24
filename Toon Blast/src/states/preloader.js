 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 // import * as Animations from '../animations.js';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.asset = null;
     }

     preload() {
         //setup loading bar
         // this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
         // this.load.setPreloadSprite(this.asset);

         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
         CustomPngSequencesRenderer.preloadPngSequences(this.game);
     }

     update() {}

     loadResources() {

         // this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');

         for (var i = 0; i < PiecSettings.assets.length; i++) {
             var assetsName = PiecSettings.assets[i];
             var assetsString = assetsName.split('.');
             this.game.load.image(assetsString[0], PiecSettings.assetsDir + assetsName);
         }


         this.game.global.animations = {};

         PiecSettings.animation = PiecSettings.animation || {};

         var defaultAnimation = {
             frameRate: 60,
             scale: 1
         };

     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;