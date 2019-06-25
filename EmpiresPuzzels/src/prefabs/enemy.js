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
        console.log(this.args);

        this.enemiesArgs = this.args;

        this.createEnemy(this.enemiesArgs.length);

        this.alivedEnemy = this.enemiesArgs.length;

        this.canDestroyed = false;

        this.initSignals();
    }

    // setCta(cta) {
    //     this.cta = cta;
    //     this.enemyBar.setCta(cta);
    // }

    initSignals() {
        this.onAttack = new Phaser.Signal();
    }

    createEnemy(amount) {
        for (var i = 0; i < amount; i++) {

            // because the life bar won't move together with the enmey, there's no need to put them into a same group
            var enemy = new Phaser.Sprite(this.game, 0, 0, this.enemiesArgs[i].src);

            ContainerUtil.fitInContainer(enemy, this.enemiesArgs[i].container, 0.5, 1);

            this.add(enemy);

            this.enemies.push(enemy);

            enemy.name = i;

            enemy.container = this.enemiesArgs[i].container;

            enemy.dead = false;

            enemy.health = this.enemiesArgs[i].health;


            PiecSettings.lifeCounters.enemy.initialValue = this.enemiesArgs[i].health;
            PiecSettings.lifeCounters.enemy.maxValue = this.enemiesArgs[i].health;
            enemy.lifeBar = new Counter(this.game, PiecSettings.lifeCounters.enemy);

            this.fitEnemyBarInContainer(enemy);

            this.add(enemy.lifeBar);

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


    getEnemy(index) {
        
        return this.enemies[index];

    }

    getRandomAlive() {

        if(this.alivedEnemy <= 0)
            return;

        var enemy = this.getEnemy(Math.floor(Math.random() * this.enemiesArgs.length));

        if (enemy == null || enemy.dead) {

            return this.getRandomAlive();

        } else {

            return enemy;
        }
    }

    changeHealth(enemyIndex, enemyHealth, combo = 1) {
        // this.attacked()



        var enemy = this.getEnemy(enemyIndex);
        if(enemy == null)
            return;


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
        if (enemy.dead) {
            return;
        }

        var initialY = enemy.y;

        this.enemyHurtTween = this.game.add.tween(enemy).to({
            y: [initialY * 1.05, initialY],
            // alpha: [0.5, 1]
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {
            enemy.underAttack = false;
            // this.onAttack.dispatch(this);
            if(!enemy.dead)
                this.onAttack.dispatch(this.getRandomAlive());
        }, this);

    }

    die(enemy) {

        if (!enemy.dead) {
            enemy.dead = true;
            this.alivedEnemy--;


            this.game.time.events.add(500, function(){
                Tweener.fadeOut(enemy.lifeBar, 0, 100, Phaser.Easing.Linear.None);    
            }, this)
            

            this.game.tweens.remove(this.enemyHurtTween);
            
            this.game.add.tween(enemy).to({
                alpha: [0, 1, 0],
            }, 100, Phaser.Easing.Linear.None, true, 0).onComplete.add(function() {



                enemy.deadEffect = CustomPngSequencesRenderer.playPngSequence(this.game, 'enemyAttack', this, null);
                ContainerUtil.fitInContainer(enemy.deadEffect, enemy.container, 0.5, 1); 



            }, this);
        } else {
            
            if (this.alivedEnemy <= 0 && !this.canDestroyed) {
                this.canDestroyed = true;
                this.game.onLevelUp.dispatch(this.canDestroyed);
            }
        }

        if (this.alivedEnemy <= 0 && !this.canDestroyed) {
            this.canDestroyed = true;
            this.game.onLevelUp.dispatch(this.canDestroyed);
        }

    }

    destroy(){
        
    }



}

export default Enemy;