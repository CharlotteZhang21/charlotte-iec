var app, envReady = false;

if (typeof (actionClicked) !== "function") {
    var actionClicked = window.actionClicked = function(action){
        console.log("%cUser action: %s", "color: #FF00FF;", action);
    }
}

function doSomething(s) {
    return actionClicked(s);
}

try {
    if (mraid.getState() === "loading") {
        mraid.addEventListener("ready", mraidReadyHandler);
    }
    else {
        mraidReadyHandler();
    }
}
catch (e) {
    if (e.name === "ReferenceError") {
        // mraid is not defined
        window.addEventListener("load", domReadyHandler);
    }
}

function domReadyHandler() {
    window.removeEventListener("load", domReadyHandler);
    envReady = true;
    checkRun();
}

function mraidReadyHandler() {
    mraid.removeEventListener("ready", mraidReadyHandler);
    if (mraid.isViewable()) {
        return mraidViewableHandler(true);
    }
    mraid.addEventListener("viewableChange", mraidViewableHandler);
}

function mraidViewableHandler(flag) {
    if (flag) {
        mraid.removeEventListener("viewableChange", mraidViewableHandler);
        envReady = true;
        checkRun();
    }
}

window.viewportSize = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
};
function resize() {
    if (MainGame && MainGame.instance) {
        //app.resize(window.innerWidth, window.innerHeight);
        fitLayout();
   }
}

function initListeners() {
    window.addEventListener("resize", function(){
        window.viewportSize = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
        resize();
    });
    mraid.addEventListener("stateChange", function(state){
        if (state === "expanded") {
            //app.run();
			app = new Game();
            resize();
        }
    });
    mraid.addEventListener("sizeChange", function(width, height){
        console.log("MRAID sizeChange", arguments);
        window.viewportSize = {
            width: width,
            height: height
        };
        resize();
    });
    mraid.addEventListener("viewableChange", function(){
        console.log("MRAID viewableChange", arguments);
        resize();
    });
    mraid.addEventListener("error", function(){
        console.log("MRAID error", arguments);
    });
}

function checkRun() {
    if (envReady /*&& app*/) {
        try {
            initListeners();
            // mraid.useCustomClose(true);
            mraid.expand();
            app = new Game();
        }
        catch (e) {
            // mraid is not defined
            //app.run();
			app = new Game();
        }
        finally {
            // resize();
        }
    }
}

