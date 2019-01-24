import VideoPlayableInteractiveElementsController from '../prefabs/video-playable-interactive-elements-controller';
import VideoPlayableCollectibleController from '../prefabs/video-playable-collectible-controller';
import VideoPlayableAudioController from '../prefabs/video-playable-audio-controller';
import VideoController from '../prefabs/video-controller';
import VideoPlayableHudController from '../prefabs/video-playable-hud-controller';
import VideoPlayableVariablesController from '../prefabs/video-playable-variables-controller';
import VideoPlayableTimer from '../prefabs/video-playable-timer';
// import SequenceGame from '../prefabs/sequence-game';
import * as VideoPlayableUtil from '../utils/video-playable-util';
import * as Util from '../utils/util.js';


/*
===State Controller===
Controls current state of the video playable, checks for any required transitions to other states and modifies video accordinly
by usage of Video Controller.
Does so by processing and reading scripts that have been previously defined on the settings.js file
*/
class VideoPlayableStateController {

    constructor(game, container, initialState, scripts, variables) {
        this.game = game;
        this.initialState = initialState;
        this.scripts = scripts;
        this.firstInteraction = false;

        this.videoController = new VideoController(container);
        this.videoPlayableAudioController = new VideoPlayableAudioController(this.game);
        this.interactiveElementsController = new VideoPlayableInteractiveElementsController(this.game, this);
        this.videoPlayableCollectibleController = new VideoPlayableCollectibleController(this.game);
        this.videoPlayableHudController = new VideoPlayableHudController(this.game);
        this.videoPlayableVariablesController = new VideoPlayableVariablesController(variables);


        //TODO - HARDCODED!!!!!
        // this.sequenceMiniGame = new SequenceGame(this.game, this);
        //---------------------------------------------


        this.videoPlayableTimer = (document.getElementById('video-playable-timer') != null) ? new VideoPlayableTimer(this.game) : null;

        this.currentState = this.initialState;

        this.initSignals();
        this.setupController();
    }

    initSignals() {
        this.onStateChange = new Phaser.Signal();
        this.onPlayableComplete = new Phaser.Signal();
    }

    setupController() {
        this.videoController.onLoop.add(function() {
            this.videoPlayableHudController.resetHudList(this.currentState.hud);
            this.videoPlayableAudioController.resetAudio(this.currentState.audios);
        }, this);

        this.videoController.onComplete.add(function() {
            if (this.currentStateHasDirectAutoplay()) {
                this.autoplay();
            }
            if (this.currentStateIsTheEnd()) {
                this.onPlayableComplete.dispatch();
            }
        }, this);

        this.game.input.onUp.add(function() {
            if (!this.firstInteraction) {
                this.firstInteraction = true;
                this.game.time.events.add(500, function() {
                    this.playAudio();
                    this.videoController.unmute();
                }, this);
            }
        }, this);

        this.videoPlayableCollectibleController.onHudCreate.add(function(tag, object) {
            this.videoPlayableHudController.addHudObject(tag, object);
        }, this);
        this.interactiveElementsController.onHudCreate.add(function(tag, object) {
            this.videoPlayableHudController.addHudObject(tag, object);
        }, this);
        this.interactiveElementsController.onInteract.add(function(state = null, consequences = null) {
            if (state != null)
                this.transitionToState(state);
            if (consequences != null)
                this.videoPlayableVariablesController.applyConsequences(consequences);
            if (state == null && consequences == null) {
                if (this.videoController.isPaused())
                    this.videoController.resume();
                else
                    this.videoController.pause();
            }
        }, this);

        this.videoPlayableCollectibleController.onCollectUpdate.add(function(tag, amount) {
            this.videoPlayableVariablesController.setVariable(tag, amount);
        }, this);
        this.videoPlayableVariablesController.onVariableUpdate.add(function(tag, amount) {
            this.videoPlayableCollectibleController.setCollectibleAmount(tag, amount);
        }, this);
    }

    update() {
        this.videoController.update();
        this.interactiveElementsController.update(this.getVideoControllerCurrentTime(), this.videoPlayableVariablesController, this.currentState.interactions);
        this.videoPlayableHudController.update(this.getVideoControllerCurrentTime(), this.currentState.from, this.videoPlayableVariablesController, this.currentState.hud);
        this.videoPlayableCollectibleController.update(this.getVideoControllerCurrentTime(), this.videoPlayableVariablesController, this.currentState.collectibles);
        this.videoPlayableAudioController.update(this.getVideoControllerCurrentTime(), this.currentState.audios)
        // this.sequenceMiniGame.update();
    }

    //Sometimes the first frame returns 0 while loading.
    getVideoControllerCurrentTime() {
        
        return Math.max(this.currentState.from, this.videoController.video.currentTime);
    }

