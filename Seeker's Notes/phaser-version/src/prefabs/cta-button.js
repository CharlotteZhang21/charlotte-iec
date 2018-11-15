import * as ContainerUtil from '../utils/container-util';
import * as Localisation from '../utils/auto-localisation-util';

class CtaButton extends Phaser.Group {
	constructor(game) {
		super(game);

		this.button = new Phaser.Sprite(game, 0, 0, 'cta', 0);
		this.add(this.button);
		ContainerUtil.fitInContainer(this.button, 'cta-container', 0.5, 0.5);
		this.createText();
		this.initialCtaWidth = this.button.width;
		this.button.inputEnabled = true;
		this.button.input.useHandCursor = true;
		this.button.events.onInputDown.add(function() {
			doSomething('download');
		});
	}

	createText(){
		var containerName = 'cta-container-text';
		var containerY = ContainerUtil.getContainerY(containerName);
		var containerHeight = ContainerUtil.getContainerHeight(containerName);
		this.fontSize = this.button.height * 0.4;

		var style = {
			font: "bold " + this.fontSize + "px " + PiecSettings.fontFamily,
		};

		this.textField = new Phaser.Text(this.game, 0, 0, Localisation.getLocalisedCta().text, style);
		this.add(this.textField);
		this.textField.align = 'center';
		// this.textField.padding.set(this.fontSize/2, 0);


		ContainerUtil.bestFit(this.textField, containerName, 0.5, 0.5);
		
		this.textField.fill = '#fff';
		this.textField.stroke = '#002753';
		this.textField.strokeThickness = 2;


	}

	animate() {
		// var finalContainer = document.getElementById("cta-container-final");
		// var containerName = "cta-container-final";
		// var finalContainerWidth = ContainerUtils.getContainerWidth(containerName);
		// var finalContainerHeight = ContainerUtils.getContainerHeight(containerName);

		// var finalContainerX = ContainerUtils.getContainerX(containerName);
		// var finalContainerY = ContainerUtils.getContainerX(containerName);
		// var newScale = finalContainerWidth/this.initialCtaWidth;
		// console.log(finalContainerWidth);
		// console.log(this.initialCtaWidth);
		// console.log(finalContainerX);
		// console.log(finalContainerY);

		// var positionTween = this.game.add.tween(this.button).to({x: finalContainerX, y: finalContainerY}, 1400, Phaser.Easing.Back.InOut, true, 0);
		// var scaleTween = this.game.add.tween(this.button.scale).to({x: newScale, y: newScale}, 1000, Phaser.Easing.InOut, true, 0, -1, true);

		// }else {
		// 	var scaleTween = this.game.add.tween(this.scale).to({x: newScale, y: newScale}, 1000, Phaser.Easing.InOut, true, 0, -1, true);
		// }

		
        // var finalContainer = "cta-container-final";
        // var finalContainerText = "cta-container-text-final";
        // var delay = 0,
        //     duration = 900;
        // ContainerUtil.moveToContainer(this.button, finalContainer, delay, duration, Phaser.Easing.Quadratic.InOut, null, true);
        // ContainerUtil.moveToContainer(this.textField, finalContainerText, delay, duration, Phaser.Easing.Quadratic.InOut, null, true);
     		

        var initialScale = this.button.scale.x;
        var initialTextScale = this.textField.scale.x;

     	// this.game.add.tween(this.buttonOver.scale).to({ x: initialScale * 1.05, y: initialScale * 1.05 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);
        this.game.add.tween(this.button.scale).to({ 
        	x: initialScale * 1.05, 
        	y: initialScale * 1.05 
        }, 600, Phaser.Easing.Quadratic.InOut, true, 1000).loop().yoyo(true, 0);
        this.game.add.tween(this.textField.scale).to({
            x: initialTextScale * 1.05,
            y: initialTextScale * 1.05
        }, 600, Phaser.Easing.Quadratic.InOut, true, 1000).loop().yoyo(true, 0);
	}
}

export default CtaButton;