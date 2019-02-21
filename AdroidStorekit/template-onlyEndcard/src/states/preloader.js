 import * as Atlas from '../atlas/index';
 import * as Util from '../utils/util';
 import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Preloader extends Phaser.State {

     constructor() {
         super();
         this.preloadAsset = false; // This is false if there are no assets to load.
         this.ready = false;
     }

     preload() {
         //Setup loading and its events
         this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
         this.loadResources();
     }

     update() {
        if (this.ready)
            this.game.state.start('endcard');
     }

     loadResources() {
         this.loadInteractionImages();
         this.loadCollectiblesImages();
         this.loadHudElements();
         this.loadMiniGamesImages();
         CustomPngSequencesRenderer.preloadPngSequences(this.game);

         if (!this.preloadAsset)
            this.onLoadComplete();
     }

     loadInteractionImages() {
         for (var key in PiecSettings.script) {
             if (PiecSettings.script.hasOwnProperty(key)) {
                 var script = PiecSettings.script[key];

                 if (script.interactions !== undefined) {
                     for (var i = 0; i < script.interactions.length; i++) {
                         if (script.interactions[i].src !== undefined && script.interactions[i].src != '') {
                             this.game.load.image(script.interactions[i].src, PiecSettings.assetsDir + script.interactions[i].src);
                             this.preloadAsset = true;
                         }
                     }
                 }

                 if (script.autoplay !== undefined && script.autoplay.timer !== undefined && script.autoplay.timer) {
                     this.game.load.image('timer', PiecSettings.assetsDir + 'timer.png');
                     this.game.load.image('timer-fill', PiecSettings.assetsDir + 'timer_fill.png');
                     this.preloadAsset = true;
                 }

             }
         }
     }

     loadCollectiblesImages() {

         var index = 0;

         if (PiecSettings.collectibles !== undefined) {
             for (var key in PiecSettings.collectibles) {
                 if (PiecSettings.collectibles.hasOwnProperty(key)) {
                     index++;
                     var collectible = PiecSettings.collectibles[key];

                     this.game.load.image(collectible.src, PiecSettings.assetsDir + collectible.src);

                     this.loadCounterImages(collectible.counter);
                 }
             }
         }
         if (index > 0) {
             this.game.load.image('cloud', PiecSettings.assetsDir + 'cloud.png');
             this.preloadAsset = true;
         }
     }

     loadHudElements() {
         if (PiecSettings.hudElements !== undefined) {
             for (var key in PiecSettings.hudElements) {
                 if (PiecSettings.hudElements.hasOwnProperty(key)) {
                     var hudElement = PiecSettings.hudElements[key];

                     if (hudElement.src !== undefined && hudElement.src != '') {
                        var deviceType = '';
                        if (hudElement.OSsensitive !== undefined && hudElement.OSsensitive == true) {
                            deviceType = Util.getDeviceOS() + "-";
                        }
                         this.game.load.image(deviceType+hudElement.src, PiecSettings.assetsDir + deviceType+hudElement.src);
                         this.preloadAsset = true;
                     }
                 }
             }
         }
     }

     loadMiniGamesImages() {
         if (PiecSettings.minigames !== undefined) {
             for (var key in PiecSettings.minigames) {
                 if (PiecSettings.minigames.hasOwnProperty(key)) {
                     var minigame = PiecSettings.minigames[key];

                     if (minigame.src !== undefined && minigame.src != '' && minigame.src.indexOf(".png") != -1) {
                         this.game.load.image(minigame.src, PiecSettings.assetsDir + minigame.src);
                         this.preloadAsset = true;
                     }

                     if (minigame.objects !== undefined && minigame.objects.length > 0) {

                        for (var i = 0; i < minigame.objects.length; i++) {

                            var object = minigame.objects[i];
                            if (object.src.indexOf('.png') != -1) {
                                this.game.load.image(object.src, PiecSettings.assetsDir + object.src);
                                this.preloadAsset = true;
                            }
                            if (object.shadowSrc !== undefined && object.shadowSrc != '') {
                                this.game.load.image(object.shadowSrc, PiecSettings.assetsDir + object.shadowSrc);
                                this.preloadAsset = true;
                            }
                            
                        }
                     }

                     if (minigame.particles !== undefined && minigame.particles.src !== undefined) {
                         for (var i = 0; i < minigame.particles.src.length; i++) {
                             if (minigame.particles.src[i].indexOf(".png") != -1) {
                                 this.game.load.image(minigame.particles.src[i], PiecSettings.assetsDir + minigame.particles.src[i]);
                                 this.preloadAsset = true;
                             }
                         }
                     }
                     if (minigame.followFinger !== undefined && minigame.followFinger.src !== undefined && minigame.followFinger.src.indexOf(".png") != -1) {
                         this.game.load.image(minigame.followFinger.src, PiecSettings.assetsDir + minigame.followFinger.src);
                         this.preloadAsset = true;
                     }
                     this.loadCounterImages(minigame.counter);
                 }
             }
         }
     }

     loadCounterImages(counter) {
         if (counter !== undefined) {
             if (counter.iconSrc !== undefined && counter.iconSrc != '') {
                 this.game.load.image(counter.iconSrc, PiecSettings.assetsDir + counter.iconSrc);
                 this.preloadAsset = true;
             }
             if (counter.backgroundSrc !== undefined && counter.backgroundSrc != '') {
                 this.game.load.image(counter.backgroundSrc, PiecSettings.assetsDir + counter.backgroundSrc);
                 this.preloadAsset = true;
             }
             if (counter.fillSrc !== undefined && counter.fillSrc != '') {
                 this.game.load.image(counter.backgroundSrc + "-fill", PiecSettings.assetsDir + counter.fillSrc);
                 this.preloadAsset = true;
             }
         }
     }

     onLoadComplete() {
         this.ready = true;
     }
 }

 export default Preloader;