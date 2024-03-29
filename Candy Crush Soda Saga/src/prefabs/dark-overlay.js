class DarkOverlay extends Phaser.Group {
	constructor(game) {
		super(game);

		this.graphics = game.add.graphics(0,0);

		if (PiecSettings.finalOverlay != null && PiecSettings.finalOverlay.color != null) {
			this.graphics.beginFill(PiecSettings.finalOverlay.color, 1);
		} else {
			this.graphics.beginFill(0x000000, 1);
		}
		this.graphics.drawRect(
			0, 
			0, 
			this.game.global.windowWidth * window.devicePixelRatio, 
			this.game.global.windowHeight * window.devicePixelRatio);

		this.add(this.graphics);

		if (PiecSettings.finalOverlay != null && PiecSettings.finalOverlay.alpha != null ){
			this.finalAlpha = PiecSettings.finalOverlay.alpha;	
		} else {
			this.finalAlpha = .4;
		}
		this.alpha = this.finalAlpha;
		this.alpha = 0;
	}

	show() {
		var tween = this.game.add.tween(this).to({alpha: this.finalAlpha}, 500, Phaser.Easing.Sinusoidal.In, true, 200);
	}

	hide() {
		if (this.alpha > 0)
			var tween = this.game.add.tween(this).to({alpha: 0}, 300, Phaser.Easing.Quadratic.In, true, 0);
	}
}

export default DarkOverlay;