export function checkIfShouldBeEnabled (to, from, currentTime) {
    if (to !== undefined && currentTime > to) {
        return false;
    }
    if (from !== undefined && currentTime >= from) {
        return true;
    }
    return false;
}


export function convertFrameToSeconds (framenumber, framerate) {
    var wholePart = Math.floor(framenumber);
    var decimalPart = framenumber % 1;

    return wholePart + Math.round((decimalPart * 100 / framerate) * 100)/100;
}

export function timeOrFramerateInSeconds(time) {
    if (PiecSettings.videoFramerate !== undefined) {
        var framerate = PiecSettings.videoFramerate;
        time = convertFrameToSeconds(time, framerate);
    }
    return time;
}