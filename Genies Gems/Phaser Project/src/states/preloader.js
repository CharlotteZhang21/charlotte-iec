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

         this.game.load.image('1', PiecSettings.assetsDir + 'red.png');
         this.game.load.image('2', PiecSettings.assetsDir + 'blue.png');
         this.game.load.image('3', PiecSettings.assetsDir + 'yellow.png');
         this.game.load.image('4', PiecSettings.assetsDir + 'green.png');
         this.game.load.image('5', PiecSettings.assetsDir + 'orange.png');
         this.game.load.image('6', PiecSettings.assetsDir + 'purple.png');

         // this.game.load.image('1_blur', PiecSettings.assetsDir + 'red_blur.png');
         // this.game.load.image('2_blur', PiecSettings.assetsDir + 'blue_blur.png');
         // this.game.load.image('3_blur', PiecSettings.assetsDir + 'yellow_blur.png');
         // this.game.load.image('4_blur', PiecSettings.assetsDir + 'green_blur.png');
         // this.game.load.image('5_blur', PiecSettings.assetsDir + 'orange_blur.png');
         // this.game.load.image('6_blur', PiecSettings.assetsDir + 'purple_blur.png');

         this.game.load.image('1_hor', PiecSettings.assetsDir + 'red_hor.png');
         this.game.load.image('2_hor', PiecSettings.assetsDir + 'blue_hor.png');
         this.game.load.image('3_hor', PiecSettings.assetsDir + 'yellow_hor.png');
         this.game.load.image('4_hor', PiecSettings.assetsDir + 'green_hor.png');
         this.game.load.image('5_hor', PiecSettings.assetsDir + 'orange_hor.png');
         this.game.load.image('6_hor', PiecSettings.assetsDir + 'purple_hor.png');

         this.game.load.image('1_ver', PiecSettings.assetsDir + 'red_ver.png');
         this.game.load.image('2_ver', PiecSettings.assetsDir + 'blue_ver.png');
         this.game.load.image('3_ver', PiecSettings.assetsDir + 'yellow_ver.png');
         this.game.load.image('4_ver', PiecSettings.assetsDir + 'green_ver.png');
         this.game.load.image('5_ver', PiecSettings.assetsDir + 'orange_ver.png');
         this.game.load.image('6_ver', PiecSettings.assetsDir + 'purple_ver.png');

         this.game.load.image('1_wrap', PiecSettings.assetsDir + 'red_wrap.png');
         this.game.load.image('2_wrap', PiecSettings.assetsDir + 'blue_wrap.png');
         this.game.load.image('3_wrap', PiecSettings.assetsDir + 'yellow_wrap.png');
         this.game.load.image('4_wrap', PiecSettings.assetsDir + 'green_wrap.png');
         this.game.load.image('5_wrap', PiecSettings.assetsDir + 'orange_wrap.png');
         this.game.load.image('6_wrap', PiecSettings.assetsDir + 'purple_wrap.png');

         this.game.load.image('1_paw', PiecSettings.assetsDir + 'red_paw.png');
         this.game.load.image('2_paw', PiecSettings.assetsDir + 'blue_paw.png');
         this.game.load.image('3_paw', PiecSettings.assetsDir + 'yellow_paw.png');
         this.game.load.image('4_paw', PiecSettings.assetsDir + 'green_paw.png');
         this.game.load.image('5_paw', PiecSettings.assetsDir + 'orange_paw.png');
         this.game.load.image('6_paw', PiecSettings.assetsDir + 'purple_paw.png');

         this.game.load.image('magic_cloud', PiecSettings.assetsDir + 'magic_cloud.png');

         this.game.load.image('1_stripes', PiecSettings.assetsDir + 'zoom_red.png');
         this.game.load.image('2_stripes', PiecSettings.assetsDir + 'zoom_blue.png');
         this.game.load.image('3_stripes', PiecSettings.assetsDir + 'zoom_yellow.png');
         this.game.load.image('4_stripes', PiecSettings.assetsDir + 'zoom_green.png');
         this.game.load.image('5_stripes', PiecSettings.assetsDir + 'zoom_orange.png');
         this.game.load.image('6_stripes', PiecSettings.assetsDir + 'zoom_purple.png');

         this.game.load.image('1_particle', PiecSettings.assetsDir + 'red_particle.png');
         this.game.load.image('2_particle', PiecSettings.assetsDir + 'blue_particle.png');
         this.game.load.image('3_particle', PiecSettings.assetsDir + 'yellow_particle.png');
         this.game.load.image('4_particle', PiecSettings.assetsDir + 'green_particle.png');
         this.game.load.image('5_particle', PiecSettings.assetsDir + 'orange_particle.png');
         this.game.load.image('6_particle', PiecSettings.assetsDir + 'purple_particle.png');

         this.game.load.image('colorbomb', PiecSettings.assetsDir + 'colorbomb.png');
         this.game.load.image('colorbomb_particle', PiecSettings.assetsDir + 'colorbomb_particle.png');
         this.game.load.image('colorbomb_particle_2', PiecSettings.assetsDir + 'colorbomb_particle_2.png');
         this.game.load.image('colorbomb_ray', PiecSettings.assetsDir + 'colorbomb_ray.png');

         this.game.load.image('circle', PiecSettings.assetsDir + 'burst.png');

         this.game.load.image('board-bg-1', PiecSettings.assetsDir + 'board-bg-1.png');
         this.game.load.image('board-bg-2', PiecSettings.assetsDir + 'board-bg-2.png');

         this.game.load.image('way_turn', PiecSettings.assetsDir + 'way_turn.png');
         this.game.load.image('way_straight', PiecSettings.assetsDir + 'way_straight.png');
         this.game.load.image('way_end', PiecSettings.assetsDir + 'way_end.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');

         this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');

         this.game.load.image('chest', PiecSettings.assetsDir + 'chest.png');
         this.game.load.image('chest-open', PiecSettings.assetsDir + 'chest-open.png');

         this.game.load.image('star', PiecSettings.assetsDir + 'star.png');


         this.game.load.image('btn-yellow', PiecSettings.assetsDir + 'btn_green.png');

         this.game.load.image('characters', PiecSettings.assetsDir + 'characters.png');

         this.game.load.image('omgenie', PiecSettings.assetsDir + 'omgenie.png');

         this.game.load.image('genieous', PiecSettings.assetsDir + 'genieous.png');

         this.game.load.image('gemazing', PiecSettings.assetsDir + 'gemazing.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');

         this.game.load.image('prompt', PiecSettings.assetsDir + 'prompt.png');
     }



     update() {
         if (this.ready)
             this.game.state.start('endcard');
     }

     loadResources() {
         CustomPngSequencesRenderer.preloadPngSequences(this.game);

         //TODO - set preloadAsset to true somewhere 
         // this.preloadAsset = true;

         if (!this.preloadAsset)
             this.onLoadComplete();
     }


     onLoadComplete() {
         this.ready = true;
     }
 }

 export default Preloader;