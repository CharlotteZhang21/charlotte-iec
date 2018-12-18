function Animations() {
    PIXI.Container.call(this);

}

Animations.constructor = Animations;
Animations.prototype = Object.create(PIXI.Container.prototype);

Animations.prototype.deleteElement = function (element) {
    var delay = 100;
    this.data = {
        element: this,
        scale: 0.6
    }

    new TWEEN.Tween(this.data).to({
        scale: 0
    }, delay).onUpdate(function () {
        element.scale.set(this.scale);
    })
        .onComplete(function () {
            if (element && element.parent) element.parent.removeChild(element);
        })

        .start();
}

Animations.prototype.showCombo = function (element) {

    var delay = 200;
    this.data = {
        element: this,
        x: layout[MainGame.instance.orientation][element.view.key + 'Start'].x,
        alpha: 0
    }

    new TWEEN.Tween(this.data).to({
        x: layout[MainGame.instance.orientation][element.view.key].x,
        alpha: 1
    }, delay).onUpdate(function () {
        element.position.x = this.x;
        element.alpha = this.alpha
    })
        .start();
}