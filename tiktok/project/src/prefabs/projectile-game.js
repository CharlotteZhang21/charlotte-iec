import * as ContainerUtil from '../utils/container-util';
import * as CustomPngSequenceRender from '../utils/custom-png-sequences-renderer';
class ProjectileGame extends Phaser.Group {
    /*
    args:
     + src: reference to the asset to be used
     + amount: how many projectile are generated 
     + direction: where do they face
     + container: htmlTag of the container to fit the button in
    */

    constructor(game, handGestureController, args) {
        super(game);

        this.initSignals();

        this.containerName = args.container;

        this.getContainerInfo();

        this.projectiles = [];

        this.gameDuration = args.gameDuration;
        this.initialTimeMargin = args.initialTimeMargin;
        this.endTimeMargin = args.endTimeMargin;

        this.failAni = args.failAni !== undefined ? args.failAni : null;
        this.successAni = args.successAni !== undefined ? args.successAni : null;

        this.triggered = false;

        this.handGestureController = handGestureController;

        this.swipe = ''; // detect swipe

        this.failed = false;

        this.createProjectiles(args.src, args.amount, args.direction);

    }

    initSignals() {
        this.onSuccess = new Phaser.Signal();
        this.onFail = new Phaser.Signal();
    }

    getContainerInfo() {
        this.containerWidth = ContainerUtil.getContainerWidth(this.containerName);
        this.containerHeight = ContainerUtil.getContainerHeight(this.containerName);
        this.x = ContainerUtil.getContainerX(this.containerName);
        this.y = ContainerUtil.getContainerY(this.containerName);
    }

    createInteractionArea() {

        this.handGestureController.onSwipe.add(function(direction) {
            if (direction.indexOf('UP') != -1) {
                this.swipe = 'up';
                if (!this.failed)
                    this.flyUpProjectiles();
            }
        }, this);

    }

    createProjectiles(src, amount, direction) {

        var isAnimation = src.indexOf(".png") == -1;

        for (var i = 0; i < amount; i++) {

            if (isAnimation) {
                var projectile = CustomPngSequenceRender.playPngSequence(this.game, src, this);
                // this.add(projectile);
            } else {
                var projectile = new Phaser.Sprite(this.game, 0, 0, src);
                // this.add(projectile);
            }
            projectile.anchor.set(0.5);

            projectile.scale.y = this.containerHeight / projectile.height / amount;
            projectile.scale.x = projectile.scale.y;

            projectile.x = this.containerWidth + Math.abs(projectile.width) / 2 + this.x;
            if (i == 0)
                projectile.y = ContainerUtil.getYCenterWithinContainer(this.containerName);
            else
                projectile.y = ContainerUtil.getRandomYWithinContainer(this.containerName) / amount + this.y;

            switch (direction) {
                case 'inverse':
                    projectile.scale.x *= -1;
                    break;
                case 'random':
                    projectile.scale.x *= Math.floor(Match.random() * 2 - 1); //generates -1 and 1 randomly
                    break;
                case 'same':
                    projectile.scale.x *= 1;
                default:
                    console.log('please set the projectile direction');

            }

            this.projectiles.push(projectile);

        }
    }

    updateProjectiles(direction) {
        switch (direction) {

            case 'up':
                for (var i = 0; i < this.projectiles.length; i++) {
                    var projectile = this.projectiles[i];
                    var p_angle = this.angle;
                    this.game.add.tween(projectile).to({ y: -1000, angle: [p_angle += 120] }, 1000, Phaser.Easing.Linear.out, true, 100 * i);

                }
                break;
            case 'down':
                for (var i = 0; i < this.projectiles.length; i++) {
                    var projectile = this.projectiles[i];
                    var p_angle = this.angle;
                    this.game.add.tween(projectile).to({ y: this.game.global.windowHeight + 1000, angle: [p_angle -= 120] }, 1000, Phaser.Easing.Linear.out, true, 100 * i);
                }

        }
    }



    hide() {
        if (this.alpha > 0)
            this.alpha = 0;
    }

    show() {
        if (this.alpha < 1)
            this.alpha = 1;

        if (!this.triggered)
            this.fly();
    }

    fly() {

        this.triggered = true;

        this.flyToCenterProjectiles(this.initialTimeMargin);

        var interactionDuration = this.gameDuration - this.initialTimeMargin - this.endTimeMargin;

        this.game.time.events.add(this.initialTimeMargin, function() {
            this.createInteractionArea();
            this.flySlowMoProjectiles(interactionDuration);
        }, this);

        this.game.time.events.add(interactionDuration, function() {
            if (this.swipe == '') {
                this.onFail.dispatch(this);
                this.flyStraightProjectiles(this.endTimeMargin);
                this.failed = true;
            }
        }, this);
    }

    flyToCenterProjectiles(duration) {
        for (var i = 0; i < this.projectiles.length; i++) {
            var projectile = this.projectiles[i];
            this.flyToCenter(projectile, duration);
        }
    }

    flyToCenter(projectile, duration) {
        if (projectile.tween)
            this.game.tweens.remove(projectile.tween);

        projectile.tween = this.game.add.tween(projectile).to({
            x: this.containerWidth / 2 + Math.abs(projectile.width) / 2 + this.x,
        }, duration, Phaser.Easing.Quadratic.In, true, 0);
    }

    flySlowMoProjectiles(duration) {
        for (var i = 0; i < this.projectiles.length; i++) {
            var projectile = this.projectiles[i];
            this.flySlowMo(projectile, duration);
        }
    }

    flySlowMo(projectile, duration) {
        if (projectile.tween)
            this.game.tweens.remove(projectile.tween);

        projectile.tween = this.game.add.tween(projectile).to({
            x: this.containerWidth / 2 + this.x,
        }, duration, Phaser.Easing.Linear.None, true, 0);
    }

    flyStraightProjectiles(duration) {
        for (var i = 0; i < this.projectiles.length; i++) {
            var projectile = this.projectiles[i];
            this.flyStraight(projectile, duration);
        }
    }

    flyStraight(projectile, duration) {

        if (projectile.tween)
            this.game.tweens.remove(projectile.tween);

        projectile.tween = this.game.add.tween(projectile).to({
            x: this.x + Math.abs(projectile.width) * .1,
        }, duration, Phaser.Easing.Linear.In, true, 0);

        projectile.tween.onComplete.add(function(projectile) {
            projectile.alpha = 0;
            if (this.failAni != null) {
                var explosion = CustomPngSequenceRender.playPngSequence(this.game, this.failAni, this);
                explosion.scale.y = projectile.height * 1.8 / explosion.height;
                explosion.scale.x = explosion.scale.y;
                explosion.x = this.x - Math.abs(projectile.width) * .4;
                explosion.y = projectile.y - explosion.height / 2;
            }
        }, this);

    }

    flyUpProjectiles() {
        for (var i = 0; i < this.projectiles.length; i++) {
            this.flyUp(this.projectiles[i], 0, this.endTimeMargin);
        }
        this.onSuccess.dispatch(this);
    }

    flyUp(projectile, delay, duration) {

        if (projectile.tween)
            this.game.tweens.remove(projectile.tween);

        var p_angle = this.angle;
        var initialY = projectile.y;

        this.game.add.tween(projectile).to({
            y: [initialY, -500],
            angle: [p_angle += 120],
            x: this.x,
        }, duration, Phaser.Easing.Linear.Out, true, delay);

    }

    disable() {
        this.hide();
    }

    enable() {
        this.show();
    }

    autoDestroy(delay) {
        this.game.time.events.add(delay, function() {
            this.destroy();
        }, this);
    }

}

export default ProjectileGame;