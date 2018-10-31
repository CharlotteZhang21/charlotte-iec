import * as Utils from '../utils/util';
import * as ContainerUtils from '../utils/container-util';
import * as FxRenderer from '../utils/fx-renderer.js';



class Chair extends Phaser.Group {
	constructor(game, chairName, containerName, hasTag = false) {
		super(game);

		this.containerName = containerName || 'chair';
		this.container = document.getElementById(this.containerName);
		this.chair = new Phaser.Sprite(game, 0,0, chairName);
		this.add(this.chair);
		
		this.stars = [];
		this.balloons = [];


		ContainerUtils.fitInContainer(this.chair, containerName, 0.5, 0.5);
		this.chair.alpha = 0;
		this.initialScale = this.chair.scale.x;
		this.initialYPos = this.chair.y;
		this.initialWidth = this.chair.width;
		this.initialHeight = this.chair.height;


		if(hasTag){
			var text = chairName.replace('_', " ");
			this.createTag(text);
		}

		this.constructionGrp = new Phaser.Group(game);
	}

	//tag under the option icons
	createTag(text){

		var containerName = this.containerName + '-text';
		var containerY = ContainerUtils.getContainerY(containerName);
		var containerHeight = ContainerUtils.getContainerHeight(containerName);
		this.fontSize = this.chair.height * 0.4;

		var style = {
			font: "bold " + this.fontSize + "px " + PiecSettings.fontFamily,
		};

		this.textField = new Phaser.Text(this.game, 0, 0, text, style);
		this.add(this.textField);
		this.textField.align = 'center';
		this.textField.padding.set(this.fontSize/2, 0);


		ContainerUtils.fitInContainerHeight(this.textField, containerName, 0.5, 0.5);
		

		if (PiecSettings.fontColor != null) {
			this.textField.fill = PiecSettings.fontColor;
			// this.textField.setShadow(2,3,'rgb(0,0,0)', 0);
		} else {
			this.textField.stroke = "#ff9d1b";
		}
	}

	hide(delay, duration){
		var initScale = this.chair.scale.x;
		var scaleTween = this.game.add.tween(this.chair.scale).to({x: [initScale * 1.05, 0], y: [initScale * 1.05, 0]}, duration, Phaser.Easing.Quadratic.In, true, delay);
		if(this.textField!==undefined)
			this.game.add.tween(this.textField.scale).to({x: [initScale * 1.05, 0], y: [initScale * 1.05, 0]}, duration, Phaser.Easing.Quadratic.In, true, delay);
	
		scaleTween.onComplete.add(function(){
			this.chair.alpha  = 0;
		},this);
	}

	showChair(){
		Utils.display(this.game, this.chair, 100);
	}
	

	popUp(delay, duration, shaking = false, i=0){
		// Utils.display(this.game, this.chair, 100);

		// var scaleFinal = this.chair.scale.x;

		this.chair.scale.x = 0;
		this.chair.scale.y = 0;

		this.showChair();

		var scaleTween = this.game.add.tween(this.chair.scale).to({x: [this.initialScale * 1.2, this.initialScale], y: [this.initialScale * 1.2, this.initialScale]}, duration, Phaser.Easing.Quadratic.In, true, delay * 2);
		
		if(shaking)
			scaleTween.onComplete.add(function(){
				this.shaking(i);
			}, this);
		else {
	       // scaleTween.onComplete.add(function(){
	       this.game.time.events.add(200,function(){
	       		this.spawnStars();
	       },this); 
		}


	}

	//constructions preAni
	preAni(delay, duration){

		var construction = new Phaser.Sprite(this.game, 0, 0, 'construction');
		this.constructionGrp.add(construction);
		ContainerUtils.fitInContainer(construction, this.containerName, 0.5, 0.5);

		var originalScale = construction.scale.x;
		var targetY = construction.y;

		construction.y -= 100;

		construction.alpha = 0;



		this.game.add.tween(construction).to({
			alpha: 1, 
			y: targetY
		}, 500, Phaser.Easing.Quadratic.InOut, true, delay);
		this.game.add.tween(construction.scale).to({
			x: [originalScale * 0.95, originalScale * 0.95, originalScale * 1.05, originalScale],
			y: [originalScale * 1.05, originalScale * 1.05, originalScale * 0.95, originalScale],
		}, 800, Phaser.Easing.Quadratic.InOut, true, delay)
		.onComplete.add(function(){

			var workersArray = [];
			var smokeArray = [];

			//generate workers
			for (var i = 1; i <= PiecSettings.workerNum; i++){
				var name = "worker-" + i;
				var worker = FxRenderer.playFx(this.game, this.constructionGrp, name);
				workersArray.push(worker);
				var smokeName = 'smoke-' + i;
				var smoke = FxRenderer.playFx(this.game, this.constructionGrp, smokeName);
				smokeArray.push(smoke);
			}

			this.game.time.events.add(1000, function(){
			
				this.game.add.tween(this.constructionGrp).to({
					alpha: 0
				}, 500, Phaser.Easing.Linear.None, true, 0)
				.onComplete.add(function(){

					this.fallingDown(0, duration);
				}, this);

			}, this);
		}, this);


	}

