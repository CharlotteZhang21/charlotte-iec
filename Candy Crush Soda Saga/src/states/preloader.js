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
         this.game.load.image('7', PiecSettings.assetsDir + 'cyan.png');

         this.game.load.image('1_blur', PiecSettings.assetsDir + 'red_blur.png');
         this.game.load.image('2_blur', PiecSettings.assetsDir + 'blue_blur.png');
         this.game.load.image('3_blur', PiecSettings.assetsDir + 'yellow_blur.png');
         this.game.load.image('4_blur', PiecSettings.assetsDir + 'green_blur.png');
         this.game.load.image('5_blur', PiecSettings.assetsDir + 'orange_blur.png');
         this.game.load.image('6_blur', PiecSettings.assetsDir + 'purple_blur.png');
         this.game.load.image('7_blur', PiecSettings.assetsDir + 'cyan_blur.png');

         this.game.load.image('1_hor', PiecSettings.assetsDir + 'red_hor.png');
         this.game.load.image('2_hor', PiecSettings.assetsDir + 'blue_hor.png');
         this.game.load.image('3_hor', PiecSettings.assetsDir + 'yellow_hor.png');
         this.game.load.image('4_hor', PiecSettings.assetsDir + 'green_hor.png');
         this.game.load.image('5_hor', PiecSettings.assetsDir + 'orange_hor.png');
         this.game.load.image('6_hor', PiecSettings.assetsDir + 'purple_hor.png');
         this.game.load.image('7_hor', PiecSettings.assetsDir + 'cyan_hor.png');

         this.game.load.image('1_ver', PiecSettings.assetsDir + 'red_ver.png');
         this.game.load.image('2_ver', PiecSettings.assetsDir + 'blue_ver.png');
         this.game.load.image('3_ver', PiecSettings.assetsDir + 'yellow_ver.png');
         this.game.load.image('4_ver', PiecSettings.assetsDir + 'green_ver.png');
         this.game.load.image('5_ver', PiecSettings.assetsDir + 'orange_ver.png');
         this.game.load.image('6_ver', PiecSettings.assetsDir + 'purple_ver.png');
         this.game.load.image('7_ver', PiecSettings.assetsDir + 'cyan_ver.png');

         this.game.load.image('1_wrap', PiecSettings.assetsDir + 'red_wrap.png');
         this.game.load.image('2_wrap', PiecSettings.assetsDir + 'blue_wrap.png');
         this.game.load.image('3_wrap', PiecSettings.assetsDir + 'yellow_wrap.png');
         this.game.load.image('4_wrap', PiecSettings.assetsDir + 'green_wrap.png');
         this.game.load.image('5_wrap', PiecSettings.assetsDir + 'orange_wrap.png');
         this.game.load.image('6_wrap', PiecSettings.assetsDir + 'purple_wrap.png');
         this.game.load.image('7_wrap', PiecSettings.assetsDir + 'cyan_wrap.png');

         this.game.load.image('1_fish', PiecSettings.assetsDir + 'red_fish.png');
         this.game.load.image('2_fish', PiecSettings.assetsDir + 'blue_fish.png');
         this.game.load.image('3_fish', PiecSettings.assetsDir + 'yellow_fish.png');
         this.game.load.image('4_fish', PiecSettings.assetsDir + 'green_fish.png');
         this.game.load.image('5_fish', PiecSettings.assetsDir + 'orange_fish.png');
         this.game.load.image('6_fish', PiecSettings.assetsDir + 'purple_fish.png');
         this.game.load.image('7_fish', PiecSettings.assetsDir + 'cyan_fish.png');

         this.game.load.image('1_sfish', PiecSettings.assetsDir + 'red_sfish.png');
         this.game.load.image('2_sfish', PiecSettings.assetsDir + 'blue_sfish.png');
         this.game.load.image('3_sfish', PiecSettings.assetsDir + 'yellow_sfish.png');
         this.game.load.image('4_sfish', PiecSettings.assetsDir + 'green_sfish.png');
         this.game.load.image('5_sfish', PiecSettings.assetsDir + 'orange_sfish.png');
         this.game.load.image('6_sfish', PiecSettings.assetsDir + 'purple_sfish.png');
         this.game.load.image('7_sfish', PiecSettings.assetsDir + 'cyan_sfish.png');

         this.game.load.image('1_wfish', PiecSettings.assetsDir + 'red_wfish.png');
         this.game.load.image('2_wfish', PiecSettings.assetsDir + 'blue_wfish.png');
         this.game.load.image('3_wfish', PiecSettings.assetsDir + 'yellow_wfish.png');
         this.game.load.image('4_wfish', PiecSettings.assetsDir + 'green_wfish.png');
         this.game.load.image('5_wfish', PiecSettings.assetsDir + 'orange_wfish.png');
         this.game.load.image('6_wfish', PiecSettings.assetsDir + 'purple_wfish.png');
         this.game.load.image('7_wfish', PiecSettings.assetsDir + 'cyan_wfish.png');

         this.game.load.image('1_stripes', PiecSettings.assetsDir + 'zoom_red.png');
         this.game.load.image('2_stripes', PiecSettings.assetsDir + 'zoom_blue.png');
         this.game.load.image('3_stripes', PiecSettings.assetsDir + 'zoom_yellow.png');
         this.game.load.image('4_stripes', PiecSettings.assetsDir + 'zoom_green.png');
         this.game.load.image('5_stripes', PiecSettings.assetsDir + 'zoom_orange.png');
         this.game.load.image('6_stripes', PiecSettings.assetsDir + 'zoom_purple.png');
         this.game.load.image('7_stripes', PiecSettings.assetsDir + 'zoom_cyan.png');

         this.game.load.image('1_particle', PiecSettings.assetsDir + 'red_particle.png');
         this.game.load.image('2_particle', PiecSettings.assetsDir + 'blue_particle.png');
         this.game.load.image('3_particle', PiecSettings.assetsDir + 'yellow_particle.png');
         this.game.load.image('4_particle', PiecSettings.assetsDir + 'green_particle.png');
         this.game.load.image('5_particle', PiecSettings.assetsDir + 'orange_particle.png');
         this.game.load.image('6_particle', PiecSettings.assetsDir + 'purple_particle.png');
         this.game.load.image('7_particle', PiecSettings.assetsDir + 'cyan_particle.png');

         this.game.load.image('colorbomb', PiecSettings.assetsDir + 'colorbomb.png');
         this.game.load.image('colorbomb_particle', PiecSettings.assetsDir + 'colorbomb_particle.png');
         this.game.load.image('colorbomb_particle_2', PiecSettings.assetsDir + 'colorbomb_particle_2.png');
         this.game.load.image('colorbomb_ray', PiecSettings.assetsDir + 'colorbomb_ray.png');

         this.game.load.image('circle', PiecSettings.assetsDir + 'burst.png');

         this.game.load.image('board-bg', PiecSettings.assetsDir + 'board-bg.png');

         this.game.load.image('hand', PiecSettings.assetsDir + 'hand.png');

         this.game.load.image('logo', PiecSettings.assetsDir + 'logo.png');


         this.game.load.image('btn-yellow', PiecSettings.assetsDir + 'btn_yellow.png');

         this.game.load.image('tiffi', PiecSettings.assetsDir + 'kimmy.png');
         this.game.load.image('yeti', PiecSettings.assetsDir + 'yeti.png');

         this.game.load.image('juicy', PiecSettings.assetsDir + 'juicy.png');

         // this.game.load.image('sweet', PiecSettings.assetsDir + 'sweet.png');

         this.game.load.image('tasty', PiecSettings.assetsDir + 'tasty.png');

         this.game.load.image('divine', PiecSettings.assetsDir + 'divine.png');

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