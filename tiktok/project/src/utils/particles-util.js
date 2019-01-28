import * as ContainerUtil from '../utils/container-util';
import * as Tweener from '../utils/tweener';
import * as CustomPngSequenceRender from '../utils/custom-png-sequences-renderer';

export function particleBurst(game, particlesSrc, particleContainer, x, y, amount) {

    for (var i = 0; i < amount; i++) {

        var particle = getRandomParticleFromArray(game, particlesSrc);

        ContainerUtil.fitInContainer(particle, particleContainer, 0.5, 0.5);
        particle.x = x;
        particle.y = y;

        //Scale
        var randomScaleMultiplier = ((Math.random() * .1) + 1);
        particle.scale.x *= randomScaleMultiplier
        particle.scale.y = particle.scale.x;

        //Rotation
        var randomRotation = Math.random() * 90;
        particle.angle = randomRotation;

        game.add.existing(particle);

        var delay = Math.random() * 100;
        var duration = 600 + Math.random() * 200;

        var xRandomDirection = Math.random() - 0.5;

        var yRandomPosition = particle.y - particle.height * (Math.random() * 3);

        var tween = Tweener.moveTo(
            particle,
            particle.x + xRandomDirection * particle.width * 15,
            [yRandomPosition, yRandomPosition + particle.height * (Math.random() * 7)],
            delay,
            duration,
            Phaser.Easing.Quadratic.Out);

        particle.tween = tween;

        //Rotation animation
        game.add.tween(particle).to({
            angle: randomRotation + xRandomDirection * 25 + 100 * (xRandomDirection < 0 ? -1 : 1),
        }, duration, Phaser.Easing.Quadratic.InOut, true, delay);

        //Scale down
        Tweener.scaleOut(particle, duration - 200, 200, Phaser.Easing.Quadratic.InOut);

        tween.onComplete.add(function(particleSprite) {
            particleSprite.destroy();
        });
    }
}

export function particleRain(game, particlesSrc, particleContainer, particleGoalContainer, x, y, amount, verticalStrength = 10, horizontalStrength = 40) {

    for (var i = 0; i < amount; i++) {

        var particle = getRandomParticleFromArray(game, particlesSrc);

        ContainerUtil.fitInContainer(particle, particleContainer, 0.5, 0.5);
        particle.x = x;
        particle.y = y;

        //Scale
        var randomScaleMultiplier = ((Math.random() * .5) + .5);
        particle.scale.x *= randomScaleMultiplier
        particle.scale.y = particle.scale.x;

        //Rotation
        var randomRotation = Math.random() * 90;
        particle.angle = randomRotation;

        game.add.existing(particle);

        var delay = Math.random() * 100;
        var duration = 1500 + Math.random() * 200;

        var xRandomDirection = Math.random() - 0.5;
        var yRandomPosition = particle.y - particle.height * (Math.random() * verticalStrength);

        var goalX = -1,
            goalY = -1;
        if (particleGoalContainer !== undefined) {
            goalX = ContainerUtil.getContainerX(particleGoalContainer);
            goalY = ContainerUtil.getContainerY(particleGoalContainer);
        }

        if (goalX != -1 && goalY != -1) {
            var tween = Tweener.moveTo(
                particle,
                [particle.x + xRandomDirection * particle.width * horizontalStrength, particle.x + xRandomDirection * particle.width * horizontalStrength * 5, goalX + Math.random() * particle.width * 10],
                [yRandomPosition, yRandomPosition + particle.height * (Math.random() * 30), goalY + Math.random() * particle.height * 10],
                delay,
                duration,
                Phaser.Easing.Quadratic.Out).interpolation(
                function(v, k) {
                    return Phaser.Math.bezierInterpolation(v, k);
                });

            particle.tween = tween;

        } else {

            if (verticalStrength > 0) {

                var tween = Tweener.moveTo(
                    particle,
                    particle.x + xRandomDirection * particle.width * horizontalStrength,
                    [yRandomPosition, yRandomPosition + particle.height * (Math.random() * 30)],
                    delay,
                    duration,
                    Phaser.Easing.Quadratic.Out).interpolation(
                    function(v, k) {
                        return Phaser.Math.bezierInterpolation(v, k);
                    });;

                particle.tween = tween;
            } else {
                var tween = Tweener.moveTo(
                    particle,
                    particle.x + xRandomDirection * particle.width * horizontalStrength,
                    yRandomPosition + particle.height * (Math.random() * 30),
                    delay,
                    duration,
                    Phaser.Easing.Quadratic.Out).interpolation(
                    function(v, k) {
                        return Phaser.Math.bezierInterpolation(v, k);
                    });;

                particle.tween = tween;
            }
        }


        game.add.tween(particle).to({
            angle: randomRotation + xRandomDirection * 25 + 100 * (xRandomDirection < 0 ? -1 : 1),
        }, duration, Phaser.Easing.Quadratic.InOut, true, delay);

        Tweener.scaleOut(particle, duration - 100, 100, Phaser.Easing.Quadratic.InOut);

        tween.onComplete.add(function(particleSprite) {
            particleSprite.destroy();
        });

    }

}

