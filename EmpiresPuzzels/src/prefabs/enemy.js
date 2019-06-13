import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import Counter from '../prefabs/counter';
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import CustomSprite from '../prefabs/custom-sprite';
import * as Tweener from '../utils/tweener';
import * as ParticlesUtil from '../utils/particles-util';

class Enemy extends Phaser.Group {
    constructor(game, args) {
        super(game);
        this.enemies = [];

        this.args = args;


        this.createEnemy(this.args.enemyAmount);

        this.dead = false;

        this.initSignals();
    }

    setCta(cta) {
        this.cta = cta;
        this.enemyBar.setCta(cta);
    }

    initSignals() {
        this.onAttack = new Phaser.Signal();
    }

    createEnemy(amount) {
        for (var i = 0; i < amount; i++) {

            var enemy = new Phaser.Sprite(this.game, 0, 0, 'enemy');

            ContainerUtil.fitInContainer(enemy, 'enemy-' + i, 0.5, 1);

            this.add(enemy);

            this.enemies.push(enemy);

            enemy.name = i;

            enemy.dead = false;

            enemy.health = PiecSettings.lifeCounters.enemy.initialValue;

            enemy.lifeBar = new Counter(this.game, PiecSettings.lifeCounters.enemy);

            this.fitEnemyBarInContainer(enemy);

            Tweener.characterBreath(enemy, 0, (i + 1) * 1000 + 500 * Math.random(), Phaser.Easing.Linear.None);

        }
    }


    fitEnemyBarInContainer(enemy) {
        enemy.lifeBar.scale.x = enemy.width * 0.3 / (enemy.lifeBar.width / enemy.lifeBar.scale.x);
        enemy.lifeBar.scale.y = enemy.lifeBar.scale.x;
        enemy.lifeBar.x = enemy.x;
        enemy.lifeBar.y = enemy.y;
        // this.enemyBar.y = this.aimCircle.y + this.aimCircle.height * .95;
    }

    getEnemyYPosition() {
        return this.enemyIdle.y;
    }
    getEnemyYCenterPosition() {
        return this.enemyIdle.y + this.enemyIdle.height / 2;
    }
    getEnemyXCenterPosition() {
        return this.enemyIdle.x + this.enemyIdle.width / 2;
    }

    getEnemy(index) {
        return this.enemies[index];
    }

    changeHealth(enemyIndex, enemyHealth, combo = 1) {
        // this.attacked()

        var enemy = this.getEnemy(enemyIndex);

        enemy.health += enemyHealth * combo;


        if (enemy.health <= PiecSettings.lifeCounters.enemy.minValue) {

            enemy.health = PiecSettings.lifeCounters.enemy.minValue;
            this.die(enemy);
            return;
        }

        enemy.lifeBar.changeCounterTo(enemy.health, 500);

        if (!enemy.underAttack) {
            enemy.underAttack = true;
            PiecSettings.hurtText.text = 300 + Math.floor(200 * Math.random());

            var healthText = new CustomText(this.game, PiecSettings.hurtText);

            healthText.y = enemy.y;
            healthText.x = enemy.x;
            healthText.scale.x = enemy.width * 0.35 / (healthText.width / healthText.scale.x);
            healthText.scale.y = healthText.scale.x;

            var originalScale = healthText.scale.x;

            this.game.add.tween(healthText.scale).to({
                x: [originalScale * 1.5, originalScale],
                y: [originalScale * 1.5, originalScale]
            }, 600, Phaser.Easing.Quadratic.InOut, true, 100);

            this.game.add.tween(healthText).to({
                alpha: [1, 1, 0],
                y: enemy.y - enemy.height / 2
            }, 1200, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function(e) {
                e.destroy();
            }, this);

            this.hurt(enemy);
        }


    }

    hurt(enemy) {
        if(enemy.dead){
            return;
        }

        console.log('here');

        var initialY = enemy.y;

        this.game.add.tween(enemy).to({
            y: [initialY * 1.05, initialY],
            alpha: [0.5, 1]
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {
            enemy.underAttack = false;
            this.onAttack.dispatch(this);
        }, this);

    }

    die(enemy) {
        Tweener.fadeOut(enemy.lifeBar, 0, 100, Phaser.Easing.Linear.None);
        this.game.add.tween(enemy).to({
            alpha: [ 0],
        }, 100, Phaser.Easing.Linear.None, true, 0).onComplete.add(function() {

            if (!enemy.dead) {
                var effect = new CustomSprite(this.game, {
                    src: 'die-effect',
                    container: 'enemy-' + enemy.name,
                    anchor: {
                        x: 0.5,
                        y: 0.5
                    }

                });

                Tweener.fadeIn(effect, 0, 200, Phaser.Easing.Linear.None);
                
                effect.blendMode = PIXI.blendModes.SCREEN;
                // effect.tint = 0x430c64;

                Tweener.scaleOut(effect, 0, 500, Phaser.Easing.Quadratic.InOut);

                enemy.dead = true;
                
            }


        }, this);
    }


    attacked() {
        if (!this.dead && this.enemyBar.amount - 7 <= 0) {
            var positionTween = this.game.add.tween(this).to({ y: -50 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            positionTween.onComplete.add(function() {
                this.game.add.tween(this).to({ y: 0 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            }, this);

            var redAlphaTween = this.game.add.tween(this.redEnemy).to({ alpha: 1 }, 500, Phaser.Easing.Quadratic.InOut, true, 0);
            redAlphaTween.onComplete.add(function() {
                // this.game.add.tween(this.redEnemy).to({alpha: 0}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
                this.game.add.tween(this).to({ alpha: 0 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
                this.game.add.tween(this.enemyBar).to({ alpha: 0 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
            }, this);
        } else if (!this.dead) {
            var positionTween = this.game.add.tween(this).to({ y: -50 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            positionTween.onComplete.add(function() {
                this.game.add.tween(this).to({ y: 0 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            }, this);

            var whiteAlphaTween = this.game.add.tween(this.whiteEnemy).to({ alpha: 1 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            whiteAlphaTween.onComplete.add(function() {
                this.game.add.tween(this.whiteEnemy).to({ alpha: 0 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            }, this);

            var circleTween = this.game.add.tween(this.aimCircle).to({ y: this.aimCircleInitialY + 80 }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            circleTween.onComplete.add(function() {
                var circleTween = this.game.add.tween(this.aimCircle).to({ y: this.aimCircleInitialY }, 150, Phaser.Easing.Quadratic.InOut, true, 0);
            }, this);
        }
        this.enemyBar.decreaseLifeBar(7);
    }
}

export default Enemy;