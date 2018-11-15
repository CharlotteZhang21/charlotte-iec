 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as Animations from '../animations.js';
 import * as FxRenderer from '../utils/fx-renderer.js';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
 import * as WinMessages from '../utils/win-messages-util.js';

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
         FxRenderer.preloadFx(this.game);
         // CustomPngSequencesRenderer.preloadPngSequences(this.game);
         WinMessages.preloadWinMessages(this.game);
     }

     update() {}

     loadResources() {

        this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');

        this.game.load.image('background', PiecSettings.assetsDir + 'bg.jpg');

        this.game.load.image('cta', PiecSettings.assetsDir + 'cta.png');

        this.game.load.image('win-message', PiecSettings.assetsDir + 'win-message.png');

        this.game.load.image('empty-space', PiecSettings.assetsDir + 'empty-space.png');

        this.game.load.image('construction', PiecSettings.assetsDir + 'construction.png');

        this.game.load.image('balloon-yellow', PiecSettings.assetsDir + 'balloon-yellow.png');
        this.game.load.image('balloon-red', PiecSettings.assetsDir + 'balloon-red.png');
        this.game.load.image('balloon-blue', PiecSettings.assetsDir + 'balloon-blue.png');
        this.game.load.image('balloon-green', PiecSettings.assetsDir + 'balloon-green.png');

        for (var i = 0; i < PiecSettings.options.length; i++) {
         
        this.game.load.image(PiecSettings.options[i], PiecSettings.assetsDir + PiecSettings.options[i] + '.png');
        }

        this.game.load.image('dialogBg', PiecSettings.assetsDir + 'box_bg.png');

        this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');

        this.game.load.image('spark-particle', PiecSettings.assetsDir + 'spark-particle.png');
        this.game.load.image('star-particle', PiecSettings.assetsDir + 'star-particle.png');

        this.game.global.animations = {};

        PiecSettings.animation = PiecSettings.animation || {};

        var defaultAnimation = {
        frameRate: 60,
        scale: 1
        };

         for (var key in Atlas.default) {
            if (Atlas.default.hasOwnProperty(key)) {

                this.game.load.atlasJSONHash(
                    key,
                    PiecSettings.assetsDir + key + '.png',
                    null,
                    Atlas.default[key]);

                this.game.global.animations[key] = Util.extend(
                    defaultAnimation,
                    PiecSettings.animation[key] || {}
                );
            }
        }
         // this.game.load.spritesheet('some-sprite-sheet', PiecSettings.assetsDir + 'some-sprite-sheet.png', 138, 138);
         
     }

     onLoadComplete() {
         this.game.state.start('endcard');
     }
 }

 export default Preloader;