/*
 * Strength should be a number from 1 to 5 
 */
export function particleShoot(game, particlesSrc, particleContainer, x, y, amount, xDir, yDir, strength = 1) {
    for (var i = 0; i < amount; i++) {

        var particle = getRandomParticleFromArray(game, particlesSrc);

        ContainerUtil.fitInContainer(particle, particleContainer, 0.5, 0.5);
        particle.x = x;
        particle.y = y;

        //Scale
        var randomScaleMultiplier = ((Math.random() * .5) + 1);
        particle.scale.x *= randomScaleMultiplier;
        particle.scale.y = particle.scale.x;

        //Rotation
        var randomRotation = Math.random() * 90;
        particle.angle = randomRotation;

        game.add.existing(particle);

        var delay = Math.random() * 100;
        var duration = 600 + Math.random() * 200;

        var tween = Tweener.moveTo(
            particle,
            particle.x + xDir * particle.width * (Math.random() + strength),
            particle.y + yDir * particle.height * (Math.random() + strength),
            delay,
            duration,
            Phaser.Easing.Quadratic.Out);

        particle.tween = tween;

        //Rotation animation
        game.add.tween(particle).to({
            angle: randomRotation + xDir * 25 + 100 * (xDir < 0 ? -1 : 1),
        }, duration, Phaser.Easing.Quadratic.InOut, true, delay);

        var originalScale = particle.scale.x;

        particle.scale.x = originalScale * .2;
        particle.scale.y = originalScale * .2;
        //Scale animation
        game.add.tween(particle.scale).to({
            x: [originalScale, originalScale, originalScale, 0.01],
            y: [originalScale, originalScale, originalScale, 0.01]
        }, duration, Phaser.Easing.Quadratic.InOut, true, 0);
        // Tweener.scaleOut(particle, duration - 500, 500, Phaser.Easing.Quadratic.InOut);

        tween.onComplete.add(function(particleSprite) {
            particleSprite.destroy();
        });
    }
}

function getRandomParticleFromArray(game, particlesSrc) {
    var randomParticleSrc = particlesSrc[Math.min(Math.floor(Math.random() * particlesSrc.length), particlesSrc.length - 1)];
    if (randomParticleSrc.indexOf(".png") != -1) {
        return new Phaser.Sprite(game, 0, 0, randomParticleSrc);
    } else { //png sequence!
        return CustomPngSequenceRender.playPngSequence(game, randomParticleSrc, null);
    }
}

export function particleSpawn(game, particlesSrc, particleContainer, x, y, amount, angleRange = 360) {
    var particles = [];
    for (var i = 0; i < amount; i++) {
        var particle = particleSpawnSingle(game, particlesSrc, particleContainer, x, y, angleRange);
        particles.push(particle);
    }
    return particles;
}

export function particleExplosion(game, particlesSrc, particleContainer, parentContainer, x, y, amount, angleRange = 360) {
    var particles = [];

    var radius = ContainerUtil.getContainerWidth(parentContainer) / 2;

    var angle = 0;
    var step = (2 * Math.PI ) / amount;
    // var amount = 2;

    // var step = 360 / amount;
    console.log(" step === " + step);


    for (var i = 0; i < amount; i++) {

        var particle = getRandomParticleFromArray(game, particlesSrc);
        
        ContainerUtil.fitInContainer(particle, particleContainer, 0.5, 0.5);
        
        
        particle.angle =  90 + 360 / amount * i;
 
        particles.push(particle);
        
        game.add.existing(particle);
        
        particle.x = x;
        particle.y = y;

        var particleScale = particle.scale.x;

        var targetX = particle.x + radius * Math.cos(angle),
            targetY = particle.y + radius * Math.sin(angle);

        angle += step;

        game.add.tween(particle).to({
            x: targetX,
            y: targetY,
            // angle: angle,
        }, 400, Phaser.Easing.Quadratic.Out, true, 0);

        particle.scale.x = particleScale * 0.1;

        game.add.tween(particle.scale).to({
            x: [particleScale, 0],
            y: [particleScale, 0],
        }, 400, Phaser.Easing.Quadratic.Out, true, 0);

        
    }
    return particles;
}

function particleSpawnSingle(game, particlesSrc, particleContainer, x, y, angleRange = 360) {
    var particle = getRandomParticleFromArray(game, particlesSrc);

    var xRandomDirection = Math.random() - 0.5;
    var yRandomDirection = Math.random() - 0.5;

    ContainerUtil.fitInContainer(particle, particleContainer, 0.5, 0.5);
    particle.x = x + xRandomDirection * particle.width;
    particle.y = y + yRandomDirection * particle.width;

    var randomScaleMultiplier = ((Math.random() * .1) + 1);
    particle.scale.x *= randomScaleMultiplier
    particle.scale.y = particle.scale.x;

    var randomRotation = Math.random() * angleRange;
    particle.angle = randomRotation;

    game.add.existing(particle);

    return particle;
}

