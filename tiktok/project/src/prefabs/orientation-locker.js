import * as Util from '../utils/util.js';

class OrientationLocker {

    constructor(game, videoOrientation, orientation) {
        this.game = game;
        this.orientationLock = orientation;
        this.videoOrientation = videoOrientation;

        this.windowWidth = document.body.clientWidth;
        this.windowHeight = document.body.clientHeight;
    }

    update() {

        this.aspectRatio = document.body.clientWidth / document.body.clientHeight;

        if (this.orientationLock == "landscape" && Util.isPortrait() || this.orientationLock == "portrait" && !Util.isPortrait()) {

            this.resizeVideoToFillScreenRotated(document.getElementById("videoBg"));
            this.resizeWrapperToFillScreenRotated(document.getElementById("videoBg"), document.getElementById("vpiec-wrap"));
            this.resizeGameToFillScreenRotated();
            parent.postMessage('close-align-left','*');

        } else if (this.orientationLock == "landscape" && !Util.isPortrait() || this.orientationLock == "portrait" && Util.isPortrait()) {

            this.resizeVideoToFillScreenNormal(document.getElementById("videoBg"));
            this.resizeWrapperToFillScreenNormal(document.getElementById("videoBg"), document.getElementById("vpiec-wrap"));
            this.resizeGameToFillScreenNormal();
            parent.postMessage('close-align-right','*');

        } else if (this.videoOrientation != "responsive") {

        //     this.resizeVideoToFillScreenNormal(document.getElementById("videoBg"));
        //     this.resizeWrapperToFillScreen(document.getElementById("videoBg"), document.getElementById("vpiec-wrap"));
        //     this.resizeGameToFillScreenNormal();
        //     document.getElementById("vungle-header").classList.remove("left");

        // } else {

            this.resizeVideoToFillScreenNormal(document.getElementById("videoBg"));
            this.resizeWrapperToFillScreenNormal(document.getElementById("videoBg"), document.getElementById("vpiec-wrap"));
            this.resizeGameToFillScreenNormal();
            parent.postMessage('close-align-right','*');

        }

    }

    resizeGameToFillScreenNormal() {
        this.game.scale.setGameSize(this.getVideoWidth() * window.devicePixelRatio, this.getVideoHeight() * window.devicePixelRatio);
        this.game.scale.refresh();
        this.game.world.angle = 0;
        this.game.world.setBounds(0, 0, this.game.world.bounds.width, this.game.world.bounds.height);
    }

    resizeGameToFillScreenRotated() {
        this.game.scale.setGameSize(this.getVideoHeight() * window.devicePixelRatio, this.getVideoWidth() * window.devicePixelRatio);
        this.game.scale.refresh();
        this.game.world.angle = -90;
        this.game.world.setBounds(0, -this.game.world.bounds.height, this.game.world.bounds.width, this.game.world.bounds.height);
    }

    getVideoWidth() {
        return document.getElementById("vpiec-wrap").offsetWidth;
    }

    getVideoHeight() {
        return document.getElementById("vpiec-wrap").offsetHeight;
    }

    resizeWrapperToFillScreenRotated(video, wrapper) {
        this.resetWrapper(wrapper);
        wrapper.style.width = this.calcVideoHeightRotated(video);
        wrapper.style.height = this.calcVideoWidthRotated(video);
    }

    resizeWrapperToFillScreenNormal(video, wrapper) {
        this.resetWrapper(wrapper);
        wrapper.style.width = this.calcVideoWidthNormal(video);
        wrapper.style.height = this.calcVideoHeightNormal(video);
    }

    resizeWrapperToFillScreen(video, wrapper) {
        this.resetWrapper(wrapper);
        wrapper.style.width = this.windowWidth + "px";
        wrapper.style.height = this.windowHeight + "px";
    }

