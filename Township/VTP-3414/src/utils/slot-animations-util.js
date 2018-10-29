import * as ContainerUtil from '../utils/container-util';

export function onLoop(sprite, animation) {
	if (animation.loopCount != 0 && animation.loopCount === sprite.numberOfLoops){
		if (!sprite.persistent) {
			animation.loop = false;
			sprite.alpha = 0;
		}
	}
}

export function playAnimation (game, sprite, delay, speed) {
	game.time.events.add(delay, function() {
		sprite.alpha = 1;
		sprite.animations.play('animation', speed, !sprite.persistent);
	});
}

export function playAnimations(spritesheet, delays, loops, speed, persistent, containerName, game, layer) {

	var animations = [];

	
	var sprite = game.add.sprite( 0, 0, spritesheet);
	layer.add(sprite);
	
	sprite.animations.add('animation');
	
	sprite.persistent = persistent;
	playAnimation(game, sprite, delays, speed);
	ContainerUtil.fitInContainer(sprite, containerName, 0.5, 0.5);

	animations.push(sprite);
	if (loops != null) {
		sprite.numberOfLoops = loops;
		sprite.animations.currentAnim.onLoop.add(onLoop, this);
	}


	return animations;
}