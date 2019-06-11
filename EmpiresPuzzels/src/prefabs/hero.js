import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import Counter from '../prefabs/counter';
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as Tweener from '../utils/tweener';
import * as ParticlesUtil from '../utils/particles-util';

class Heroes extends Phaser.Group {
    constructor(game, args) {
        super(game);
        this.heroes = [];
        this.createHero(3);
        // this.enemyBar = new LifeBar(this.game);
        
        this.dead = false;
    }

    setCta(cta) {
        this.cta = cta;
        this.enemyBar.setCta(cta);
    }

    createHero(amount) {
        for (var i = 1; i <= amount; i++) {
            var hero = new Phaser.Sprite(this.game, 0, 0, 'hero-' + i);
            ContainerUtil.fitInContainer(hero, 'hero-' + i, 0.5, 1);
            this.add(hero);
            this.heroes.push(hero);

            hero.lifeBar = new Counter(this.game, PiecSettings.lifeCounters.hero);
            // this.add(enemy.lifeBar);
            this.fitHeroBarInContainer(hero);
            // Tweener.characterBreath(hero, 0, 1000, Phaser.Easing.Linear.None);
                   
        }    
    }

    
    fitHeroBarInContainer(hero) {
        hero.lifeBar.scale.x = hero.width * 0.3 / (hero.lifeBar.width / hero.lifeBar.scale.x);
        hero.lifeBar.scale.y = hero.lifeBar.scale.x;
        hero.lifeBar.x = hero.x;
        hero.lifeBar.y = hero.y;
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

export default Heroes;