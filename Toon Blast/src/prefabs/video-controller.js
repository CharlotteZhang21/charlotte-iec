/*
===Video Controller===
Handles video controls, including playing a video, pausing a video, changing the video source, etc.
-- Doesn't understand anything about the logic behind transitioning between videos or interactive areas. --
*/
class VideoController {

    constructor(container) {

        this.container = container;
        this.video = document.getElementById(container);

        var sourceElements = document.getElementsByTagName("source");
        if (sourceElements.length == 0)
            this.source = document.createElement('source');
        else
            this.source = sourceElements[0];

        this.video.appendChild(this.source);
        this.video.controls = false;

        this.muted = true;

        this.initSignals();

    }

    initSignals() {
        this.onComplete = new Phaser.Signal();
        this.onLoop = new Phaser.Signal();
        // this.video.onwaiting = function() {
        //     console.log("VIDEO WAITING");
        // };
        // this.video.onplaying = function() {
        //     console.log("VIDEO PLAYING");
        // };
    }

    /*
    ==Play==
    Plays specific video.
    Params:
     + video src
     + args: object with optional arguments to configure how to play the video (optional)
        + "loop" : bool  video loops if true
        + "from" : 1     where does the video start playing from
        + "to" : 2       where does the video pause
    */
    play(src, args) {

        if (this.videoName == undefined || this.videoName != src) {

            this.videoName = src;
            this.source.setAttribute('src', src);
            this.video.load();

            var _this = this;

            this.isReady(function() {

                _this.video.muted = _this.muted;
                _this.video.currentTime = 0;
                _this.video.endTime = 0;
                _this.video.play();
                _this.initVideoArgs(args);
            });
            
        } else {
            this.initVideoArgs(args);
            this.video.play();
        }
    }

    /*
    ==Update loop==
    Should be called from the endcard state.
    */
    update() {
        // console.log("Video Controller update");
        this.video.muted = this.muted;
        if (this.videoEnded()) {
            if (this.video.shouldLoop) {
                this.video.currentTime = this.video.initialTime;
                this.video.play();
                this.onLoop.dispatch();
            } else {
                if (!this.video.paused) {
                    this.video.pause();
                }
                this.onComplete.dispatch();
            }
        }
        if (!this.video.paused && this.videoEnded()) {
            this.video.pause();
            this.onComplete.dispatch();
        }
    }

    isReady(cb) {

        this.canplaythrough = function() {

            // readyState 4 indicates video is ready
            if (this.readyState <= 3) {
                return;
            }

            // unbind canplaythrough event
            this.oncanplaythrough = null;
            return cb();
        };

        this.video.oncanplaythrough = this.canplaythrough;

        // If the video is in the cache of the browser,
        // the 'canplaythrough' event might have been triggered
        // before we registered the event handler.
        if (this.video.readyState > 3) {

            // unbind canplaythrough event
            this.oncanplaythrough = null;

            return cb();
        }
    }

    /*
    Returns if video has ended.
    This includes full-length of video (if no from/to args have been defined), or specified fragment (from/to).
    */
    videoEnded() {
        return this.video.ended || this.video.endTime != 0 && this.video.currentTime >= this.video.endTime;
    }

    /*
    Processes and loads video args into class settings
    */
    initVideoArgs(args) {
        if (args !== undefined) {

            if (args.from !== undefined && args.to !== undefined) {
                this.video.initialTime = args.from;
                this.video.currentTime = args.from;
                this.video.endTime = args.to !== undefined ? args.to : 0;
            } else if (args.from !== undefined) {
                this.video.initialTime = args.from;
                this.video.currentTime = args.from;
                this.video.endTime = 0;
            }
            if (args.loop !== undefined && typeof args.loop == 'boolean') {
                this.video.shouldLoop = args.loop;
            } else {
                this.video.shouldLoop = false;
            }
        }
    }

    unmute() {
        this.muted = false;

    }

    mute() {
        this.muted = true;
    }

    pause() {
        this.mute();
        this.video.pause();
        this.pausedCurrentTime = this.video.currentTime;
    }

    isPaused() {
        return this.video.paused;
    }

    resume() {
        this.unmute();
        if (this.pausedCurrentTime)
            this.video.currentTime = this.pausedCurrentTime;
        this.video.play();
    }


}

export default VideoController;