import * as AnimationsUtil from '../utils/slot-animations-util.js';

var aniInfo = PiecSettings.animation['sad'];

export function preload(game) {
	game.load.spritesheet('sad', PiecSettings.assetsDir + 'sad.png', aniInfo.width, aniInfo.height, aniInfo.totalNum);
}

export function play(game, layer) {

	var containerName = 'character';
	var delay = aniInfo.delay || 0;
	var loop = aniInfo.loop || null;
	var speed = aniInfo.speed || 10;
	var persistent = aniInfo.persistent || false;

	var animations = AnimationsUtil.playAnimations("sad", delay, loop, speed, persistent, containerName, game, layer);

	return animations;
}