"use strict";

class Actions {

    constructor(view3d, characters) {
        this.view3d = view3d;
        this.characters = characters;
        let self = this;
        this.actionsDiv = document.querySelector("#actions");
        let button = document.querySelector("#before-button");
        button.addEventListener("click", function () {
            self.view3d.replaceCharacter(self.characters.getPreviousCharacter());
            self.updateActions(self.characters.getCurrent());
        });
        button = document.querySelector("#next-button");
        button.addEventListener("click", function () {
            self.view3d.replaceCharacter(self.characters.getNextCharacter());
            self.updateActions(self.characters.getCurrent());
        });
    }

    updateActions(gltf) {
        this.removeChildren();
        let self = this;
        for (let animationClip of gltf.animations) {
            let button = document.createElement("button");
            button.innerHTML = animationClip.name;
            button.classList.add("action");
            button.addEventListener("click", function () {
                self.view3d.replaceAnimation(animationClip);
            });
            this.actionsDiv.appendChild(button);
        }
    }

    removeChildren() {
        let actionsDivClone = this.actionsDiv.cloneNode(false);
        this.actionsDiv.parentNode.replaceChild(actionsDivClone, this.actionsDiv);
        this.actionsDiv = actionsDivClone;
    }
}