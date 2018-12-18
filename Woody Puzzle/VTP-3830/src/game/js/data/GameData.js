function GameData() {

    this.field = new Field();
    this.field.createField();


}

GameData.constructor = GameData;

GameData.prototype.loadAssets = function () {


    this.width = 640;
    this.height = 960;

    this.gameScale = this.width / 640;

    if (this.gameScale > 9 / 16 && this.width > 1200) {
        this.gameScale = 1;
    }

    this.height = this.height / this.gameScale;

    //screen rotation
    this.widthLand = 960;
    this.heightLand = 640;

    this.gameScaleLand = this.widthLand / 960;

    if (this.gameScaleLand > 9 / 16 && this.widthLand > 1200) {
        this.gameScaleLand = 1;
    }

    this.heightLand = this.heightLand / this.gameScaleLand;

};

GameData.prototype.showOverlay = function() {
    // document.getElementById("overlay").style.backgroundColor = 'rgba(0,0,0,0.5)'.replace(/[^,]+(?=\))/, '0.5');
    document.getElementById("overlay").style.backgroundColor = 'rgba(0,0,0,0)'.replace(/[^,]+(?=\))/, '0.5');
}

GameData.prototype.hideOverlay = function() {
    document.getElementById("overlay").style.backgroundColor = 'rgba(0,0,0,0)'.replace(/[^,]+(?=\))/, '0.5');

}

GameData.prototype.showFinalOverlay = function() {
    document.getElementById("overlay").style.backgroundColor = 'rgba(0,0,0,0)'.replace(/[^,]+(?=\))/, '0.5');
    //document.getElementById("overlay").style.display = 'none';
}

/*GameData.prototype.clickGeneric = function () {
    this.click_generic.play();
};

GameData.prototype.explode = function () {
    this.brick_explode.play();
};

GameData.prototype.gameOver = function () {
    this.game_over.play();
};

GameData.prototype.moveFail = function () {
    this.move_fail.play();
};

GameData.prototype.moveSuccess = function () {
    this.move_success.play();
};

GameData.prototype.newBatch = function () {
    this.new_batch.play();
};
*/











