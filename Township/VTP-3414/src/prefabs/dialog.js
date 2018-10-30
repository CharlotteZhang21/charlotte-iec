import * as FxRenderer from '../utils/fx-renderer.js';
import * as Utils from '../utils/util';
import * as ContainerUtils from '../utils/container-util';
import Chair from '../prefabs/chair';
import Tooltip from '../prefabs/tooltip';

class Dialog extends Phaser.Group {
	constructor(game) {
		super(game);

		this.container = "dialog";
		this.textContainer = 'dialog-text';

		this.createDialogBg();


		

	}

	init(){
		this.initialWidth = this.dialogBg.width;
		this.initialHeight = this.dialogBg.height;
		this.centerX = this.dialogBg.x + this.dialogBg.width /2;
		this.centerY = this.dialogBg.y + this.dialogBg.height /2;
	
	}

	createDialogBg(){

		this.dialogBg = this.game.add.sprite(0, 0, 'dialogBg');
		this.add(this.dialogBg);
		Utils.display(this.game, this.dialogBg, 100);
		
		ContainerUtils.fitInContainer(this.dialogBg, this.container);
		if(!Utils.isPortrait()){
			this.dialogBg.scale.y *= 0.8;
		}

		this.init();
		this.createText(PiecSettings.characterText[0]);
		Utils.display(this.game, this.textField, 100);

		this.game.time.events.add(2000, function(){
			this.changeTextTo(PiecSettings.characterText[1], 2000);
		},this)
	}

	createText(text) {
		var containerHeight = ContainerUtils.getContainerHeight(this.container);
		this.fontSize = this.initialHeight * .25;

		var style = {
			font: "bold " + this.fontSize + "px " + PiecSettings.fontFamily,
		};

		this.textField = new Phaser.Text(this.game, 0, 0, text, style);
		this.add(this.textField);
		this.textField.align = 'center';
		
		ContainerUtils.bestFit(this.textField, this.textContainer, 0.5, 0.5);

		if(!Utils.isPortrait()){

			this.textField.x = this.centerX;
			this.textField.y = this.centerY;

			this.textField.scale.x *= 1.2;
			this.textField.scale.y = this.textField.scale.x;
		}

		if (PiecSettings.fontColor != null) {
			this.textField.fill = PiecSettings.fontColor;
			// this.textField.stroke = "#1e5183";
			// this.textField.strokeThickness = 2;
			// this.textField.setShadow(1,0,'#1e5183', 0);
		} else {
			this.textField.stroke = "#ff9d1b";
		}
	}

	changeTextTo(value, duration, showOptions = true) {
		this.textField.text = "" + value;
		var textTween = this.game.add.tween(this.textField.scale).to( {x: [0, 1.2, 1], y: [0, 1.2, 1]}, duration * 1/5, Phaser.Easing.Linear.None, true, 0);

		if(showOptions)
			textTween.onComplete.add(function(){
				var textTween2 = this.game.add.tween(this.textField.scale).to( {x: [1.2, 0], y: [1.2, 0]}, duration * 1/5, Phaser.Easing.Linear.None, true, 1000);
				textTween2.onComplete.add(function(){
					this.createOptions();
				},this);
				
			}, this);	
	}


	createOptions() {
		this.options = [];
		var delay = 200;
		var duration = 500;
		var totalDelay = 0;

        for(var i = 0; i < PiecSettings.options.length; i++){
        	var divName = "option" + (i+1);
            var option = new Chair(this.game, PiecSettings.options[i], divName, PiecSettings.optionsText);



			option.setOption(i);

            this.add(option);
            this.options.push(option);
          
            option.popUp(delay * i, duration, true, i);

			// option.shaking(i);
            totalDelay += delay * i;

        }

        this.createTooltip();


	}

	hideOptions(customDelay) {
		if(this.tooltip !== undefined){
			this.tooltip.hide();
		}
		var delay = 300;
		var duration = 300;
		var totalDelay = 0;
		for(var i = 0; i < this.options.length; i++){
        	
            this.options[i].hide(customDelay + delay * i, duration);
            totalDelay += delay * i;
        }

        this.game.time.events.add(customDelay +  totalDelay, function(){
        	this.changeTextTo("Thank you!", 2000, false);
        },this);

	}

	createTooltip() {
		this.tooltip = new Tooltip(this.game);
        this.add(this.tooltip);
        // this.tooltip.x = this.options[1].x;
        // this.tooltip.y = this.options[1].y;
        // this.tooltip.moveHandToItem(this.options[1]);
        this.tooltip.moveHandToManyItems(this.options);
	}


}

export default Dialog;