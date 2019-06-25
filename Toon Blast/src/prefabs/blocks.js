import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import CustomSprite from '../prefabs/custom-sprite';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer';
import * as Tweener from '../utils/tweener';

class Blocks extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.blocks = {};


        this.createRandomBlocks();

        this.initSignals();

        this.animateBlocks();


    }

    initSignals() {
        this.onBlocksFinished = new Phaser.Signal();
    }


    createRandomBlocks() {
        var block;

        var size = Util.isPortrait() ? PiecSettings.blockArraySize.portrait : PiecSettings.blockArraySize.landscape;

        this.maxCol = size.length;


        this.maxRow = Math.max.apply(null, size);


        for (var j = 0; j < size.length; j++) {

            for (var i = this.maxRow; i > this.maxRow - size[j]; i--) {
                var blockColour = this.getRandomBlockColor(i, j);
                block = new Phaser.Sprite(this.game, 0, 0, 'block_' + blockColour);

                block.colour = blockColour;
                this.add(block);

                ContainerUtil.fitInContainer(block, 'fixed-block-1', 0.5, 1);

                //j is col, i is row

                var leftBlockCoor, bottomBlock;


                if (i < this.maxRow) {

                    bottomBlock = i + 1;
                    block.y = this.blocks[j + ',' + bottomBlock].y - this.blocks[j + ',' + bottomBlock].height * 0.9;
                } else {

                    block.y = -this.game.global.windowHeight * window.devicePixelRatio * 0.03 * Math.abs(Math.floor(size.length / 2) - j);
                }


                if (j > 0) {

                    leftBlockCoor = j - 1;
                    if (this.blocks[leftBlockCoor + ',' + i] != undefined)
                        block.x = this.blocks[leftBlockCoor + ',' + i].x + this.blocks[leftBlockCoor + ',' + i].width * (0.9 + 0.1 * Math.random());
                    else {
                        block.x = this.blocks[j + ',' + this.maxRow].x;
                    }
                } else {
                    block.x = 0;
                }

                block.scale.x = (1 - Math.abs(j - size.length / 2) / 10) * block.scale.x;
                block.scale.y = block.scale.x;


                block.row = i;
                block.col = j;


                this.blocks[j + ',' + i] = block;


            }
        }


    }


    getRandomBlockColor(i, j) {
        var colour = PiecSettings.blocks[Math.floor(Math.random() * 6)];

        var bottomBlockNum = j + ',' + (i + 1);
        var bottomBlock = this.blocks[bottomBlockNum];


        var leftBlockNum = j + ',' + (i - 1);
        var leftBlock = this.blocks[leftBlockNum];


        if (bottomBlock != undefined && colour == bottomBlock.colour) {

            return this.getRandomBlockColor(i, j);
        }
        if (leftBlock != undefined && colour == leftBlock.colour) {
            return this.getRandomBlockColor(i, j);
        }

        return colour;

    }

    checkClick(mouseX, mouseY) {

        for (var key in this.blocks) {
            var block = this.blocks[key];
            var blockWidthRange = [block.worldPosition.x - block.width / 2 * this.scale.x, block.worldPosition.x + block.width / 2 * this.scale.x];
            var blockHeightRange = [block.worldPosition.y - block.height * this.scale.x, block.worldPosition.y];

            if (mouseX >= blockWidthRange[0] && mouseX <= blockWidthRange[1] && mouseY >= blockHeightRange[0] && mouseY <= blockHeightRange[1]) {
                // block.tint = 0x5555555;
                // block.tint = 0xfffffff;
                if(block.tween!= null ){
                    this.game.tweens.remove(block.tween);
                    block.angle = 0;
                }
                block.tween = this.game.add.tween(block).to({
                        angle: 15
                    }, 300,
                    function(k) {
                        return Math.sin(Math.PI * 2 * k);
                    }, true, 0, 1);
                return block.colour;
            }

        }

        return null;
    }


    animateBlocks() {
        var index = 0;
        var lastTween = null;
        for (var key in this.blocks) {
            var block = this.blocks[key];
            var row = key.split(',')[1],
                col = key.split(',')[0];


            if (row <= this.maxRow / 2 || col == 0 || (col == (this.maxCol - 1) && row < this.maxRow)) {

                var finalY = block.y;
                var finalX = block.x;

                if (Util.isPortrait()) {
                    block.y = finalY - this.game.global.windowHeight * window.devicePixelRatio;
                } else {
                    block.y = finalY - this.game.global.windowHeight * window.devicePixelRatio * 1.6;
                }


                var originalScale = block.scale.x;

                this.game.add.tween(block.scale).to({
                    x: [originalScale * 0.98, originalScale * 0.98, originalScale * 1.02, originalScale],
                    y: [originalScale * 1.02, originalScale * 1.02, originalScale * 0.98, originalScale]
                }, 400, Phaser.Easing.Quadratic.InOut, true, index * 100 + 400);


                lastTween = Tweener.moveTo(block, finalX, [finalY * 1.05, finalY * 0.95, finalY], index++ * 100, 800, Phaser.Easing.Quadratic.InOut);

            }


        }

        lastTween.onComplete.add(function() {

            this.onBlocksFinished.dispatch();
        }, this);

    }

    levelUp(minigame) {

    }

    explodeAll() {

        for (var key in this.blocks) {

            var particle = this.blocks[key];

            //Rotation
            var randomRotation = Math.random() * 90;
            particle.angle = randomRotation;


            var delay = Math.random() * 100;
            var duration = 600 + Math.random() * 200;

            var xRandomDirection = Math.random() - 0.5;

            var yRandomPosition = particle.y - particle.height * (Math.random() * 3);

            var tween = Tweener.moveTo(
                particle,
                particle.x + xRandomDirection * particle.width * 15,
                [yRandomPosition, yRandomPosition + particle.height * (Math.random() * 5)],
                delay,
                duration,
                Phaser.Easing.Quadratic.Out);

            particle.tween = tween;

            //Rotation animation
            this.game.add.tween(particle).to({
                angle: randomRotation + xRandomDirection * 25 + 100 * (xRandomDirection < 0 ? -1 : 1),
            }, duration, Phaser.Easing.Quadratic.InOut, true, delay);

            //Scale down
            Tweener.scaleOut(particle, duration - 200, 100, Phaser.Easing.Quadratic.In);

            tween.onComplete.add(function(particleSprite) {
                particleSprite.destroy();
            });
            // Tweener.moveTo(this.blocks[key], 0, Math.random() * this.game.global.windowHeight * window.devicePixelRatio, 0, 500 + Math.random() * 300, Phaser.Easing.Quadratic.InOut);

        }

        this.generateSmoke();
    }

    generateSmoke() {

        for (var i = 0; i < 50; i++) {
            var smoke = new CustomSprite(this.game, {
                src: 'smoke',
                container: 'smoke',
                anchor: {
                    x: 0.5,
                    y: 0.5,
                }
            });

            smoke.scale.x *= (1 + Math.random());
            smoke.x = ContainerUtil.getRandomXWithinContainer('smoke');
            smoke.y = ContainerUtil.getRandomYWithinContainer('smoke');

            // this.game.time.events.add(, function() {
            var delay = Math.random() * i * 50;

            Tweener.fadeIn(smoke, delay, 200 + 100 * Math.random(), Phaser.Easing.Linear.None);

            Tweener.moveTo(smoke, smoke.x + smoke.width * (Math.random() - 0.5), -smoke.height, delay, 1000 + Math.random() * 300, Phaser.Easing.Linear.None)
                .onComplete.add(function(e) {
                    e.destroy();
                }, this);
            // }, this);

        }

    }

}

export default Blocks;