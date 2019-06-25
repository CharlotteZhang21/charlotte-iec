/*
===Audio Controller===
Handles audio controls, including muting, playing audios, etc.
//TODO-- multiple audios
*/
class AudioController {

    constructor() {
        this.audios = [];
    }

    /*
    ==Play==
    Plays a specific audio.
    Params: 
     + keyName    can be later used to reference a specific audio
     + audio src
     + args: object with optional arguments to configure how to play the audio (optional)
        + "loop" : bool   audio loops if true
    */
    play(keyName, src, args) {
        if (this.audios[keyName] == null) {
            this.audios[keyName] = new Audio(src);
        }
        this.initAudioArgs(keyName, args);
        this.audios[keyName].play();
        if (args !== undefined && args.volume !== undefined)
            this.audios[keyName].volume = args.volume;
    }

    fadeOut(keyName) {
        if (this.audios[keyName] != null)
            this.audios[keyName].fadeOut();
    }

    /*
    Pauses a specific audio by keyname
    */
    pause(keyName) {
        // console.log("PAUSING AUDIO");
        if (this.audios[keyName] != null) {
            this.audios[keyName].pause();
        }
    }

    /*
    Mutes a specific audio by keyname
    */
    mute(keyName) {
        if (this.audios[keyName] != null)
            this.audios[keyName].muted = true;
    }

    /*
    Mutes and pauses all audios that have been playing or are playing on the IEC
    */
    muteAll() {
        for (var key in this.audios) {
            if (this.audios.hasOwnProperty(key)) {
                this.audios[key].pause();
                this.audios[key].muted = true;
            }
        }
    }

    unmuteAll() {
        for (var key in this.audios) {
            if (this.audios.hasOwnProperty(key)) {
                this.audios[key].muted = false;
            }
        }
    }

    /*
    Processes and loads video args into class settings
    */
    initAudioArgs(keyName, args) {
        this.audios[keyName].muted = false;
        this.audios[keyName].autoplay = true;
        if (args !== undefined) {
            if (args.loop !== undefined && typeof args.loop == 'boolean') {
                this.audios[keyName].loop = args.loop;
            }
        }
    }

}

export default AudioController;