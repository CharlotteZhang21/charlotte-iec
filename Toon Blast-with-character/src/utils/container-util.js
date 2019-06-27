export function bestFit(object, containerName, anchorX = 0, anchorY = 0) {

    checkContainerExists(containerName);

    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    if (object.anchor !== undefined) {
        object.anchor.x = anchorX;
        object.anchor.y = anchorY
    }

    object.x = containerX + containerWidth * anchorX;
    object.y = containerY + containerHeight * anchorY;

    var initialScale = object.scale.x;

    object.scale.x = containerWidth / (object.width / object.scale.x);
    object.scale.y = object.scale.x;

    if (object.height > containerHeight) {
        object.scale.x = initialScale;
        object.scale.y = initialScale;

        object.scale.y = containerHeight / (object.height / object.scale.y);
        object.scale.x = object.scale.y;
    }

}

function checkContainerExists(containerName) {
    if (document.getElementById(containerName) == null) {
        console.log("ERROR: Container Name " + containerName + " doesn't exist in the DOM");
    }
}

export function fitInContainer(object, containerName, anchorX = 0, anchorY = 0) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    if (object.anchor !== undefined) {
        object.anchor.x = anchorX;
        object.anchor.y = anchorY
    }

    object.x = containerX + containerWidth * anchorX;
    object.y = containerY + containerHeight * anchorY;
    object.scale.x = containerWidth / (object.width / object.scale.x);
    object.scale.y = object.scale.x;
}

export function fitInContainerHeight(object, containerName, anchorX = 0, anchorY = 0) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    if (object.anchor != undefined)
        object.anchor.set(anchorX, anchorY);

    object.x = containerX + containerWidth * anchorX;
    object.y = containerY + containerHeight * anchorY;
    object.scale.y = containerHeight / object.height;
    object.scale.x = object.scale.y;
}

export function fitInContainerAnchorAtCenter(object, containerName) {
    fitInContainer(object, containerName);
    object.x += object.width / 2;
    object.y += object.height / 2;
}

export function getContainerY(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    return container.getBoundingClientRect().top * window.devicePixelRatio;
}

export function getContainerX(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    return container.getBoundingClientRect().left * window.devicePixelRatio;
}

export function getContainerWidth(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    return container.offsetWidth * window.devicePixelRatio;
}

export function getContainerHeight(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    return container.offsetHeight * window.devicePixelRatio;
}


export function resizeToSizeOfContainer(object, containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    object.scale.x = containerWidth / object.width;
    object.scale.y = object.scale.x;
}

export function getRandomXWithinContainer(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    return containerX + Math.random() * containerWidth;
}

export function getRandomYWithinContainer(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    return containerY + Math.random() * containerHeight;
}

export function getXCenterWithinContainer(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    return containerX + containerWidth / 2;
}


export function getYCenterWithinContainer(containerName) {
    checkContainerExists(containerName);
    var container = document.getElementById(containerName);
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;
    return containerY + containerHeight / 2;
}


export function getWorldCentre(game) {
    var centre = {};
    centre.x = game.global.windowWidth / 2;
    centre.y = game.global.windowHeight / 2;
    if (game.world.angle == -90) { //It's been rotated!!!
        var aux = centre.x;
        centre.x = centre.y;
        centre.y = aux
        
    }
    return centre;

}

export function getWorldPos(game, originalX, originalY) {
    var pos = {};
    pos.x = originalX;
    pos.y = originalY;
    if (game.world.angle == -90) {
        var aux = pos.x;
        pos.x = pos.y;
        pos.y = aux;
    }
    return pos;
} 