/**
 * Created by Programmer on 22.08.2017.
 */

function FinalBoard(fail) {
    PIXI.Container.call(this);

    // MainGame.instance.renderer.backgroundColor = '0xDCDFCA';
    // MainGame.instance.gameData.showFinalOverlay();

    this.logo = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('logo')));
    this.logo.key = "final_logo";
    this.logo.anchor.set(0.5);


    this.download_btn = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('download_btn')));
    this.download_btn.key = "final_download_btn";
    this.download_btn.anchor.set(0.5);

    if (fail) {
        this.retry_btn = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('retry_btn')));
        this.retry_btn.key = "retry_btn";
        this.retry_btn.anchor.set(0.5);
        this.retry_btn.interactive = true;
        this.retry_btn.on('pointerdown', FinalBoard.prototype.restartGame);
    } else {
        this.continue_btn = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('download_btn')));
        this.continue_btn.key = "final_continue_btn";
        this.continue_btn.anchor.set(0.5);
        this.continue_btn.interactive = true;
        this.continue_btn.on('pointerdown', FinalBoard.prototype.continueGame);

        this.continueText = new PIXI.Text('Continue', {
            fontFamily: "GameFont_bold",
            fontSize: 64,
            fill: 0xFFFFFF,
            align: 'center',
            lineHeight: '65'
        });
        this.continueText.anchor.set(0.5);
        // this.continueText.key = 'final_continue_text';
        this.continue_btn.addChild(this.continueText);
    }


    this.download_btn = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('download_btn')));
    this.download_btn.key = "final_download_btn";
    this.download_btn.anchor.set(0.5);
    this.download_btn.interactive = true;
    this.download_btn.on('click', function () {
        doSomething('download');
    })

    this.download_btn.on('tap', function () {
        doSomething('download');
    })


    this.downLoadText = new PIXI.Text('Download', {
        fontFamily: "GameFont_bold",
        fontSize: 86,
        fill: 0xFFFFFF,
        align: 'center',
        lineHeight: '65'
    });
    this.downLoadText.anchor.set(0.5);
    this.downLoadText.key = 'final_download_text';
    this.addChild(this.downLoadText);

    var download_pic = new PIXI.Sprite(PIXI.Texture.fromImage('download_pic'));
    download_pic.key = 'final_download_pic';
    this.addChild(download_pic);
    download_pic.anchor.set(0.5);

    this.leaveLeft = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('leaves')));
    this.leaveLeft.key = 'final_leave_left';
    this.leaveLeft.anchor.set(0.5);

    this.leaveRight = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('leaves')));
    this.leaveRight.key = 'final_leave_right';
    this.leaveRight.anchor.set(0.5);

    this.wellDone = new PIXI.Text('Well done!', {
        fontFamily: "GameFont_bold",
        fontSize: 86,
        fill: 0xFFFFFF,
        align: 'center',
        lineHeight: '65'
    });
    this.wellDone.key = "wellDone";
    this.wellDone.anchor.set(0.5);


    this.addChild(this.wellDone);

    this.scoreWord = new PIXI.Text('Score', {
        fontFamily: "GameFont_bold",
        fontSize: 48,
        fill: 0xffffff,
        align: 'center',
        lineHeight: '65'

    });

    this.scoreWord.anchor.set(0.5);
    this.scoreWord.key = 'final_score_word';
    this.addChild(this.scoreWord);

    this.pointsText = new PIXI.Text(MainGame.instance.field.points, {
        fontFamily: "GameFont",
        fontSize: 82,
        fill: 0xFFFFFF,
        align: 'center',
        lineHeight: '65'
    });
    this.pointsText.key = "final_pointsText";
    this.pointsText.anchor.set(0.5);
    this.addChild(this.pointsText);
}

FinalBoard.constructor = FinalBoard;
FinalBoard.prototype = Object.create(PIXI.Container.prototype);

FinalBoard.prototype.restartGame = function () {
    MainGame.instance.field.removeChildren();
    // console.log(MainGame.instance.displayObj.children, MainGame.instance.displayObjBlock.children);
    MainGame.instance.displayObj.removeChildren();
    //MainGame.instance.displayObjBlock.removeChildren();

    MainGame.instance.tutorial = null;


    MainGame.instance.gameData.field.fieldUI = [];
    MainGame.instance.gameData.field.fieldMatrix = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    ]


    MainGame.instance.field.addFieldChildren();
    MainGame.instance.field.addStartElementsOnField();

    MainGame.instance.field.points = 0;
    MainGame.instance.time = MainGame.instance.field.addChild(new Time());

    rotateGame();
}

FinalBoard.prototype.continueGame = function () {
    MainGame.instance.field.removeChildren();
    MainGame.instance.field.finalBoard = null;

    if (MainGame.instance.tutorial) {
        MainGame.instance.tutorial = null;
        MainGame.instance.field.elementsDesk.removeChildren();
        MainGame.instance.field.elementsDesk = MainGame.instance.field.addChild(new ElementsDesk());

    }

    for (var i = 0; i < MainGame.instance.saveContainer.children.length; i) {
        MainGame.instance.saveContainer.children[i].setParent(MainGame.instance.field);
    }
    


    MainGame.instance.time.removeChildren();


    
    rotateGame();
}



