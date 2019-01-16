 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as Animations from '../animations.js';
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

         // this.game.load.image('foreground-envelope', PiecSettings.assetsDir + 'after.png');
         // this.game.load.image('background-envelope', PiecSettings.assetsDir + 'envelope_background.png');
         this.game.load.image('content-landscape', PiecSettings.assetsDir + 'landscape.jpg');
         this.game.load.image('content-portrait', PiecSettings.assetsDir + 'portrait.jpg');
         // this.game.load.image('flap-envelope', PiecSettings.assetsDir + 'flap.png');
         // this.game.load.image('message-portrait', PiecSettings.assetsDir + 'message-portrait.png');
         // this.game.load.image('message-landscape', PiecSettings.assetsDir + 'message-landscape.png');
         // this.game.load.image('firework', PiecSettings.assetsDir + 'firework.png');
         // this.game.load.image('firework-particle', PiecSettings.assetsDir + 'firework_particle.png');
         this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');
         // this.game.load.image('star-particle', PiecSettings.assetsDir + 'star_particle.png');
         // this.game.load.image('spark-particle', PiecSettings.assetsDir + 'spark_particle.png');

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
