/**
 * Created by Programmer on 30.08.2017.
 */
function PointsUI(){
    PIXI.Container.call(this);
    PointsUI.instance = this;

    this.maxPoints = max_points;
    this.points = 0;
    

    this.pointsText = new PIXI.Text(this.points, {
        fontFamily: "GameFont",
        fontSize: 48,
        fill: 0xffffff,
        align: 'center',
        lineHeight: '65'
    });
    
    this.pointsText.anchor.set(0.5);
    this.addChild(this.pointsText);
    
}

PointsUI.constructor = PointsUI;
PointsUI.prototype = Object.create(PIXI.Container.prototype);

PointsUI.prototype.updatePointsText = function(){
    this.pointsText.setText(MainGame.instance.field.points);
}

PointsUI.prototype.checkWin = function(){
    if ((MainGame.instance.field.points >= PointsUI.instance.maxPoints) && !PointsUI.instance.win){
        // MainGame.instance.gameData.gameOver();
        PointsUI.instance.win = true;
        MainGame.instance.field.showWin(false);
    }
}


