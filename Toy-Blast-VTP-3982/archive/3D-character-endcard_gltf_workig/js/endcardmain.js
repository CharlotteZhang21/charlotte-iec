"use strict";

class EndCardMain {

    constructor() {
        this.characters = new Characters();
        this.view3D = new View3D();
        this.actions = new Actions(this.view3D, this.characters);
        this.current = null;
        this.animate = this.animate.bind(this);
        this.startTime = window.performance.now() * 1.0e-3;
    }

    animate() {
        requestAnimationFrame(this.animate);
        if (this.current == null) {
            if (this.characters.getCurrent() != null) {
                this.view3D.replaceCharacter(this.characters.getCurrent());
                this.actions.updateActions(this.characters.getCurrent());
                this.current = this.characters.getCurrent();
            }
        } else {
            this.view3D.updateAndShow();
        }
        this.maybeShowDownload();
    }

    maybeShowDownload() {
        let now = window.performance.now() * 1.0e-3;
        if (now > this.startTime + 5) {
            document.querySelector("#download-button").style.display = "inline-block";
            this.startTime = Number.MAX_VALUE;
        }
    }
}

new EndCardMain().animate();