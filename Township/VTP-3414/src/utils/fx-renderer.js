import * as Util from '../utils/util';
import * as AnimationsUtil from '../utils/slot-animations-util.js';

// import * as Congrats from '../animations/congrats.js';
// import * as Sad from '../animations/sad.js';
export function preloadFx(game) {
    var animationObj = PiecSettings.animation;
    for (var prop in animationObj){
        
        if(!animationObj.hasOwnProperty(prop))
            continue;

        preload(game, animationObj[prop]);

    }

    // Congrats.preload(game);
    // Sad.preload(game);    
}

export function playFx(game, layer, animationName) {

    
    var animationsObj = PiecSettings.animation[animationName];
    var animation = play(game, layer, animationsObj);
    return animation;
    
    // switch (animationName) {
    //     case "congrats" : 
    //         var conAni = Congrats.play(game, layer);
    //         return conAni;
    //         break;
    //     case "sad" : 
    //         var sadAni = Sad.play(game, layer);  
    //         return sadAni; 
    //         break; 
    // }
}



// var aniInfo = PiecSettings.animation['sad'];

function preload(game, prop) {
    var name = prop.src;
    game.load.spritesheet(name, PiecSettings.assetsDir + name + '.png', prop.width, prop.height, prop.totalNum);
}

function play(game, layer, animationsObj) {   
    var containerName = animationsObj.container;
    var delay = animationsObj.delay || 0;
    var loop = animationsObj.loop || null;
    var speed = animationsObj.speed || 10;
    var persistent = animationsObj.persistent || false;

    var animations = AnimationsUtil.playAnimations(animationsObj.src, delay, loop, speed, persistent, containerName, game, layer);

    return animations;
}