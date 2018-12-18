MainGame.instance = null;
MainGame.VERSION = "0.1";
MainGame.autoLocalisation = new AutoLocalisation();

function MainGame() {
    MainGame.instance = this;
    this.gameData = new GameData();
    this.timers = [];

}

MainGame.constructor = MainGame;

MainGame.prototype.loadAssets = function () {
    
    this.gameData.loadAssets();


};



MainGame.prototype.log = function (message) {
};


/*MainGame.prototype.newGame = function () {
    console.log('start!');
    
};*/




