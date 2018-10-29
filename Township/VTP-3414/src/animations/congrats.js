import * as AnimationsUtil from '../utils/slot-animations-util.js';

var aniInfo = PiecSettings.animation['happy'];

export function preload(game) {
	game.load.spritesheet('congrats', PiecSettings.assetsDir + 'congrats.png', aniInfo.width, aniInfo.height, aniInfo.totalNum);
}

export function play(game, layer) {

	var containerName = 'character';
	var delay = aniInfo.delay || 0;
	var loop = aniInfo.loop || null;
	var speed = aniInfo.speed || 10;
	var persistent = aniInfo.persistent || false;

	var animations = AnimationsUtil.playAnimations("congrats", delay, loop, speed, persistent, containerName, game, layer);

	return animations;
}