import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import Counter from '../prefabs/counter';
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import CustomSprite from '../prefabs/custom-sprite';
import * as Tweener from '../utils/tweener';
import * as ParticlesUtil from '../utils/particles-util';

class Heroes extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.args = args;

        this.heroes = [];

        this.createHero(this.args.length);
        // this.enemyBar = new LifeBar(this.game);

        // this.dead = false;

        this.initSignals();
    }

    setCta(cta) {
        this.cta = cta;

        this.enemyBar.setCta(cta);
    }

    initSignals() {
        this.onAttack = new Phaser.Signal();
    }

    createHero(amount) {
        for (var i = 0; i < amount; i++) {

            

            var hero = new Phaser.Sprite(this.game, 0, 0, this.args[i].src);

            ContainerUtil.fitInContainer(hero, this.args[i].container, 0.5, 0.5);

            this.add(hero);

            this.heroes.push(hero);

            hero.name = i;

            hero.colorType = this.args[i].colorType;

            hero.attacking = false;

            hero.weapon = this.args[i].weapon;

            hero.healthBar = new Counter(this.game, PiecSettings.lifeCounters['hero-health']);
            this.add(hero.healthBar);

            hero.health = PiecSettings.lifeCounters['hero-health'].initialValue;

            //======== energy bar =================
            hero.energyBar = new Counter(this.game, PiecSettings.lifeCounters['hero-energy']);

            this.add(hero.energyBar);

            hero.energy = PiecSettings.lifeCounters['hero-energy'].initialValue;

            //======== health bar =================

            var healthBarYPos = -hero.energyBar.height / 2;

            this.fitHeroBarInContainer(hero, hero.healthBar, healthBarYPos);

            this.fitHeroBarInContainer(hero, hero.energyBar, 0);

            hero.inputEnabled = true;
            hero.input.useHandCursor = true;

            hero.events.onInputDown.add(function(e) {

                this.attack(e);

            }, this);
        }


    }



    getHero(colorType) {

        for (var i = 0; i < this.heroes.length; i++) {

            if (this.heroes[i].colorType == colorType) {
                return this.heroes[i];
            }
        }
        return null;
    }

    fitHeroBarInContainer(hero, bar, yPos) {
        bar.scale.x = hero.width * 0.8 / (bar.width / bar.scale.x);
        bar.scale.y = bar.scale.x;
        bar.x = hero.x;
        bar.y = hero.y + yPos + hero.height * hero.anchor.y * 0.87;

    }

    changeEnergy(heroColorType, heroEnergy) {


        var hero = this.getHero(heroColorType);


        if (hero != null) {

            hero.energy += heroEnergy;

            if (hero.energy >= PiecSettings.lifeCounters['hero-energy'].maxValue) {

                hero.energy = PiecSettings.lifeCounters['hero-energy'].maxValue;

                if (hero.canAttackIndicator == null) {

                    hero.canAttackIndicator = CustomPngSequencesRenderer.playPngSequence(this.game, 'can_attack_ani', this);

                    ContainerUtil.fitInContainer(hero.canAttackIndicator, 'hero-' + hero.name, 0.5, 0.5);

                    hero.canAttackIndicator.y = hero.y - hero.height * 0.07;

                    hero.canAttack = true;

                }

            }

            hero.energyBar.changeCounterTo(hero.energy, 500);
        }



    }

    changeHealth(colorType, health, combo = 1) {
        // this.attacked()

        var hero = this.getHero(colorType);

        hero.health += health * combo;


        if (hero.health <= PiecSettings.lifeCounters['hero-health'].minValue) {

            hero.health = PiecSettings.lifeCounters['hero-health'].minValue;
            this.die(hero);
            return;
        }

        hero.healthBar.changeCounterTo(hero.health, 500);

        if (!hero.underAttack) {
            hero.underAttack = true;
            PiecSettings.hurtText.text = 300 + Math.floor(200 * Math.random());

            var hurt = new CustomSprite(this.game, {
                src: 'tiger-hurt',
                container: 'hero-' + hero.name,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            })

            hurt.scale.x = hero.width * 1.2 / (hurt.width / hurt.scale.x);
            hurt.scale.y = hurt.scale.x;

            hurt.blendMode = PIXI.blendModes.SCREEN;
            hurt.tint = 16744703;

            Tweener.fadeIn(hurt, 0, 300, Phaser.Easing.Quadratic.InOut);
            Tweener.scaleIn(hurt, 0, 400, Phaser.Easing.Quadratic.InOut).onComplete.add(function() {
                Tweener.scaleOut(hurt, 0, 400, Phaser.Easing.Quadratic.InOut);
            }, this);
        }


    }

    die() {
        console.log('hero die');
    }

    attack(hero) {
        if (!hero.canAttack) {
            return;
        }


        switch (hero.colorType) {
            case 4:
                hero.attacking = true;
                //heal
                for (var i = 0; i < this.heroes.length; i++) {
                    this.heroes[i].health = PiecSettings.lifeCounters['hero-health'].maxValue;
                    this.heroes[i].healthBar.changeCounterTo(this.heroes[i].health, 500);


                    var healthText = new CustomText(this.game, PiecSettings.healText);
                    healthText.scale.x = this.heroes[i].width / (healthText.width / healthText.scale.x);
                    healthText.scale.y = healthText.scale.x;
                    healthText.y = this.heroes[i].y;
                    healthText.x = this.heroes[i].x;

                    var originalScale = healthText.scale.x;

                    this.game.add.tween(healthText.scale).to({
                        x: [originalScale * 1.5, originalScale],
                        y: [originalScale * 1.5, originalScale]
                    }, 600, Phaser.Easing.Quadratic.InOut, true, 100);

                    this.game.add.tween(healthText).to({
                        alpha: [1, 1, 0],
                        y: this.heroes[i].y - this.heroes[i].height / 2
                    }, 1200, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function(e) {
                        e.destroy();
                    }, this);
                }

                break;

            case 2:

                this.onAttack.dispatch(hero, 40);
                break;

            case 3:

                this.onAttack.dispatch(hero, 40);
                break;
        }

        hero.canAttack = false;
        hero.canAttackIndicator.destroy();
        hero.canAttackIndicator = null;

        var originalY = hero.y;
        this.game.add.tween(hero).to({
            y: originalY * 0.95
        }, 300, Phaser.Easing.Quadratic.None, true, 0).onComplete.add(function() {
            this.game.add.tween(hero).to({
                y: originalY
            }, 300, Phaser.Easing.Quadratic.None, true, 0)
        }, this);

        hero.energy = PiecSettings.lifeCounters['hero-energy'].minValue;
        hero.energyBar.changeCounterTo(hero.energy, 100);
    }

    
}

export default Heroes;