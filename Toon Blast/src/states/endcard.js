import CustomSprite from '../prefabs/custom-sprite';

import CustomText from '../prefabs/custom-text';

//======= audio 
import AudioContoller from '../prefabs/audio-controller';

//======= essential elements

import CtaButton from '../prefabs/cta-button';
import Background from '../prefabs/background';

//======= game mechanism
import HandGestureController from '../prefabs/hand-gesture-controller';

//======= utils
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import * as Tweener from '../utils/tweener';

//======= customised classes
import Blocks from '../prefabs/blocks';



class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {


        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;

        this.game.stage.disableVisibilityChange = true;

        this.game.global.deviceLanguage = Util.getDeviceLang();

        this.audioController = new AudioContoller(game);

        this.miniGame = null;

        //========== BACKGROUND

        this.background = new Background(this.game);

        this.game.add.existing(this.background);

        //========== END OF BACKGROUND

        //========== THREE CLOUDS
        this.clouds = [];
        var cloud;

        for (var i = 1; i <= 3; i++) {

            var cloud = new CustomSprite(this.game, {
                src: 'cloud-' + i,
                container: 'cloud-' + i,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }


            });

            this.game.add.existing(cloud);
            
            var posX = cloud.x,
                posY = cloud.y;


            cloud.x += Math.random() > 0.5? cloud.width : -cloud.width;

            this.game.add.tween(cloud).to({
                x: posX,
                y: posY
            }, 1000, Phaser.Easing.Quadratic.Out, true, 0);
            cloud.show();
            this.clouds.push(cloud);

        }
        //========== END OF THREE CLOUDS

        //========== THREE CHARACTERS

        this.bruno = new CustomSprite(this.game, {
            src: 'bruno',
            container: 'character-1',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

        this.game.add.existing(this.bruno);

        this.bruno.show();

        this.wally = new CustomSprite(this.game, {
            src: 'wally',
            container: 'character-2',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

        this.game.add.existing(this.wally);

        this.wally.show();

        this.cooper = new CustomSprite(this.game, {
            src: 'cooper',
            container: 'character-3',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

        this.game.add.existing(this.cooper);

        this.cooper.show();

        //========== END THREE CHARACTERS


        //========== THREE CHARACTERS
        this.blocks = new Blocks(this.game);
        this.game.add.existing(this.blocks);

        ContainerUtil.fitInContainer(this.blocks, 'random-block-area', 0, 0);
        //========== blocks

        //========== CTA

        this.cta = new CtaButton(this.game, {
            src: 'cta-bg',
            container: "cta-container",
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

        this.ctaText = new CustomText(this.game, PiecSettings.ctaButtonText);

        this.game.add.existing(this.cta);
        Tweener.fadeIn(this.ctaText, 0, 300, Phaser.Easing.Linear.None, true);

        this.cta.show();

        //========== END OF CTA


        //tutorial if not can delete
        this.hand = new CustomSprite(this.game, {
            src: 'hand',
            container: "hand",
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });


        this.hand.hide();

        Tweener.fadeIn(this.hand, 800, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(e) {
            Tweener.tap(this.hand, 10, 0, 800, Phaser.Easing.Quadratic.InOut).onComplete.add(function() {
                Tweener.fadeOut(this.hand, 1000, 300, Phaser.Easing.Linear.None, true);
            }, this);
        }, this);


        // this.tutorialText = new CustomText(this.game, PiecSettings.tutorialText);
        // Tweener.scaleIn(this.tutorialText, 800, 300, Phaser.Easing.Quadratic.InOut).onComplete.add(function(e){
        //     Tweener.scaleOut(this.tutorialText, 1000, 300, Phaser.Easing.Quadratic.InOut);
        // }, this);


        //logo example

        // this.logo = new CustmoSprite(this.game, {
        //     src: 'logo',
        //     container: 'logo',
        //     anchor: {
        //         x: 0.5,
        //         y: 0.5,
        //     }
        // });

        // this.logo.show();


        this.game.onComplete.add(function() {
            this.onComplete();
        }, this);


    }


    onComplete() {

        ///===== COMPLETE ANIMATIONS =====///

        ///===== END OF ANIMATIONS =====///




        this.game.time.events.add(3000, function() {
            console.log('onComplete');
            parent.postMessage('complete', '*');
        })

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