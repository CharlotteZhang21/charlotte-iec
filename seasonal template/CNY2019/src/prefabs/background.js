import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
class Background extends Phaser.Group {
	constructor(game) {
		super(game);

		this.createSky();
		// this.createGround();
	}

	createSky() {
		this.sky = new Phaser.Sprite(this.game, 0, 0, 'bg');
		this.add(this.sky);
		if(Util.isPortrait(this.game)){
			ContainerUtil.fitInContainerHeight(this.sky, 'sky', 0.5, 0.5);	
		}else{
			ContainerUtil.fitInContainer(this.sky, 'sky', 0.5, 0.5);

		}
	}

	createGround() {
		this.ground = new Phaser.Sprite(this.game, 0, 0, 'ground');
		this.add(this.ground);
		ContainerUtil.fitInContainerHeight(this.ground, 'ground', 0.5, 0.5);
	}

	show() {
		var tween = this.game.add.tween(this).to({alpha: this.finalAlpha}, 500, Phaser.Easing.Sinusoidal.In, true, 200);
	}

	hide() {
		if (this.alpha > 0)
			var tween = this.game.add.tween(this).to({alpha: 0}, 300, Phaser.Easing.Quadratic.In, true, 0);
	}
}

export default Background;