	fallingDown(delay, duration){

		var targetY = this.chair.y;
		this.chair.y -= 100;
		console.log(this.chair.alpha);

		this.game.add.tween(this.chair).to({
			alpha: 1, 
			y: targetY
		}, duration, Phaser.Easing.Quadratic.InOut, true, delay);
		this.game.add.tween(this.chair.scale).to({
			x: [this.initialScale * 0.95, this.initialScale * 0.95, this.initialScale * 1.05, this.initialScale],
			y: [this.initialScale * 1.05, this.initialScale * 1.05, this.initialScale * 0.95, this.initialScale],
		}, duration + 300, Phaser.Easing.Quadratic.InOut, true, delay);

		this.game.time.events.add(200,function(){
	       		this.spawnBalloon();
	       },this); 
	}

	shaking(i) {
		var initialScale = this.initialScale;
		this.chair.scale.x = initialScale;
		this.chair.scale.y = initialScale;
		this.chair.idleScaleTween = this.game.add.tween(this.chair.scale).to({
			x: [initialScale * 0.95, initialScale * 1.05, initialScale],
			y: [initialScale * 1.05, initialScale * 0.95, initialScale],
		}, 450 + 10*i, Phaser.Easing.Quadratic.InOut, true, 0, -1);

		this.chair.idleScaleTween.repeatDelay(800 + 10 * i);
	}



	getPosition(){
		var location = {};
		location.x = this.chair.x;
		location.y = this.chair.y;
		return location;
	}

	getWidth() {
		return this.initialWidth;
	}

	getHeight() {
		return this.initialHeight;
	}

	setOption(i){
		this.chair.optionNum = i;

		this.chair.inputEnabled = true;
		this.chair.input.useHandCursor = true;
		this.chair.events.onInputDown.add(function(button) {
			
			this.chair.inputEnabled = false;
			this.game.global.selection = i;
			this.game.onChange.dispatch();
		}, this);
	}

	disableOption() {
		this.chair.inputEnabled = false;
	}

	getOption(){
		return this.chair.optionNum;
	}

	spawnStars() {
        for (var i = 0; i < 80; i++) {

            var scaleMultiplier = .5;

            var particleName = Math.random() > 0.7? "spark-particle" : "star-particle";
            if (particleName == "spark-particle") {
                scaleMultiplier = 0.3;
            }

            var star = new Phaser.Sprite(this.game, 0, 0, particleName);
            this.add(star);
            this.stars.push(star);
            star.anchor.set(0.5);

            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                star.scale.x = this.initialWidth / star.width * (Math.random() * .18) * scaleMultiplier;
                star.scale.y = star.scale.x;
            } else {
                star.scale.x = this.initialWidth / star.width * (Math.random() * .3) * scaleMultiplier;
                star.scale.y = star.scale.x;
            }

            star.x = this.chair.x + this.initialWidth / 2.5 * Math.random();
            star.y = this.chair.y + this.initialHeight * .45 / 2;
            star.angle = Math.random() * 45;


            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.2;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = initialX + this.initialWidth * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 2.5;
            }
            var finalY = initialY - Math.random() * this.initialHeight * finalYMultiplier;
            var finalScale = initialScale * Math.random();

            var delay = i * 5;
            var duration = Math.random() * 1000 + 2000;

            Utils.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
            // this.chair.bringToTop();
        }
    }

    spawnBalloon(){
    	var scaleMultiplier = 1 + Math.random();
    	for (var i = 0; i < 20; i++) {
    		var randomNum = Math.random();
    		
			var particleName = 'balloon-';    		
    		if(randomNum <= 0.25){
    			particleName += 'blue';
    		}else if (randomNum <= 0.5){
    			particleName += 'red';

    		}else if(randomNum <= 0.75){
    			particleName += 'green';
    		}else if(randomNum <=1){
    			particleName += 'yellow';
    		}

    		var balloon = new Phaser.Sprite(this.game, 0, 0, particleName);

    		this.add(balloon);
            this.balloons.push(balloon);
            balloon.anchor.set(0.5);
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                balloon.scale.x = this.initialWidth / balloon.width * (Math.random() * .3) * scaleMultiplier;
                balloon.scale.y = balloon.scale.x;
            } else {
                balloon.scale.x = this.initialWidth / balloon.width * (Math.random() * .3) * scaleMultiplier;
                balloon.scale.y = balloon.scale.x;
            }

            balloon.x = this.chair.x + this.initialWidth / 2.5 * (0.5-Math.random());
            balloon.y = this.chair.y + this.initialHeight * .45 / 2;
            // balloon.angle = Math.random() * 45;


            balloon.alpha = 0;

            var initialScale = balloon.scale.x;
            var initialY = balloon.y;
            var initialX = balloon.x;

            var finalXMultiplier = 0.3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.2;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = initialX + this.initialWidth * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 2.5;
            }
            var finalY = -500;
            var finalScale = initialScale;

            var delay = i * 100;
            var duration = Math.random() * 1000 + 3000;

            Utils.balloonFloatWithDelayCustom(this.game, balloon, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
    	}
    }

}

export default Chair;