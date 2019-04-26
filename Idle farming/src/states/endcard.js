// import Logo from '../prefabs/logo';
// import DarkOverlay from '../prefabs/dark-overlay';

import CustmoSprite from '../prefabs/custom-sprite';

//======= audio 
import AudioContoller from '../prefabs/audio-controller';

//======= elements

import Field from '../prefabs/field';
import CtaButton from '../prefabs/cta-button';
import Background from '../prefabs/background';

//======= game mechanism
import HandGestureController from '../prefabs/hand-gesture-controller';
import PowerUpGame from '../prefabs/powerup-game';

//======= utils
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';

import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {


        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;



        this.audioController = new AudioContoller();
        

        //========== BACKGROUND

        this.background = new Background(this.game);
        
        this.game.add.existing(this.background);

        //========== END OF BACKGROUND

        this.gameField = new Field(this.game);
        
        this.game.add.existing(this.gameField);
        
        //========== CTA
        
        this.cta = new CtaButton(this.game, {
            src: 'cta',
            container: "cta-container",
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
        
        this.game.add.existing(this.cta);

        this.cta.show();


        //init hand gesture controller

        this.handGestureController = new HandGestureController(this.game);
        this.miniGame = new PowerUpGame(this.game, this.handGestureController, this.audioController, PiecSettings.miniGameArgs, this.gameField);

        this.miniGame.init();



     }

     resize() {        
         // resize code here
         // location.reload();
     }

     render() {
        // render code here
     }

     



 }

 export default Endcard;
