import OrientationLocker from '../prefabs/orientation-locker';
import VideoPlayableStateController from '../prefabs/video-playable-state-controller';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth * window.devicePixelRatio;
        this.game.global.windowHeight = document.body.clientHeight * window.devicePixelRatio;

        this.orientationLock();

        this.game.onSDKCall.add(this.mute, this);
        this.game.onResize.add(this.resize, this);

        this.game.stage.disableVisibilityChange = true;

        this.videoPlayableStateController = new VideoPlayableStateController(this.game, "videoBg", PiecSettings.script[PiecSettings.initialScript], PiecSettings.script, PiecSettings.variables);
        this.videoPlayableStateController.transitionToState(PiecSettings.initialScript);

        this.setupController();
    }

    setupController() {
        this.videoPlayableStateController.onPlayableComplete.add(function() {
            if (!this.gameCompleteFired) {
                this.onGameComplete();
                this.gameCompleteFired = true;
            }
        }, this);
    }

    resize() {
        if (this.orientationLocker != null) {
            this.orientationLocker.update();
        }
    }

    render() {}

    update() {
        this.videoPlayableStateController.update();
    }

    mute() {
        this.videoPlayableStateController.pause();
    }

    onGameComplete() {
        if (PiecSettings.asoiTimer !== undefined) {
            this.game.time.events.add(PiecSettings.asoiTimer, function() {
                parent.postMessage("complete", "*");
            }, this);
        } else {
            parent.postMessage("complete", "*");
        }
    }

    orientationLock() {
        var orientation = PiecSettings.orientationLock !== undefined ? PiecSettings.orientationLock : "none";
        var videoOrientation = PiecSettings.videoOrientation !== undefined ? PiecSettings.videoOrientation : "none";

        this.orientationLocker = new OrientationLocker(this.game, videoOrientation, orientation);
        this.orientationLocker.update();
    }

}

export default Endcard;