import * as ContainerUtil from '../utils/container-util';

class Logo extends Phaser.Group {
	constructor(game, logoLayer) {
		super(game);

		this.logo = new Phaser.Sprite(this.game, 0, 0, 'logo');
		this.logo.anchor.set(0.5, 0.5);
		this.add(this.logo);
		ContainerUtil.fitInContainerAnchorAtCenter(this.logo, "logo");
	}

	//Animates from "logo" container to "final-logo" container
	animate() {

		this.alpha = 1;

		if (this.game.global.windowHeight > this.game.global.windowWidth) {
			this.logo.scale.x = 0.01;
			this.logo.scale.y = 0.01;
			var scaleTween = this.game.add.tween(this.logo.scale).to({x: this.initialLogoScale, y: this.initialLogoScale}, 700, Phaser.Easing.Back.Out, true, 400);
		}
		this.logo.angle = 0;
	}
}

export default Logo;