    transitionToState(stateKeyName = "") {
        if (this.videoPlayableTimer != null)
            this.videoPlayableTimer.stopTimer();

        if (stateKeyName != "")
            this.currentState = this.scripts[stateKeyName];

        if (this.currentState == null) {
            console.log("ERROR: '" + stateKeyName + "' video section doesn't exist");
        }

        this.videoPlayableHudController.resetToDefaultHudList(this.currentState.hud);
        this.videoPlayableAudioController.resetToDefaultAudioList(this.currentState.audios);

        var videoPath = PiecSettings.assetsDir + this.currentState.video;

        if (PiecSettings.videoOrientation == "responsive") {
            videoPath = PiecSettings.assetsDir + Util.getOrientation() + ".mp4";
        }

        var from, to;
        if (PiecSettings.videoFramerate !== undefined) {
            var framerate = PiecSettings.videoFramerate;
            from = VideoPlayableUtil.convertFrameToSeconds(this.currentState.from, framerate);
            to = VideoPlayableUtil.convertFrameToSeconds(this.currentState.to, framerate);
        } else {
            from = this.currentState.from;
            to = this.currentState.to;
        }

        console.log("FROM " + from + ", TO " + to);

        this.videoController.play(videoPath, { "from": from, "to": to, "loop": this.currentState.loop });

        if (this.currentStateHasAutoplayTimer() && this.currentState.loop) {
            this.setAutoPlayTimer(this.currentState.autoplay);
        }
        if (this.currentStateHasDirectAutoplay() && this.currentStateHasTimer()) {
            this.setVideoPlayableTimer();
        }

        if(this.currentState.revealCloseButton !== undefined && this.currentState.revealCloseButton == true) {
            parent.postMessage("reveal-close", "*");
        }

    }

    getCurrentStateEarliestInteractionTime() {
        var earliestTime = 1000;
        if (this.currentState.interactions !== undefined && this.currentState.interactions != null) {
            for (var i = 0; i < this.currentState.interactions.length; i++) {
                if (this.currentState.interactions[i].from < earliestTime)
                    earliestTime = this.currentState.interactions[i].from;
            }
        } else {
            earliestTime = this.currentState.from;
        }
        return earliestTime;
    }

    getCurrentStateLatestInteractionTime() {
        var latestTime = this.currentState.to;
        if (this.currentState.interactions !== undefined && this.currentState.interactions != null) {
            for (var i = 0; i < this.currentState.interactions.length; i++) {
                if (this.currentState.interactions[i].to !== undefined && this.currentState.interactions[i].to > latestTime)
                    latestTime = this.currentState.interactions[i].to;
            }
        }
        return latestTime;
    }

    getCurrentStateTimerDuration() {
        if (this.currentStateHasAutoplayTimer())
            return this.currentState.autoplay.after / 1000;
        else
            return this.getCurrentStateLatestInteractionTime() - this.getCurrentStateEarliestInteractionTime()
    }

    currentStateHasTimer() {
        return this.currentState.autoplay !== undefined && this.currentState.autoplay.timer !== undefined && this.currentState.autoplay.timer;
    }

    currentStateHasDirectAutoplay() {
        return this.currentState.autoplay !== undefined && this.currentState.autoplay.script !== undefined;
    }

    currentStateHasAutoplayTimer() {
        return this.currentState.autoplay !== undefined && this.currentState.autoplay.script !== undefined && this.currentState.autoplay.after !== undefined;
    }

    currentStateHasEnabledInteractions() { //We check whether there will be enabled interactions at any point by setting currentTime to a very large number (we can check not only if there are enabled interactions NOW, but also if there will be any in the future)
        return this.interactiveElementsController.areThereEnabledInteractions(10000000, this.videoPlayableVariablesController, this.currentState.interactions);
    }

    currentStateIsTheEnd() {
        // console.log("Current state has enabled interactions? " + this.interactiveElementsController.areThereEnabledInteractions(10000000, this.videoPlayableVariablesController, this.currentState.interactions));
        // console.log("Current state is the end? " + (!this.currentStateHasDirectAutoplay() && (this.currentState.interactions == undefined || this.currentState.interactions.length == 0 || this.currentState.interactions !== undefined && !this.currentStateHasEnabledInteractions())));
        return !this.currentStateHasDirectAutoplay() && (this.currentState.interactions == undefined || this.currentState.interactions.length == 0 || this.currentState.interactions !== undefined && !this.currentStateHasEnabledInteractions());
    }

    autoplay() {
        this.transitionToState(this.currentState.autoplay.script);
    }

    playAudio() {
        this.videoPlayableAudioController.enableAudio();
    }

    pause() {
        this.videoPlayableAudioController.pauseAllAudio();
        this.videoController.pause();
    }

    setAutoPlayTimer(autoplay) {
        var _currentState = this.currentState;
        this.autoplayTimer = this.game.time.events.add(autoplay.after, function() {
            if (this.currentState == _currentState)
                this.autoplay();
        }, this);
    }

    setVideoPlayableTimer() {
        if (this.videoPlayableTimer == null) {
            return;
        }
        var timerDuration = this.getCurrentStateTimerDuration();
        var timerDelay = this.getCurrentStateEarliestInteractionTime() - this.videoController.video.currentTime;

        this.videoPlayableTimer.startTimer(timerDelay * 1000, timerDuration);
    }

}

export default VideoPlayableStateController;