    calcVideoHeightRotated(video) {
        if (Util.isPortrait()) {
            if (this.aspectRatio > 9 / 16) { //Left and right black bars
                // console.log("1 R");
                if (this.videoOrientation == "landscape") {
                    return video.offsetWidth + "px";
                } else {
                    return (video.offsetHeight * 9 / 16) + "px";
                }
            } else { //Top and bottom black bars
                // console.log("2 R");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetHeight * 16 / 9) + "px"; //We are in portrait, so the video height (vertical measure) is in terms of the width.
                } else {
                    return (video.offsetHeight * 9 / 16) + "px";
                }
            }
        } else {
            if (this.aspectRatio > 16 / 9) {
                // console.log("3 R");
                if (this.videoOrientation == "landscape") {
                    return video.offsetWidth + "px"; //Video is not rotating, so black bars are always right and left. No need to distinguish between 16/9 bigger/smaller
                } else {
                    return video.offsetWidth + "px";
                }
            } else {
                // console.log("4 R");
                if (this.videoOrientation == "landscape") {
                    return video.offsetWidth + "px"; //Video is not rotating, so black bars are always right and left. No need to distinguish between 16/9 bigger/smaller
                } else {
                    return (video.offsetHeight * 9 / 16) + "px";
                }
            }
        }
    }

    calcVideoWidthRotated(video) {
        if (Util.isPortrait()) {
            if (this.aspectRatio > 9 / 16) {
                // console.log("1 R");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetWidth * 9 / 16) + "px";
                } else {
                    return video.offsetHeight + "px";
                }
            } else {
                // console.log("2 R");
                if (this.videoOrientation == "landscape") {
                    return video.offsetHeight + "px"; //We are in portrait, so the video width (horizontal measure) is the height, cause it's rotated
                } else {
                    return video.offsetHeight + "px";
                }
            }
        } else {
            if (this.aspectRatio > 16 / 9) {
                // console.log("3 R");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetWidth * 9 / 16) + "px";
                } else {
                    return (video.offsetWidth * 16 / 9) + "px";
                }
            } else {
                // console.log("4 R");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetWidth * 9 / 16) + "px";
                } else {
                    return video.offsetHeight + "px";
                }
            }
        }
    }

    calcVideoHeightNormal(video) {
        if (Util.isPortrait()) {
            if (this.aspectRatio > 9 / 16) {
                // console.log("1 N");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetWidth * 9 / 16) + "px";
                } else {
                    return video.offsetHeight + "px";
                }
            } else {
                // console.log("2 N");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetWidth * 9 / 16) + "px";
                } else {
                    return video.offsetWidth * 16 / 9 + "px";
                }
            }
        } else {
            if (this.aspectRatio > 16 / 9) {
                // console.log("3 N");
                return video.offsetHeight + "px";
            } else {
                // console.log("4 N");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetWidth * 9 / 16) + "px";
                } else {
                    return video.offsetHeight + "px";
                }
            }
        }
    }

    calcVideoWidthNormal(video) {
        if (Util.isPortrait()) {
            if (this.aspectRatio > 9 / 16) {
                // console.log("1 N");
                if (this.videoOrientation == "landscape") {
                    return video.offsetWidth + "px";
                } else {
                    return video.offsetHeight * 9 / 16 + "px";
                }
            } else {
                // console.log("2 N");
                if (this.videoOrientation == "landscape") {
                    return video.offsetWidth + "px";
                } else {
                    return video.offsetWidth + "px";
                }
            }
        } else {
            if (this.aspectRatio > 16 / 9) {
                // console.log("3 N");
                if (this.videoOrientation == "landscape") {
                    return (video.offsetHeight * 16 / 9) + "px";
                } else {
                    return (video.offsetHeight * 9 / 16) + "px";
                }
            } else {
                // console.log("4 N");
                if (this.videoOrientation == "landscape") {
                    return video.offsetWidth + "px";
                } else {
                    return video.offsetHeight * 9 / 16 + "px";
                }
            }
        }
    }

    resetWrapper(wrapper) {
        wrapper.className = "";
        wrapper.style.top = 0;
        wrapper.style.left = 0;
        wrapper.style.padding = 0;
        wrapper.style.transform = "none";
    }

    resizeVideoToFillScreenNormal(video) {
        video.style.width = this.windowWidth;
        video.style.height = this.windowHeight;
        video.style.transform = "none";
        video.style.top = "0";
        video.style.left = "0";
    }

    resizeVideoToFillScreenRotated(video) {
        video.style.width = this.windowHeight + "px";
        video.style.height = this.windowWidth + "px";
        video.style.transform = "rotate(-90deg)";
        video.style.top = "100%";
        video.style.left = "0";
    }

}

export default OrientationLocker;