import AudioController from '../prefabs/audio-controller';

class VideoPlayableAudioController {
    constructor(game) {
        this.game = game;

        this.audioController = new AudioController();

        this.canPlay = false;

    }

    enableAudio() {
        // console.log("Audio Can play");
        this.canPlay = true;
    }

    pauseAllAudio() {
        this.audioController.muteAll();
    }

    playAudio(keyName, src, args) {
        if (this.canPlay) {
            this.audioController.play(keyName, src, args);
        }
    }

    pauseAudio(keyName) {
        this.audioController.pause(keyName);
    }

    fadeOutAudio(keyName) {
        this.audioController.fadeOut(keyName);
    }

    resetToDefaultAudioList(audioList) {
        if (audioList !== undefined && audioList != null) {
            for (var i = 0; i < audioList.length; i++) {
                audioList[i].played = false;
            }
        }
    }

    resetAudio(audioList) {
        if (audioList !== undefined && audioList != null) {
            for (var i = 0; i < audioList.length; i++) {
                if (audioList[i].played && !audioList[i].triggerOnce) {
                    this.audioController.pause(audioList[i].tag);
                    audioList[i].played = false;
                }
            }
        }
    }


    update(currentTime, audioList) {
        if (audioList !== undefined && audioList != null) {
            for (var i = 0; i < audioList.length; i++) {

                var shouldBeEnabled = this.checkIfShouldBeEnabled(audioList[i], currentTime);

                if (shouldBeEnabled != null && !audioList[i].played) {
                    if (shouldBeEnabled) {

                        var keyName = audioList[i].tag,
                            src = PiecSettings.assetsDir + audioList[i].src,
                            args = {
                                loop: audioList[i].loop,
                                volume: audioList[i].volume,
                            };
                        this.audioController.play(keyName, src, args);
                    } else {
                        this.audioController.pause(audioList[i].tag);
                    }

                    if (audioList[i].triggerOnce !== undefined && this.canPlay)
                        audioList[i].played = true;

                }

            }
        }
    }

    checkIfShouldBeEnabled(audioElement, currentTime) {


        if (audioElement.at !== undefined && currentTime > audioElement.at) {
            if (audioElement.play && this.canPlay)
                return true;
            else
                return false;
        }
        return null;
    }
}

export default VideoPlayableAudioController;