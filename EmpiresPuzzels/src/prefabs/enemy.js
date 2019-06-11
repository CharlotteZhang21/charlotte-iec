import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import Counter from '../prefabs/counter';
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as Tweener from '../utils/tweener';
import * as ParticlesUtil from '../utils/particles-util';

class Enemy extends Phaser.Group {
    constructor(game, args) {
        super(game);
        this.enemies = [];
        this.createEnemy(3);
        // this.enemyBar = new LifeBar(this.game);
        
        this.dead = false;
    }

    setCta(cta) {
        this.cta = cta;
        this.enemyBar.setCta(cta);
    }

    createEnemy(amount) {
        for (var i = 1; i <= amount; i++) {
            var enemy = new Phaser.Sprite(this.game, 0, 0, 'enemy');
            ContainerUtil.fitInContainer(enemy, 'enemy-' + i, 0.5, 1);
            this.add(enemy);
            this.enemies.push(enemy);

            enemy.lifeBar = new Counter(this.game, PiecSettings.lifeCounters.enemy);
            // this.add(enemy.lifeBar);
            this.fitEnemyBarInContainer(enemy);
            Tweener.characterBreath(enemy, 0, 1000, Phaser.Easing.Linear.None);
                   
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