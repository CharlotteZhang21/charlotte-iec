import Counter from '../prefabs/counter';
import * as Tweener from '../utils/tweener';

/*
===Video Playable Timer===
Creates and controls a timer on autoplay branched moments.
*/
class VideoPlayableTimer extends Phaser.Group {

    constructor(game) {

        super(game);
        this.timerHud = new Counter(this.game, {
            'tag': 'video-playable-timer',
            'htmlTag': 'video-playable-timer',
            'backgroundSrc': 'timer',
            'style': 'circle_progressbar',
            'initialValue': 100,
            'maxValue': 100,
            'minValue': 0,
        });
        this.add(this.timerHud);
        this.initialScale = this.timerHud.scale.x;

        this.enabled = false;
        this.lastXSeconds = 1;

        this.timerHud.alpha = 0;

        this.game.time.events.loop(Phaser.Timer.SECOND / 100, this.updateTimer, this);
    }

    startTimer(delay, countdown) {

        this.resetTimer();
        this.popIn(delay);

        this.game.time.events.add(delay, function() {
            this.enabled = true;
            this.startTime = new Date();
            this.countdownTime = countdown;
            this.elapsedTime = 0;
        }, this);

    }

    resetTimer() {
        this.pulsating = false;
    }

    stopTimer() {
        this.popOut();
        this.enabled = false;
    }

    updateTimer() {

        if (this.elapsedTime < this.countdownTime && this.enabled) {

            var currentTime = new Date();
            var timeDifference = this.startTime.getTime() - currentTime.getTime();
            this.elapsedTime = Math.abs(timeDifference / 1000);
            var timeRemaining = this.countdownTime - this.elapsedTime;

            if (timeRemaining > 0)
                this.timerHud.setCircleBarTo(this.getCompletionValue(timeRemaining));

            if (timeRemaining < this.lastXSeconds * 2) {
                if (!this.pulsating)
                    this.pulsate(this.lastXSeconds);
            }
            if (timeRemaining <= 0)
                this.stopTimer();
        }
    }

    getCompletionValue(timeRemaining) {
        if (timeRemaining > (this.lastXSeconds * 2)) {
            return (timeRemaining - this.lastXSeconds) / (this.countdownTime - this.lastXSeconds) * 100;
        } else {
            return (timeRemaining) / ((this.countdownTime - this.lastXSeconds) * 2) * 100;
        }
    }

    popIn(delay) {

        this.game.time.events.add(Math.max(0, delay - 500), function() {
            this.timerHud.setCircleBarTo(105);
            this.removeTween();
            this.restartScale();
            this.tween = Tweener.scaleIn(this.timerHud, 0, 500, Phaser.Easing.Elastic.Out);
            this.timerHud.alpha = 1;
        }, this);
    }

    popOut() {
        this.removeTween();
        this.tween = Tweener.scaleOut(this.timerHud, 0, 500, Phaser.Easing.Elastic.In);
    }

    pulsate(seconds) {

        this.removeTween();
        this.restartScale();

        this.pulsating = true;
        this.tween = this.game.add.tween(this.timerHud.scale).to({
            x: 1.1,
            y: 1.1,
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).repeat(seconds).yoyo(true);
    }

    restartScale() {
        this.timerHud.scale.x = this.initialScale;
        this.timerHud.scale.y = this.initialScale;
    }

    removeTween() {
        if (this.tween)
            this.game.tweens.remove(this.tween);
    }

}

export default VideoPlayableTimer;