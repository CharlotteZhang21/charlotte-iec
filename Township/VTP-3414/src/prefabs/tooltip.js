import * as Utils from '../utils/util';
import * as ContainerUtils from '../utils/container-util';

class Tooltip extends Phaser.Group {
	constructor(game) {
		super(game);

		this.hand = new Phaser.Sprite(this.game, 0, 0, "hand");
		ContainerUtils.fitInContainer(this.hand, "hand");
		this.add(this.hand);
		this.hand.anchor.set(0.5);
		this.hand.alpha = 0;
		// this.hand.x = ;
	}

	moveHandToItem(item) {
		Utils.display(this.game, this.hand, 1000);
		this.hand.y = item.getPosition().y + item.getHeight()/2.8;
		var moveTween = this.game.add.tween(this.hand).to({
			x: item.getPosition().x + item.getWidth() / 2,
		}, 1000, Phaser.Easing.Quadratic.InOut, true);

		var tween = this.game.add.tween(this.hand).to({
			angle: [-15, 0]
		}, 300, Phaser.Easing.Quadratic.InOut, true, 0, 500, -1);

		tween.yoyo(true, 100);


		moveTween.onComplete.add(function(){
					this.game.add.tween(this.hand).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 1000);
				},this);

	}

	moveHandToManyItems(items){

		Utils.display(this.game, this.hand, 800);

		var handMoveDuration = 800;
		var handTapDuration = 500;

		var angle = -45;
		this.hand.angle = angle;
		// tween.yoyo(true, handMoveDuration);

		for(var i = 0; i < items.length; i++) {
			var targetX = items[i].getPosition().x + items[i].getWidth()* 0.5,
			targetY = items[i].getPosition().y + items[i].getHeight() * 0.5;

			var moveTween = this.game.add.tween(this.hand).to({x: targetX, y: targetY}, handMoveDuration, Phaser.Easing.Quadratic.InOut, true, (handMoveDuration+ handTapDuration ) * i );
			this.hand.x = targetX;
			this.hand.y = targetY;

			
			moveTween.onComplete.add(function(){

				var tween = this.game.add.tween(this.hand).to({
					angle: [angle + 10, angle + 5, angle - 5, angle - 5, angle],
				}, handTapDuration, Phaser.Easing.Quadratic.InOut, true, 100);
				
			},this);
		}


		this.game.time.events.add((handMoveDuration+ handTapDuration) * items.length, function(){
			this.hide();
			// if(this.hand.alpha != 0)
			// 	this.game.add.tween(this.hand).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0);	
		}, this);

	}

	hide(){
		if(this.hand.alpha !=0)
			this.game.add.tween(this.hand).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 0);	
	}
}

export default Tooltip;