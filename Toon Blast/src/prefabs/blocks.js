import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
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
        // this.onAnimationFinish = new Phaser.Signal();
    }


    createRandomBlocks() {
        var block;

        var size = PiecSettings.blockArraySize;

        this.maxCol = size.length;


        this.maxRow = Math.max.apply(null, size);


        for (var j = 0; j < size.length; j++) {

            for (var i = this.maxRow; i > this.maxRow - size[j]; i--) {

                block = new Phaser.Sprite(this.game, 0, 0, 'block_' + PiecSettings.blocks[Math.floor(Math.random() * 6)]);
                this.add(block);

                ContainerUtil.fitInContainer(block, 'fixed-block-1', 0, 0);

                //j is col, i is row

                var leftBlockCoor, bottomBlock;

                block.x = block.width * j;
                block.y = block.height * i;


                if (i < this.maxRow) {

                    bottomBlock = i + 1;
                    block.y = this.blocks[j + ',' + bottomBlock].y - this.blocks[j + ',' + bottomBlock].height * 0.9;
                } else {
                    block.y = 0;
                }


                if (j > 0) {

                    leftBlockCoor = j - 1;
                    if (this.blocks[leftBlockCoor + ',' + i] != undefined)
                        block.x = this.blocks[leftBlockCoor + ',' + i].x + this.blocks[leftBlockCoor + ',' + i].width;
                    else {
                        block.x = this.blocks[j + ',' + this.maxRow].x;
                    }
                } else {
                    block.x = 0;
                }



                block.scale.x = (1 - Math.abs(j - size.length / 2) / 10) * block.scale.x;
                block.scale.y = block.scale.x;

                this.blocks[j + ',' + i] = block;


            }
        }


    }

    animateBlocks(){
        var index = 0;
        for (var key in this.blocks) {
            var block = this.blocks[key];
            var row = key.split(',')[1],
                col = key.split(',')[0];


            if (row <= this.maxRow / 2 || col==0 || (col == (this.maxCol -1) && row < this.maxRow)) {

                var finalY = block.y;
                var finalX = block.x;
                block.y = finalY - this.game.global.windowHeight * window.devicePixelRatio;
                Tweener.moveTo(block, finalX, finalY,  index++ * 100, 800, Phaser.Easing.Quadratic.In);
            }


        }
    }

}

export default Blocks;