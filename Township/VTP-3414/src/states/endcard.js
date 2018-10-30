import Logo from '../prefabs/logo';
import CtaButton from '../prefabs/cta-button';
import Character from '../prefabs/character';

import DialogBox from '../prefabs/dialog';
import Chair from '../prefabs/chair';
import Background from '../prefabs/background';
import * as FxRenderer from '../utils/fx-renderer';
import * as ContainerUtil from '../utils/container-util';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;

        this.background = new Background(this.game);
        this.game.add.existing(this.background);

        this.dialogBox = new DialogBox(this.game);
        this.game.add.existing(this.dialogBox);


       
        this.currentChair = new Chair(this.game, 'empty-space', "chair");
        this.game.add.existing(this.currentChair);
        this.currentChair.showChair();


        //this furniture in the house
        this.options = [];

        for(var i = 0; i < PiecSettings.options.length; i++){
            var option = new Chair(this.game, PiecSettings.options[i], "chair");
            this.game.add.existing(option);
            this.options.push(option);
            // option.alpha=0;
            // this.options[i].alpha = 0;
        }

        
        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);

        if(this.game.global.windowWidth < this.game.global.windowHeight) {
            //hide logo when it's portrait
            this.logo.alpha = 0;
        }


        this.fxEffectsLayer = this.game.add.group();

        this.character = new Character(this.game, this.fxEffectsLayer);
        this.game.add.existing(this.character);

        this.winMessage = this.game.add.sprite(0, 0, 'win-message');
        ContainerUtil.fitInContainer(this.winMessage, 'win-message', 0.5, 0.5);
        this.winMessage.initialScale = this.winMessage.scale.x;
        this.winMessage.scale.x = 0;

        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);


        this.game.onChange.add(this.onChange, this);

        this.game.onGameComplete.add(this.onChangeComplete, this);

        this.game.time.events.add(PiecSettings.timer, function(){

            document.getElementById('vungle-close').className = 'visible';
        }, this)


     }

     render() {
        // render code here
     }

     onChange() {
        document.getElementById('vungle-close').className = 'visible';

        for(var i = 0; i < this.options.length; i++ ) {
            this.options[i].disableOption();
        }

        var selectedItem = this.options[this.game.global.selection];
        
        var hideDelay = 0, hideDuration = 300;
        this.currentChair.hide(hideDelay, hideDuration);


        var popUpDelay = 500, popUpDuration = 500;
        selectedItem.preAni(popUpDelay, popUpDuration);
        selectedItem.alpha = 1;
        this.dialogBox.hideOptions(popUpDelay);

        this.game.time.events.add(2000, function(){
            this.game.add.tween(this.winMessage.scale).to({
                x: [this.winMessage.initialScale * 1.05, this.winMessage.initialScale]
            }, 500, Phaser.Easing.Quadratic.InOut, true, 1000);        
            this.character.changeToHappy();
        }, this);

        this.game.time.events.add(1000, function(){
            this.game.add.tween(this.dialogBox).to({y: -100, alpha: 0}, 500, Phaser.Easing.Back.In, true, 800); 
        }, this);
        
        this.game.time.events.add(2000, function(){
            this.game.onGameComplete.dispatch();
        }, this);
       
     }



     onChangeComplete() {

            this.game.time.events.add(1000, function() {
                this.logo.alpha = 1;
                this.logo.animate();
                this.cta.animate();

                if(PiecSettings.ASOI){
                    setTimeout(function(){
                        doSomething('download');
                    }, 2000);
                }

            }, this);
        // }

     }

     onLoop() {
        console.log("looping");
     }
 }

 export default Endcard;
