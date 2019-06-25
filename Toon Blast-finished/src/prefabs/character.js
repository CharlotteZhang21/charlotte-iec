import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer';

class Character extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.createCharacter();

        this.initSignals();

    }

    initSignals() {
        // this.onAnimationFinish = new Phaser.Signal();
    }

    createCharacter(status) {


        this.fox[status] = CustomPngSequencesRenderer.playPngSequence(this.game, 'fox-' + status, this, this.resetStatus),


        this.add(this.fox[status]);



        this.fox[status].x -= this.fox[status].width / 2;
        this.fox[status].y -= this.fox[status].height / 2;


    }

}

export default Character;