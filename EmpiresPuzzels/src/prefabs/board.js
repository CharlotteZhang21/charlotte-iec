import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as Tweener from '../utils/tweener';
import * as ParticlesUtil from '../utils/particles-util';

class Board extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.fallSpeed = 200;

        this.args = args;
        this.initSignals();

        this.canPick = true;
        this.pause = false;
        this.candies = [];
        this.autoTriggerCandies = [];
        this.randomUpgrade = [];
        this.removeMap = [];
        this.initBackground(args.board);
        this.initCandies(args.board);


        //customised for E&P
        // this.firstMatch = false;


        this.game.input.onDown.add(this.candySelect, this);
        this.game.input.onUp.add(this.candyDeselect, this);

        this.selectedCandy = null;

        this.resize();

        //moved for E & P
        // if (PiecSettings.helperFeature !== undefined && PiecSettings.helperFeature == true)
        //     this.randomHelper();

        this.createMessage();

        // this.createHand();


        // if (PiecSettings.showPrompt !== undefined && PiecSettings.showPrompt){
        // this.createPrompt();
        // }


        // ====== custom for Empires and puzzles
        this.attackCombo = 0;
    }

    createPrompt() {
        if (PiecSettings.showPrompt == undefined && !PiecSettings.showPrompt) {
            return;
        }
        this.prompt = new CustomText(this.game, {
            "text": "Match and",
            "container": "prompt",
            "anchor": PiecSettings.prompt.anchor,
            "style": PiecSettings.prompt.style,
            "autolocalise": true,
        });

        this.prompt.show();

        var finalScale = this.prompt.scale.x;

        // this.prompt.angleTween = this.game.add.tween(this.prompt).to({
        //     angle: -2,
        // }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        // this.prompt.scaleTween = this.game.add.tween(this.prompt.scale).to({
        //     x: finalScale * 1.1,
        //     y: finalScale * 1.1
        // }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        Tweener.slideInUp(this.prompt, 0, 500, Phaser.Easing.Quadratic.InOut);

        this.game.time.events.add(2000, function() {
            // this.game.tweens.remove(this.prompt.angleTween);
            // this.game.tweens.remove(this.prompt.scaleTween);
            // this.game.add.tween(this.prompt).to({
            //     alpha: 0,
            // }, 100, Phaser.Easing.Quadratic.InOut, true, 100);
            // this.game.add.tween(this.prompt.scale).to({
            //     x: 0.01,
            //     y: 0.01
            // }, 200, Phaser.Easing.Quadratic.InOut, true, 0);

            // Tweener.fadeOut(this.prompt, 0, 500, Phaser.Easing.Quadratic.InOut);
        }, this);

        this.prompt2 = new CustomText(this.game, {
            "text": "Attack!",
            "container": "prompt2",
            "anchor": PiecSettings.prompt.anchor,
            "style": PiecSettings.prompt.style,
            "autolocalise": true,
        });

        this.prompt2.show();

        var finalScale = this.prompt2.scale.x;

        // this.prompt2.angleTween = this.game.add.tween(this.prompt2).to({
        //     angle: -2,
        // }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        // this.prompt2.scaleTween = this.game.add.tween(this.prompt2.scale).to({
        //     x: finalScale * 1.1,
        //     y: finalScale * 1.1
        // }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        Tweener.slideInUp(this.prompt2, 0, 500, Phaser.Easing.Quadratic.InOut);

        this.game.time.events.add(2000, function() {
            // this.game.tweens.remove(this.prompt2.angleTween);
            // this.game.tweens.remove(this.prompt2.scaleTween);
            // this.game.add.tween(this.prompt2).to({
            //     alpha: 0,
            // }, 100, Phaser.Easing.Quadratic.InOut, true, 100);
            // this.game.add.tween(this.prompt2.scale).to({
            //     x: 0.01,
            //     y: 0.01
            // }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
            // Tweener.fadeOut(this.prompt2, 0, 500, Phaser.Easing.Quadratic.InOut);
        }, this);
    }

    createHand() {


        this.hand = new Phaser.Sprite(this.game, 0, 0, 'hand');

        this.add(this.hand);

        ContainerUtil.fitInContainer(this.hand, 'hand', 0, 0);
        this.hand.anchor.set(.1, .1);

        var candy1 = this.candyAt(this.args.hand[0][0], this.args.hand[0][1]);
        var candy2 = this.candyAt(this.args.hand[1][0], this.args.hand[1][1]);

        this.fadeTheRest(candy1, candy2);

        var initialX = candy1.x;
        var initialY = candy1.y;
        var finalX = candy2.x;
        var finalY = candy2.y;
        var initialScale = this.hand.scale.x;

        // console.log(initialY);

        this.hand.x = initialX;
        this.hand.y = initialY;

        this.handAnimationCancelled = false;

        this.game.add.tween(this.hand).to({
            x: finalX,
            y: finalY,
        }, 2000, Phaser.Easing.Quadratic.InOut, true, 0);

        this.hand.positionTween = this.game.add.tween(this.hand).to({
            x: [initialX, initialX, finalX, finalX, initialX],
            y: [initialY, initialY, finalY, finalY, initialY],
            angle: [0, -5, -5, -5, 0],
        }, 2000, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {
            if (!this.handAnimationCancelled) {
                this.hand.positionTween = this.game.add.tween(this.hand).to({
                    x: [initialX, initialX, finalX, finalX, initialX],
                    y: [initialY, initialY, finalY, finalY, initialY],
                    angle: [0, -5, -5, -5, 0],
                    alpha: [1, 1, 1, 1, 1, 0],
                }, 2000, Phaser.Easing.Quadratic.InOut, true, 0);
            }
        }, this);

        this.hand.scaleTween = this.game.add.tween(this.hand.scale).to({
            x: [initialScale, initialScale * .9, initialScale * .9, initialScale, initialScale],
            y: [initialScale, initialScale * .9, initialScale * .9, initialScale, initialScale],
        }, 2000, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {
            if (!this.handAnimationCancelled) {
                this.hand.scaleTween = this.game.add.tween(this.hand.scale).to({
                    x: [initialScale, initialScale * .9, initialScale * .9, initialScale, initialScale],
                    y: [initialScale, initialScale * .9, initialScale * .9, initialScale, initialScale],
                }, 2000, Phaser.Easing.Quadratic.InOut, true, 0);
            }
        }, this);
    }

    fadeTheRest(candy1, candy2) {
        for (var i = 0; i < this.args.board.length; i++) {
            for (var j = 0; j < this.args.board[0].length; j++) {
                if (this.args.board[i][j] != 0 && this.candyAt(j, i) != -1) {
                    if ((i == candy1.row && j == candy1.col) || (i == candy2.row && j == candy2.col)) {
                        continue;
                    }

                    this.candyAt(j, i).tint = 0x666666;
                    // this.game.add.tween(this.candyAt(j, i)).to({
                    //     // alpha: 0.5
                    //     tint: 0x666666,
                    // }, 100, Phaser.Easing.Linear.None, true, 0);
                    // this.candyAt(j, i).alpha = 0.2;
                }

                // this.candyAt(this.args.hand[i][], this.args.hand[0][1]
            }
        }

    }

    fadeBackTheRest() {
        for (var i = 0; i < this.args.board.length; i++) {
            for (var j = 0; j < this.args.board[0].length; j++) {
                if (this.args.board[i][j] != 0 && this.candyAt(j, i) != -1) {
                    // if ((i == candy1.row && j == candy1.col) || (i == candy2.row && j == candy2.col)) {
                    //     continue;
                    // }
                    this.candyAt(j, i).tint = 0xffffff;
                    // this.game.add.tween(this.candyAt(j, i)).to({
                    //     tint: 0xffffff,
                    // }, 100, Phaser.Easing.Linear.None, true, 0);
                    // this.candyAt(j, i).alpha = 0.2;
                }

                // this.candyAt(this.args.hand[i][], this.args.hand[0][1]
            }
        }
    }

    cancelHand() {
        if (!this.hand)
            return;
        if (this.hand.positionTween !== undefined) {
            this.game.tweens.remove(this.hand.positionTween);
            this.handAnimationCancelled = true;
        }
        if (this.hand.scaleTween !== undefined) {
            this.game.tweens.remove(this.hand.scaleTween);
            this.handAnimationCancelled = true;
        }
        this.game.add.tween(this.hand).to({
            alpha: 0,
        }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
    }

    createMessage() {
        this.message = new Phaser.Sprite(this.game, 0, 0, 'sweet');

        this.game.add.existing(this.message);
        ContainerUtil.fitInContainer(this.message, 'message', .5, .5);

        this.message.initialScale = this.message.scale.x;
        this.message.initialY = this.message.y;
        this.message.initialHeight = this.message.height;
        this.message.alpha = 0;
    }

    animateMessage() {
        this.message.alpha = 1;
        this.message.scale.x = .01;
        this.message.scale.y = .01;

        this.message.y = this.message.initialY;

        var randomPick = Math.random();
        var randomMessage = "combo";
        // this.message.loadTexture(randomMessage);

        this.game.add.tween(this.message.scale).to({
            x: this.message.initialScale,
            y: this.message.initialScale,
        }, 500, Phaser.Easing.Back.Out, true, 0);
        this.game.add.tween(this.message).to({
            y: this.message.initialY - this.message.initialHeight,
            alpha: [1, 1, 1, 1, 1, 0],
        }, 800, Phaser.Easing.Quadratic.InOut, true, 200);

        // this.playMessage(randomMessage);

    }


    initSignals() {
        this.onCandySelect = new Phaser.Signal();

        this.onSuccess = new Phaser.Signal();

        //==== customised for empires and puzzles 
        this.onMatch = new Phaser.Signal();

        //==== end empires and puzzles

        this.onRespawnFinished = new Phaser.Signal();

        this.onFirstMatch = new Phaser.Signal();


    }

    randomHelper() {
        this.game.time.events.loop(Phaser.Timer.SECOND * 4, function() {

            if (this.canPick && !this.pause) {

                var candy = this.getRandomCandy();
                if (candy != null && candy != -1 && !candy.fixed && candy.type != "colorbomb" && candy.type != "_paw" && candy.type != "_match4" && candy.type != "_match5")
                    this.upgradeCandy(candy);
            }
        }, this);
    }

    upgradeCandy(candy) {
        var randomUpgrade = Math.floor(Math.random() * 3) + 2;
        // randomUpgrade = Math.random() > .9 ? 5 : randomUpgrade;

        this.randomUpgrade = [];
        this.randomUpgrade[0] = candy.col;
        this.randomUpgrade[1] = candy.row;
        this.randomUpgrade[2] = randomUpgrade;
        this.canPick = false;
        this.handleMatches();
        if (!this.matchInBoard()) {
            this.canPick = true;
        }
        // else
        // this.canPick = true;
    }

    resize() {
        ContainerUtil.fitInContainer(this, this.args.container, 0, 0);

        //custom for Genies & Gems
        if (PiecSettings.foxPathPortrait || PiecSettings.foxPathLandscape) {
            var fox = this.getCandyOnFoxPath(this.foxCurrentAt);
            fox.scale.x = this.getCandyOnFoxPath(this.foxCurrentAt + 1).width * 1.5 / (fox.width / fox.scale.x);
            fox.scale.y = fox.scale.x;

            var chest = this.getCandyOnFoxPath(this.foxPathArray.length - 1);
            chest.scale.x = this.getCandyOnFoxPath(this.foxCurrentAt + 1).width / (fox.width / fox.scale.x);
            chest.scale.y = chest.scale.x;
        }

    }


    initCandies(board) {
        this.canPick = false;
        this.generated = 0;
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {

                if (this.foxPathArray != undefined) {
                    if (i == this.foxPathArray[this.foxCurrentAt].row && j == this.foxPathArray[this.foxCurrentAt].column) {

                        this.createCandy('fox', j, i);

                    } else if (i == this.foxPathArray[this.foxPathArray.length - 1].row && j == this.foxPathArray[this.foxPathArray.length - 1].column) {

                        this.createCandy('chest', j, i);
                    }
                } else {

                    var special = '';

                    if (PiecSettings.foxPathPortrait || PiecSettings.foxPathLandscape) {
                        if (i == Math.floor((board.length) / 2) && j == Math.floor((board[0].length) / 2))
                            special = '_paw';

                    }
                    this.generated++;

                    this.createCandy(board[i][j], j, i, special, true);

                }
            }
        }


        this.onFirstMatch.add(function() {
            this.cancelHand();

            var candy1 = this.candyAt(this.args.hand[0][0], this.args.hand[0][1]);
            var candy2 = this.candyAt(this.args.hand[1][0], this.args.hand[1][1]);
            
            this.swapCandies(candy1, candy2);


            if (PiecSettings.helperFeature !== undefined && PiecSettings.helperFeature == true)
                this.randomHelper();

            if (this.prompt != null && this.prompt.alpha != 0) {
                Tweener.fadeOut(this.prompt, 0, 500, Phaser.Easing.Quadratic.InOut);
                Tweener.fadeOut(this.prompt2, 0, 500, Phaser.Easing.Quadratic.InOut);
            }

        }, this);

        this.onRespawnFinished.add(function() {

            if (!this.pause && !this.finished) {

                if (this.matchInBoard() || this.thereAreAutoTriggerCandies()) {
                    this.game.time.events.add(250, function() {
                        console.log(this.autoTriggerCandies)
                        this.handleMatches();
                    }, this);
                } else {
                    //reset attackCombo
                    this.attackCombo = 0;

                    this.canPick = true;
                    this.animateMessage();

                    var currentCandy = this.getCandyOnFoxPath(this.foxCurrentAt);

                    if (currentCandy != null && currentCandy.id == 'fox' && currentCandy.getPaws() > 0) {
                        this.canPick = false;

                        this.moveFox();


                    }
                }
                this.setSelectedCandiesToNull();
            }
        }, this);


        if (PiecSettings.foxPathPortrait || PiecSettings.foxPathLandscape)
            this.bringToTop(this.getCandyOnFoxPath(this.foxCurrentAt));
    }

    createCandy(id, col, row, special = "", tween = false) {
        var type = special;

        if (id == 0) {
            return;
        }

        if (id == 8) {
            id = "colorbomb";
            type = "colorbomb";
            special = "";
        }
        var src = id;
        src += special;
        // id += special;


        if (id != 'fox' && id != 'chest') { // identify the special candies later
            var candy = new Phaser.Sprite(this.game, 0, 0, src);


            candy.anchor.set(0.5);

            candy.id = id;



        } else if (id == 'fox') {
            var candy = new Fox(this.game);
            ContainerUtil.fitInContainer(candy, 'fox');

            candy.fixed = true;

            candy.id = 'fox';


            candy.onAnimationFinish.add(function() {
                // this.canMove = true;
                if (this.isColorbombMatch() || this.isSpecialCandyMatch() && !this.pause) {

                    this.handleMatches();

                } else {

                    var matchInBoard = this.matchInBoard();

                    if (!this.pause) {
                        if (matchInBoard) {
                            this.game.time.events.add(100, function() {
                                this.playSoundMatch();
                                this.handleMatches();
                            }, this);


                        } else {
                            this.game.time.events.add(100, function() {
                                this.canPick = true;
                            }, this);
                        }
                        this.setSelectedCandiesToNull();
                    }
                }
            }, this);


        } else if (id == 'chest') {
            var candy = new Phaser.Sprite(this.game, 0, 0, 'chest');

            candy.fixed = true;
            candy.anchor.set(0.5);

            candy.id = id;

            // candy.scale.x *= 1.2;
            // candy.scale.y *= candy.scale.x;
        }


        candy.x = this.getTileXFromCol(col);
        candy.y = this.getTileYFromRow(row);


        candy.col = col;
        candy.row = row;

        candy.type = type;
        this.add(candy);
        this.candies[col + "," + row] = candy;

        if (id == "colorbomb") {
            this.idleColorbomb(candy);
        }



        //tween in
        if (tween) {

            var appearDelay = 300 + 100 * Math.floor(Math.abs((this.args.board[0].length - 1) / 2 - candy.col));
            var candyFinalY = candy.y;

            candy.y += candy.height * this.args.board.length;

            this.game.add.tween(candy).to({
                y: [candyFinalY, candyFinalY - candy.height * 0.1, candyFinalY]
            }, 300, Phaser.Easing.Quadratic.In, true, appearDelay).onComplete.add(function() {
                this.generated--;
                if (this.generated <= 0) {
                    this.canPick = true;
                }
            }, this);
        }

        return candy;
    }

    getTileXFromCol(col) {
        return col * this.tileWidth + this.tileWidth / 2;
    }

    getTileYFromRow(row) {
        return row * this.tileWidth + this.tileWidth / 2;
    }

    initBackground(board) {
        var backgroundTile, boardColor;
        this.topRow = [];

        for (var i = 0; i < board.length; i++) {

            for (var j = 0; j < board[0].length; j++) {

                if (board[i][j] != 0) {
                    if (this.topRow[j] == null) {
                        this.topRow[j] = i;
                    }
                    //** customise for genies & gem
                    // if (i % 2 == 0) {
                    //     boardColor = j % 2 == 0 ? 'board-bg-1' : 'board-bg-2';
                    // } else {
                    //     boardColor = j % 2 != 0 ? 'board-bg-1' : 'board-bg-2';
                    // }
                    //**

                    boardColor = 'board-bg';
                    backgroundTile = new Phaser.Sprite(this.game, 0, 0, boardColor);

                    backgroundTile.anchor.set(0.5);

                    backgroundTile.x = (j + 0.5) * backgroundTile.height;
                    backgroundTile.y = (i + 0.5) * backgroundTile.width;
                    this.add(backgroundTile);
                    this.tileWidth = backgroundTile.width;
                }
            }
        }

        //** customise for genies & gem

        if (PiecSettings.foxPathPortrait || PiecSettings.foxPathLandscape)
            this.createFoxPath(board);
    }

    checkDirection(foxPathIndex, i, j) {
        var nextIndex = foxPathIndex + 1;

        if (this.foxPath[nextIndex][0] == i) {
            //check can go left or right

            if (this.foxPath[nextIndex][1] == (j + 1)) {

                //e.g. current point: [2,0] next point: [2,1]    

                return 'r';

            } else if (this.foxPath[nextIndex][1] == (j - 1)) {

                //e.g. current point: [2,1] next point: [2,0]

                return 'l';

            } else {
                console.log("ERROR: foxPath wrong ");
            }

        } else if (this.foxPath[nextIndex][1] == j) {
            //Check can go up or down

            if (this.foxPath[nextIndex][0] == (i + 1)) {

                //e.g current point: [2,1] next point [3,1] 

                return 'd';

            } else if (this.foxPath[nextIndex][0] == (i - 1)) {

                //e.g current point: [2,1] next point [1,1] 

                return 'u';
            }
        }
    }


    candySelect(e) {
        if (this.pause)
            return;

        var x = e.clientX * window.devicePixelRatio * this.game.global.camera.scale.x;
        var y = e.clientY * window.devicePixelRatio * this.game.global.camera.scale.y;


        // this.animateParticlesOnTouch(x, y);
        this.cancelHand();

        if (this.canPick) {

            this.onCandySelect.dispatch();

            this.pickedCandy = this.candyAt(this.getColFromXCoord(x), this.getRowFromYCoord(y));

            if (this.pickedCandy != -1 && !this.pickedCandy.fixed) {
                if (this.selectedCandy == null || this.selectedCandy == undefined) {
                    this.selectedCandy = this.pickedCandy;
                    this.game.input.addMoveCallback(this.candyMove, this);
                } else {

                    if (this.selectedCandy == this.pickedCandy) {
                        this.selectedCandy = null;
                    } else {
                        if (this.areNext(this.pickedCandy, this.selectedCandy)) {
                            this.swapCandies(this.selectedCandy, this.pickedCandy, true);
                        } else {
                            console.log("NOT NEXT TO EACH OTHER");
                            this.selectedCandy = null;
                            this.pickedCandy = null;
                            // this.selectedCandy = this.pickedCandy;
                            // this.game.input.addMoveCallback(this.candyMove, this);
                        }
                    }
                }
            }
        }
    }

    areNext(candy1, candy2) {
        return Math.abs((candy1.row) - candy2.row) + Math.abs(candy1.col - candy2.col) == 1;
    }

    candyDeselect(e) {

        // var x = e.clientX * window.devicePixelRatio;
        // var y = e.clientY * window.devicePixelRatio;
        // this.animateParticlesOnTouch(x, y);
        if (this.pickedCandy != null && this.pickedCandy == this.selectedCandy)
            this.handleOneTapCandies(true, this.pickedCandy);
        this.game.input.deleteMoveCallback(this.candyMove, this);
    }

    candyMove(e, x, y) {
        if (this.canPick && this.selectedCandy != null) {
            var distX = x - this.selectedCandy.world.x;
            var distY = y - this.selectedCandy.world.y;
            var deltaRow = 0;
            var deltaCol = 0;

            if (Math.abs(distX) > this.getGlobalTileSize() / 2) {
                if (distX > 0)
                    deltaCol = 1;
                else
                    deltaCol = -1;

            } else if (Math.abs(distY) > this.getGlobalTileSize() / 2) {
                if (distY > 0) {
                    deltaRow = 1;
                } else {
                    deltaRow = -1;
                }
            }
            if (deltaRow + deltaCol != 0) {
                this.pickedCandy = this.candyAt(this.getColFromXCoord(this.selectedCandy.world.x) + deltaCol, this.getRowFromYCoord(this.selectedCandy.world.y) + deltaRow);
                if (this.pickedCandy != -1 && !this.pickedCandy.fixed) {
                    this.swapCandies(this.selectedCandy, this.pickedCandy, true);
                    this.game.input.deleteMoveCallback(this.candyMove, this);
                }
            }
        }

    }

    swapCandies(candy1, candy2, swapBack) {
        this.canPick = false;
        // this.canMove = true;

        var auxCol = candy1.col;
        var auxRow = candy1.row;
        candy1.col = candy2.col;
        candy1.row = candy2.row;
        candy2.col = auxCol;
        candy2.row = auxRow;


        this.candies[candy1.col + "," + candy1.row] = candy1;
        this.candies[candy2.col + "," + candy2.row] = candy2;


        // ifconsole.log()
        if (candy1.id != 'fox') {

            var candy1Tween = this.game.add.tween(candy1).to({
                x: this.getTileXFromCol(candy1.col),
                y: this.getTileYFromRow(candy1.row),
            }, 300, Phaser.Easing.Quadratic.InOut, true);
        } else {

            var win = false;
            if (candy2.id == 'chest') {
                win = true;
            }
            candy1.addMove(-1);

            var candy1Tween = candy1.moveTo(this.getTileXFromCol(candy1.col), this.getTileYFromRow(candy1.row), 600, 0, this.checkDirection(this.foxCurrentAt - 1, candy2.row, candy2.col), win);
            this.playFoxMove();
        }

        var candy2Tween = this.game.add.tween(candy2).to({
            x: this.getTileXFromCol(candy2.col),
            y: this.getTileYFromRow(candy2.row),
        }, 300, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
            if (candy2.id == 'chest') {
                candy2.destroy();
                this.candies[candy2.col + ',' + candy2.row] = null;

                // this.pause = true;
                this.canPick = false;
            }
        }, this);

        candy1Tween.onComplete.add(function() {

            if (candy1.id == 'fox') {

                // this.getCandyOnFoxPath(this.foxCurrentAt).addMove(-1);

                if (candy1.getPaws() > 0 && this.foxCurrentAt < this.foxPathArray.length - 1) {
                    // this.canMove = false;
                    this.game.time.events.add(500, function() {
                        this.moveFox();
                    }, this);

                }
            } else {

                if (this.isColorbombMatch() || this.isSpecialCandyMatch() && !this.pause) {

                    this.handleMatches();

                } else {

                    var matchInBoard = this.matchInBoard();

                    if (!matchInBoard && swapBack && !this.pause) {
                        this.swapCandies(candy1, candy2, false);
                    } else {
                        if (!this.pause) {
                            if (matchInBoard) {
                                this.game.time.events.add(100, function() {
                                    this.playSoundMatch();
                                    this.handleMatches();
                                }, this);


                            } else {
                                this.game.time.events.add(100, function() {
                                    this.canPick = true;
                                }, this);
                            }
                            this.setSelectedCandiesToNull();
                        }
                    }
                }
            }
            // if (this.canMove) {



            // }

        }, this);
    }

    handleMatches() {
        this.removeMap = [];
        for (var i = 0; i < this.args.board.length; i++) {
            this.removeMap[i] = [];
            for (var j = 0; j < this.args.board[0].length; j++) {
                this.removeMap[i].push(0);
            }
        }

        this.handleRandomUpgrades();
        this.handleAutoTriggerCandies();
        this.handleColorBombMatches();
        this.handleSpecialCandyMatches();
        this.handleHorizontalMatches();
        this.handleVerticalMatches();
        this.destroyCandies();
    }

    handleOneTapCandies(destroyItself, candy) {
        this.removeMap = [];
        for (var i = 0; i < this.args.board.length; i++) {
            this.removeMap[i] = [];
            for (var j = 0; j < this.args.board[0].length; j++) {
                this.removeMap[i].push(0);
            }
        }

        var destroy = 0;
        //customized for E&P 

        if (candy != null) {

            if (candy.type == '_match4') {



                if (destroyItself)
                    this.removeMap[candy.row][candy.col] = 1;


                //get nearby candies
                var topCandy = this.candyAt(candy.col, candy.row - 1);
                if (topCandy != -1 && topCandy.type != '_match4') {
                    this.removeMap[topCandy.row][topCandy.col] = 1;
                    // this.destroyCandy(topCandy, this.removeMap[topCandy.row][topCandy.col]);
                    destroy++;
                }


                var leftCandy = this.candyAt(candy.col - 1, candy.row);
                if (leftCandy != -1 && leftCandy.type != '_match4') {
                    this.removeMap[leftCandy.row][leftCandy.col] = 1;
                    // this.destroyCandy(leftCandy, this.removeMap[leftCandy.row][leftCandy.col]);
                    destroy++;
                }


                var rightCandy = this.candyAt(candy.col + 1, candy.row);
                if (rightCandy != -1 && rightCandy.type != '_match4') {
                    this.removeMap[rightCandy.row][rightCandy.col] = 1;
                    // this.destroyCandy(rightCandy, this.removeMap[rightCandy.row][rightCandy.col]);
                    destroy++;
                }



                var bottomCandy = this.candyAt(candy.col, candy.row + 1);
                if (bottomCandy != -1 && bottomCandy.type != '_match4') {
                    this.removeMap[bottomCandy.row][bottomCandy.col] = 1;
                    // this.destroyCandy(bottomCandy, this.removeMap[bottomCandy.row][bottomCandy.col]);
                    destroy++;
                }

            }
            if (candy.type == '_match5') {

                //because the colorbombCombo is design for matching colorbomb with another candy rather than checking the colorbomb's colour,
                //we need to have a replacement to allow the function to check the candy.id and destroy all of them
                console.log('match5');
                // var targetCandyColourReplacement = candy;
                var targetCandyColourReplacement = Util.clone(candy);
                targetCandyColourReplacement.id = candy.id;
                targetCandyColourReplacement.type = 'replacement';
                this.applyColorBombCombo(candy, targetCandyColourReplacement);
            }
            this.destroyCandies();
        }

        //end customize
        return destroy;

    }

    handleRandomUpgrades() {
        if (this.randomUpgrade.length > 0) {
            this.removeMap[this.randomUpgrade[1]][this.randomUpgrade[0]] = this.randomUpgrade[2];
            this.randomUpgrade = [];
        }
    }

    handleAutoTriggerCandies() {
        if (!this.thereAreAutoTriggerCandies())
            return;
        for (var i = 0; i < this.autoTriggerCandies.length; i++) {

            if (this.autoTriggerCandies[i].type == "_hor")
                this.applyHorizontalCombo(this.autoTriggerCandies[i]);

            else if (this.autoTriggerCandies[i].type == "_ver")
                this.applyVerticalCombo(this.autoTriggerCandies[i]);

            else if (this.autoTriggerCandies[i].type == "_wrap") {
                this.removeMap[this.autoTriggerCandies[i].row][this.autoTriggerCandies[i].col] = 1;
                this.applyWrappedCandyCombo(this.autoTriggerCandies[i].col, this.autoTriggerCandies[i].row);
            } else if (this.autoTriggerCandies[i].type == "_fish") {
                this.removeMap[this.autoTriggerCandies[i].row][this.autoTriggerCandies[i].col] = 1;
                this.applyFishCandyCombo(this.autoTriggerCandies[i]);
            } else if (this.autoTriggerCandies[i].type == "colorbomb") {
                this.removeMap[this.autoTriggerCandies[i].row][this.autoTriggerCandies[i].col] = 1;
                var randomCandy = this.getRandomCandy();
                if (randomCandy != -1)
                    this.applyColorBombCombo(this.autoTriggerCandies[i], randomCandy);
            }
        }
        this.autoTriggerCandies = [];
    }

    handleSpecialCandyMatches() {
        if (this.selectedCandy != null && this.pickedCandy != null && this.isSpecialCandyMatch()) {
            if (this.isStripedStripedMatch()) {
                if (this.selectedCandy.type == "_ver" && this.pickedCandy.type == "_hor") {
                    this.applyHorizontalCombo(this.pickedCandy);
                    this.applyVerticalCombo(this.selectedCandy);
                } else if (this.selectedCandy.type == "_hor" && this.pickedCandy.type == "_ver") {
                    this.applyHorizontalCombo(this.selectedCandy);
                    this.applyVerticalCombo(this.pickedCandy);
                } else if (this.selectedCandy.type == "_ver" && this.pickedCandy.type == "_ver") {
                    this.pickedCandy.type = "_hor";
                    this.applyHorizontalCombo(this.pickedCandy);
                    this.applyVerticalCombo(this.selectedCandy);
                } else if (this.selectedCandy.type == "_hor" && this.pickedCandy.type == "_hor") {
                    this.pickedCandy.type = "_ver";
                    this.applyHorizontalCombo(this.selectedCandy);
                    this.applyVerticalCombo(this.pickedCandy);
                }
            } else if (this.isFishFishMatch()) {
                this.applyFishCandyCombo(this.selectedCandy);
                this.applyFishCandyCombo(this.pickedCandy);
            } else if (this.isWrapWrapMatch()) {
                this.applyWrappedCandyCombo(this.selectedCandy.col, this.selectedCandy.row);
                this.applyWrappedCandyCombo(this.pickedCandy.col, this.pickedCandy.row);
                this.removeMap[this.selectedCandy.row][this.selectedCandy.col] = 1;
                this.removeMap[this.pickedCandy.row][this.pickedCandy.col] = 1;
            } else if (this.isStripedWrapMatch()) {

                this.applyHorizontalCombo(this.selectedCandy, 1.3, false);
                var topCandy = this.candyAt(this.selectedCandy.col, this.selectedCandy.row - 1);
                if (topCandy != -1) {
                    this.applyHorizontalCombo(topCandy, 1.3, false);
                }
                var botCandy = this.candyAt(this.selectedCandy.col, this.selectedCandy.row + 1);
                if (botCandy != -1) {
                    this.applyHorizontalCombo(botCandy, 1.3, false);
                }

                this.applyVerticalCombo(this.selectedCandy, 1.4, false);
                var leftCandy = this.candyAt(this.selectedCandy.col - 1, this.selectedCandy.row);
                if (leftCandy != -1) {
                    this.applyVerticalCombo(leftCandy, 1.4, false);
                }
                var rightCandy = this.candyAt(this.selectedCandy.col + 1, this.selectedCandy.row);
                if (rightCandy != -1) {
                    this.applyVerticalCombo(rightCandy, 1.4, false);
                }
                this.removeMap[this.selectedCandy.row][this.selectedCandy.col] = 1.2;
                this.removeMap[this.pickedCandy.row][this.pickedCandy.col] = 1;

                this.pickedCandy.type = "";

            } else if (this.isStripedFishMatch() || this.isWrapFishMatch()) {
                if (this.selectedCandy.type == "_fish") {
                    this.applyFishCandyCombo(this.selectedCandy, this.pickedCandy.type);
                    this.pickedCandy.type = "";
                    this.removeMap[this.pickedCandy.row][this.pickedCandy.col] = 1;
                } else if (this.pickedCandy.type == "_fish") {
                    this.applyFishCandyCombo(this.pickedCandy, this.selectedCandy.type);
                    this.selectedCandy.type = "";
                    this.removeMap[this.selectedCandy.row][this.selectedCandy.col] = 1;
                }
            } else {
                if (!this.isColorbombMatch()) {
                    //Generic solution when a combo has not been implemented separately
                    this.applyHorizontalCombo(this.selectedCandy);
                    this.applyVerticalCombo(this.selectedCandy);
                }
            }
        }
    }

    isWrapFishMatch() {
        return (this.selectedCandy.type == "_wrap" && this.pickedCandy.type == "_fish") ||
            (this.pickedCandy.type == "_wrap" && this.selectedCandy.type == "_fish");
    }

    isStripedWrapMatch() {
        return ((this.selectedCandy.type == "_hor" || this.selectedCandy.type == "_ver") && this.pickedCandy.type == "_wrap") ||
            ((this.pickedCandy.type == "_hor" || this.pickedCandy.type == "_ver") && this.selectedCandy.type == "_wrap");
    }

    isStripedFishMatch() {
        return ((this.selectedCandy.type == "_hor" || this.selectedCandy.type == "_ver") && this.pickedCandy.type == "_fish") ||
            ((this.pickedCandy.type == "_hor" || this.pickedCandy.type == "_ver") && this.selectedCandy.type == "_fish");
    }

    isStripedStripedMatch() {
        return (this.selectedCandy.type == "_hor" || this.selectedCandy.type == "_ver") &&
            (this.pickedCandy.type == "_ver" || this.pickedCandy.type == "_hor");
    }

    isFishFishMatch() {
        return this.selectedCandy.type == "_fish" && this.pickedCandy.type == "_fish";
    }

    isWrapWrapMatch() {
        return this.selectedCandy.type == "_wrap" && this.pickedCandy.type == "_wrap";
    }

    applyHorizontalCombo(candy, value = 1, repeat = true) {
        var row = candy.row;
        for (var col = 0; col < this.args.board[0].length; col++) {
            var someCandy = this.candyAt(col, row);
            if (someCandy != -1 && repeat) {
                if (someCandy.type == "_fish") {
                    this.applyFishCandyCombo(someCandy, value, false);
                } else if (someCandy.type == "_ver") {
                    this.applyVerticalCombo(someCandy, value, false);
                } else if (someCandy.type == "_wrap") {
                    this.applyWrappedCandyCombo(someCandy.col, someCandy.row, value, false);
                } else if (someCandy.type == "colorbomb") {
                    this.applyColorBombCombo(someCandy);
                }
            }
            this.removeMap[row][col] = value;
        }
    }

    applyVerticalCombo(candy, value = 1, repeat = true) {
        var col = candy.col;
        for (var row = 0; row < this.args.board.length; row++) {
            var someCandy = this.candyAt(col, row);
            if (someCandy != -1 && repeat) {
                if (someCandy.type == "_fish") {
                    this.applyFishCandyCombo(someCandy, value, false);
                } else if (someCandy.type == "_hor") {
                    this.applyHorizontalCombo(someCandy, value, false);
                } else if (someCandy.type == "_wrap") {
                    this.applyWrappedCandyCombo(someCandy.col, someCandy.row, value, false);
                } else if (someCandy.type == "colorbomb") {
                    this.applyColorBombCombo(someCandy);
                }
            }
            this.removeMap[row][col] = value;
        }
    }

    createFoxPath(board) {
        var foxPathGrp = new Phaser.Group(this.game);
        this.add(foxPathGrp);

        var foxPathIndex = 0,
            foxDirection;
        var wayRotation = 0,
            boardColor;
        var previousFoxDirection;
        var foxPathTile;


        this.foxPathArray = [];

        if (Util.isPortrait()) {
            this.foxPath = PiecSettings.foxPathPortrait;
        } else {
            this.foxPath = PiecSettings.foxPathLandscape;
        }

        for (var i = 0; i < board.length; i++) {

            for (var j = 0; j < board[0].length; j++) {

                wayRotation = 0;

                if (foxPathIndex <= this.foxPath.length - 1 && i == this.foxPath[foxPathIndex][0] && j == this.foxPath[foxPathIndex][1]) {

                    boardColor = "way";

                    if (foxPathIndex == 0 || foxPathIndex == this.foxPath.length - 1) {
                        if (previousFoxDirection == null) {
                            foxDirection = this.checkDirection(foxPathIndex, i, j);
                            previousFoxDirection = foxDirection;

                            if (foxDirection == 'l') {
                                wayRotation = 180;
                            } else if (foxDirection == 'u') {
                                wayRotation = 90;
                            } else if (foxDirection == 'd') {
                                wayRotation = 270;
                            }
                        } else {
                            if (foxDirection == 'r') {
                                wayRotation = 180;
                            } else if (foxDirection == 'u') {
                                wayRotation = 270;
                            } else if (foxDirection == 'd') {
                                wayRotation = 90;
                            }

                        }


                        boardColor += "_end";

                    } else {
                        foxDirection = this.checkDirection(foxPathIndex, i, j);

                        if (previousFoxDirection == foxDirection) {
                            boardColor += "_straight";
                            if (foxDirection == 'u' || foxDirection == 'd') {
                                wayRotation = 90;
                            }
                        } else {
                            boardColor += "_turn";

                            var turn = previousFoxDirection + foxDirection;

                            if (turn == 'rd' || turn == 'ul') {

                                wayRotation = 270;

                            } else if (turn == 'ul' || turn == 'rd') {
                                wayRotation = 180;
                            } else if (turn == 'dr' || turn == 'lu') {

                                wayRotation = 90;

                            }
                        }
                    }


                    foxPathTile = new Phaser.Sprite(this.game, 0, 0, boardColor);

                    foxPathTile.anchor.set(0.5);

                    foxPathTile.x = (j + 0.5) * foxPathTile.height;
                    foxPathTile.y = (i + 0.5) * foxPathTile.width;

                    foxPathTile.angle = wayRotation;
                    this.add(foxPathTile);
                    this.tileWidth = foxPathTile.width;

                    foxPathTile.row = i;
                    foxPathTile.column = j;


                    this.foxPathArray.push(foxPathTile);

                    previousFoxDirection = foxDirection;

                    foxPathIndex++;
                }


            }
        }

        this.foxCurrentAt = 0;

    }

    //find the fox candy by checking the path
    getCandyOnFoxPath(foxPathIndex) {

        if (this.foxPathArray != undefined && this.foxPathArray[foxPathIndex] != undefined) {

            return this.candyAt(this.foxPathArray[foxPathIndex].column, this.foxPathArray[foxPathIndex].row);
        } else
            return null;
    }

    applyFishCandyCombo(fishCandy, candyType = "", repeat = true) {

        this.removeMap[fishCandy.row][fishCandy.col] = 1;
        var randomCandy = this.getRandomNonRemovingCandy();

        if (candyType == "_ver") {
            this.applyVerticalCombo(randomCandy, 1.6, repeat);
        } else if (candyType == "_hor") {
            this.applyHorizontalCombo(randomCandy, 1.6, repeat);
        } else if (candyType == "_wrap") {
            this.applyWrappedCandyCombo(randomCandy.col, randomCandy.row, 1.6, repeat);
        }

        if (randomCandy.type != "") {
            if (randomCandy.type == "colorbomb") {
                this.applyColorBombCombo(randomCandy, fishCandy);
            } else if (randomCandy.type == "_hor") {
                this.applyHorizontalCombo(randomCandy, 1.6, false);
            } else if (randomCandy.type == "_ver") {
                this.applyVerticalCombo(randomCandy, 1.6, false);
            } else if (randomCandy.type == "_wrap") {
                this.applyWrappedCandyCombo(randomCandy, 1.6, false);
            }
        }
        if (this.removeMap[randomCandy.row][randomCandy.col] !== undefined && this.removeMap[randomCandy.row][randomCandy.col] != null) {
            this.removeMap[randomCandy.row][randomCandy.col] = 1.6;
            fishCandy.goTo = [];
            fishCandy.goTo.x = randomCandy.x;
            fishCandy.goTo.y = randomCandy.y;
            fishCandy.play = candyType;
        }
    }

    applyColorBombCombo(colorbombCandy, originalCandy = null) {


        if (originalCandy == null) {
            originalCandy = this.getRandomCandy();
            if (originalCandy == -1)
                return;
        }

        if (colorbombCandy.type != originalCandy.type) {

            for (var i = 0; i < this.args.board.length; i++) {
                for (var j = 0; j < this.args.board[0].length; j++) {
                    var candy = this.candyAt(j, i);
                    if (candy != -1 && candy.id == originalCandy.id) {

                        this.removeMap[i][j] = 1.1;
                        candy.rayTo = [];
                        candy.rayTo.x = colorbombCandy.x;
                        candy.rayTo.y = colorbombCandy.y;

                        if (originalCandy.type == "") {
                            if (candy.type == "_ver") {
                                this.applyVerticalCombo(candy, 1.1, false);
                            } else if (candy.type == "_hor") {
                                this.applyHorizontalCombo(candy, 1.1, false);
                            } else if (candy.type == "_wrap") {
                                this.applyWrappedCandyCombo(candy.col, candy.row, 1.1, false);
                            } else if (candy.type == "_fish") {
                                this.applyFishCandyCombo(candy, 1.1, false);
                            }
                        } else if (originalCandy.type == "_hor" || originalCandy.type == "_ver") {
                            var randomHorVer = Math.random() > .5 ? 1 : 0;
                            this.removeMap[i][j] = 2.1 + randomHorVer;
                        } else if (originalCandy.type == "_wrap") {
                            this.removeMap[i][j] = 4.1;
                        } else if (originalCandy.type == "_fish")
                            this.removeMap[i][j] = 6.1;
                    }
                }

            }
        } else {
            for (var i = 0; i < this.args.board.length; i++) {
                for (var j = 0; j < this.args.board[0].length; j++) {
                    var candy = this.candyAt(j, i);
                    if (candy != -1) {
                        this.removeMap[i][j] = 1.1;
                        candy.rayTo = [];
                        candy.rayTo.x = colorbombCandy.x;
                        candy.rayTo.y = colorbombCandy.y;
                        candy.rayTo2 = [];
                        candy.rayTo2.x = originalCandy.x;
                        candy.rayTo2.y = originalCandy.y;

                        if (originalCandy.type == "") {
                            if (candy.type == "_ver") {
                                this.applyVerticalCombo(candy, 1.1, false);
                            } else if (candy.type == "_hor") {
                                this.applyHorizontalCombo(candy, 1.1, false);
                            } else if (candy.type == "_wrap") {
                                this.applyWrappedCandyCombo(candy.col, candy.row, 1.1, false);
                            } else if (candy.type == "_fish") {
                                this.applyFishCandyCombo(candy, 1.1, false);
                            }
                        } else if (originalCandy.type == "_hor" || originalCandy.type == "_ver") {
                            var randomHorVer = Math.random() > .5 ? 1 : 0;
                            this.removeMap[i][j] = 2.1 + randomHorVer;
                        } else if (originalCandy.type == "_wrap") {
                            this.removeMap[i][j] = 4.1;
                        } else if (originalCandy.type == "_fish")
                            this.removeMap[i][j] = 6.1;
                    }
                }
            }
        }
    }

    applyWrappedCandyCombo(wrapComboCol, wrapComboRow, value = 1.5, repeat = true) {
        for (var k = wrapComboRow - 1; k <= wrapComboRow + 1; k++) {
            if (this.candyAt(wrapComboCol - 1, k) != -1) {
                var someCandy = this.candyAt(wrapComboCol - 1, k);
                if (someCandy != -1 && repeat) {
                    if (someCandy.type == "_fish") {
                        this.applyFishCandyCombo(someCandy, value, false);
                    } else if (someCandy.type == "_hor") {
                        this.applyHorizontalCombo(someCandy, value, false);
                    } else if (someCandy.type == "_ver") {
                        this.applyVerticalCombo(someCandy, value, false);
                    } else if (someCandy.type == "colorbomb") {
                        this.applyColorBombCombo(someCandy);
                        // console.log("color bomb calling 1");
                    }
                }
                this.removeMap[k][wrapComboCol - 1] = value;
            }
            if (this.candyAt(wrapComboCol, k) != -1) {
                var someCandy = this.candyAt(wrapComboCol, k);
                if (someCandy != -1 && repeat) {
                    if (someCandy.type == "_fish") {
                        this.applyFishCandyCombo(someCandy, value, false);
                    } else if (someCandy.type == "_hor") {
                        this.applyHorizontalCombo(someCandy, value, false);
                    } else if (someCandy.type == "_ver") {
                        this.applyVerticalCombo(someCandy, value, false);
                    } else if (someCandy.type == "colorbomb") {
                        this.applyColorBombCombo(someCandy);
                        // console.log("color bomb calling 2");
                    }
                }
                this.removeMap[k][wrapComboCol] = value;
            }
            if (this.candyAt(wrapComboCol + 1, k) != -1) {
                var someCandy = this.candyAt(wrapComboCol + 1, k);
                if (someCandy != -1 && repeat) {
                    if (someCandy.type == "_fish") {
                        this.applyFishCandyCombo(someCandy, value, false);
                    } else if (someCandy.type == "_hor") {
                        this.applyHorizontalCombo(someCandy, value, false);
                    } else if (someCandy.type == "_ver") {
                        this.applyVerticalCombo(someCandy, value, false);
                    } else if (someCandy.type == "colorbomb") {
                        this.applyColorBombCombo(someCandy);
                        // console.log("color bomb calling 3");
                    }
                }
                this.removeMap[k][wrapComboCol + 1] = value;
            }
        }
    }

    handleColorBombMatches() {
        if (this.selectedCandy != null && this.pickedCandy != null) {

            if (this.isColorbombMatch()) {
                this.removeMap[this.selectedCandy.row][this.selectedCandy.col] = 1;
                this.removeMap[this.pickedCandy.row][this.pickedCandy.col] = 1;
            }

            if (this.selectedCandy.type == "colorbomb" && this.pickedCandy.type == "colorbomb") {
                this.applyColorBombCombo(this.selectedCandy, this.pickedCandy);
            } else {
                if (this.selectedCandy.type == "colorbomb") {
                    this.applyColorBombCombo(this.selectedCandy, this.pickedCandy);
                }
                if (this.pickedCandy.type == "colorbomb") {
                    this.applyColorBombCombo(this.pickedCandy, this.selectedCandy);
                }
            }
        }
    }

    handleHorizontalMatches() {
        //i rows, j cols
        for (var i = 0; i < this.args.board.length; i++) {
            var colorStreak = 1;
            var currentColor = -1;
            var startStreak = 0;
            var horCombo = [],
                verCombo = [],
                wrapCombo = [],
                fishCombo = [];

            for (var j = 0; j < this.args.board[0].length; j++) {
                if (this.candyAt(j, i).id == currentColor) {
                    colorStreak++;
                }

                if (this.candyAt(j, i).type == "_hor")
                    horCombo.push(this.candyAt(j, i));
                if (this.candyAt(j, i).type == "_ver")
                    verCombo.push(this.candyAt(j, i));
                if (this.candyAt(j, i).type == "_wrap" && this.removeMap[i][j] != 1.2)
                    wrapCombo.push(this.candyAt(j, i));
                if (this.candyAt(j, i).type == "_fish")
                    fishCombo.push(this.candyAt(j, i));

                if (this.candyAt(j, i).id != currentColor || j == this.args.board[0].length - 1) {
                    if (colorStreak >= 3) {
                        this.handleCombosInMatch(horCombo, verCombo, wrapCombo, fishCombo, currentColor);
                    }

                    if (colorStreak >= 5)
                        this.handleHorizontalColorStreakWithSpecialCandy(i, startStreak, colorStreak, 5);

                    // //Matched 4 candies
                    if (colorStreak == 4)
                        this.handleHorizontalColorStreakWithSpecialCandy(i, startStreak, colorStreak, 2);

                    //Matched 3 candies
                    if (colorStreak == 3) {
                        for (var k = 0; k < colorStreak; k++) {
                            if (this.removeMap[i][startStreak + k] < 1)
                                this.removeMap[i][startStreak + k] = 1;
                        }

                    }

                    startStreak = j;
                    colorStreak = 1;

                    currentColor = this.candyAt(j, i).id;

                }
            }
        }
    }

    handleVerticalMatches() {
        //i cols, j rows
        for (var i = 0; i < this.args.board[0].length; i++) {
            var colorStreak = 1;
            var currentColor = -1;
            var startStreak = 0;
            var horCombo = [],
                verCombo = [],
                wrapCombo = [],
                fishCombo = [];

            for (var j = 0; j < this.args.board.length; j++) {

                if (this.candyAt(i, j).id == currentColor) {
                    colorStreak++;
                }

                if (this.candyAt(i, j).type == "_hor")
                    horCombo.push(this.candyAt(i, j));
                if (this.candyAt(i, j).type == "_ver")
                    verCombo.push(this.candyAt(i, j));
                if (this.candyAt(i, j).type == "_wrap")
                    wrapCombo.push(this.candyAt(i, j));
                if (this.candyAt(i, j).type == "_fish")
                    fishCombo.push(this.candyAt(i, j));

                // var fishColorCombo = this.handleFishCombo(i, j, currentColor);
                var fishColorCombo = false;

                if (this.candyAt(i, j).id != currentColor || j == this.args.board.length - 1) {

                    //Match containing a special candies. They need to be triggered too!!!
                    if (fishColorCombo || colorStreak >= 3) {
                        this.handleCombosInMatch(horCombo, verCombo, wrapCombo, fishCombo, currentColor);
                    }

                    if (colorStreak >= 5)
                        this.handleVerticalColorStreakWithSpecialCandy(i, startStreak, colorStreak, 5);

                    if (colorStreak == 4)
                        this.handleVerticalColorStreakWithSpecialCandy(i, startStreak, colorStreak, 3);

                    if (colorStreak == 3) {
                        for (var k = 0; k < colorStreak; k++) {
                            if (this.removeMap[startStreak + k][i] < 1)
                                this.removeMap[startStreak + k][i] = 1;
                        }
                    }

                    this.handleXCombo(i, currentColor, startStreak, colorStreak);

                    startStreak = j;
                    colorStreak = 1;

                    currentColor = this.candyAt(i, j).id;
                }
            }
        }
    }

    handleCombosInMatch(horCombo, verCombo, wrapCombo, fishCombo, currentColor) {
        if (horCombo.length > 0) {
            for (var k = 0; k < horCombo.length; k++) {
                if (horCombo[k].id == currentColor) {
                    this.applyHorizontalCombo(horCombo[k]);
                }
            }
        }

        if (verCombo.length > 0) {
            for (var k = 0; k < verCombo.length; k++) {
                if (verCombo[k].id == currentColor) {
                    this.applyVerticalCombo(verCombo[k]);
                }
            }
        }

        if (wrapCombo.length > 0) {
            for (var k = 0; k < wrapCombo.length; k++) {
                if (wrapCombo[k].id == currentColor) {
                    this.applyWrappedCandyCombo(wrapCombo[k].col, wrapCombo[k].row);
                }
            }
        }

        if (fishCombo.length > 0) {
            for (var k = 0; k < fishCombo.length; k++) {
                if (fishCombo[k].id == currentColor) {
                    this.applyFishCandyCombo(fishCombo[k]);
                }
            }
        }
    }

    getRandomNonRemovingCandy() {
        var randX = Math.floor(Math.random() * this.removeMap[0].length);
        var randY = Math.floor(Math.random() * this.removeMap.length);
        var candy = this.candyAt(randX, randY);

        for (var i = 0; i < 10; i++) {
            var randX = Math.floor(Math.random() * this.removeMap[0].length);
            var randY = Math.floor(Math.random() * this.removeMap.length);
            var candy = this.candyAt(randX, randY);
            if (this.removeMap[randY][randX] == 0 && candy != -1)
                return candy;
        }
        return candy;
    }

    getRandomCandy() {
        var randX = Math.floor(Math.random() * this.args.board[0].length);
        var randY = Math.floor(Math.random() * this.args.board.length);
        var candy;

        if (this.args.board[randY][randX] != 0)
            candy = this.candyAt(randX, randY);


        return candy;
    }

    handleFishCombo(col, row, currentColor) {

        if (currentColor == null || currentColor == undefined)
            currentColor = this.candyAt(col, row).id;

        if (this.candyAt(col, row) != -1 && this.candyAt(col, row).id == currentColor &&
            this.candyAt(col - 1, row) != -1 && this.candyAt(col - 1, row).id == currentColor &&
            this.candyAt(col, row - 1) != -1 && this.candyAt(col, row - 1).id == currentColor &&
            this.candyAt(col - 1, row - 1) != -1 && this.candyAt(col - 1, row - 1).id == currentColor) {} else {
            return false;
        }

        var selectedSlotForSpecialCandy = false;
        for (var i = row - 1; i <= row; i++) {
            for (var j = col - 1; j <= col; j++) {
                if (this.candyAt(j, i) != -1 && this.candyAt(j, i).id == currentColor) {

                    if (this.removeMap && this.removeMap.length > 0)
                        this.removeMap[i][j] = 1;
                    if (this.selectedCandy != null && this.pickedCandy != null && (i == this.selectedCandy.row && j == this.selectedCandy.col ||
                            i == this.pickedCandy.row && j == this.pickedCandy.col)) {
                        if (this.removeMap && this.removeMap.length > 0)
                            this.removeMap[i][j] = 6;
                        selectedSlotForSpecialCandy = true;
                    }
                }
            }
            if (!selectedSlotForSpecialCandy) {
                if (this.removeMap && this.removeMap.length > 0)
                    this.removeMap[row][col] = 6;
            }
        }
        return true;
    }

    handleHorizontalColorStreakWithSpecialCandy(row, startStreak, colorStreak, specialCandyId) {

        var selectedSlotForSpecialCandy = false;

        for (var k = 0; k < colorStreak; k++) {

            this.removeMap[row][startStreak + k] = 1;

            if (this.selectedCandy != null && this.pickedCandy != null && (row == this.selectedCandy.row && (startStreak + k) == this.selectedCandy.col ||
                    row == this.pickedCandy.row && (startStreak + k) == this.pickedCandy.col)) {
                this.removeMap[row][startStreak + k] = specialCandyId;
                selectedSlotForSpecialCandy = true;
            }
        }
        if (!selectedSlotForSpecialCandy)
            this.removeMap[row][startStreak + k - 1] = specialCandyId;
    }

    handleVerticalColorStreakWithSpecialCandy(col, startStreak, colorStreak, specialCandyId) {

        var selectedSlotForSpecialCandy = false;

        for (var k = 0; k < colorStreak; k++) {

            this.removeMap[startStreak + k][col] = 1;

            if (this.selectedCandy != null && this.pickedCandy != null && (col == this.selectedCandy.col && (startStreak + k) == this.selectedCandy.row ||
                    col == this.pickedCandy.col && (startStreak + k) == this.pickedCandy.row)) {
                this.removeMap[startStreak + k][col] = specialCandyId;
                selectedSlotForSpecialCandy = true;
            }
        }
        if (!selectedSlotForSpecialCandy)
            this.removeMap[startStreak + k - 1][col] = specialCandyId;
    }

    handleXCombo(col, currentColor, startStreak, colorStreak) { //x combo (wrapped candy)
        var xCombo = false;
        if (colorStreak >= 3) {
            var selectedSlotForSpecialCandy = false;
            for (var k = 0; k < colorStreak; k++) {
                if (col - 2 >= 0) {
                    if (this.candyAt(col - 1, startStreak + k).id == currentColor && this.candyAt(col, startStreak + k).id == currentColor && this.candyAt(col - 2, startStreak + k).id == currentColor)
                        xCombo = true;
                }
                if (col - 1 >= 0 && col + 1 < this.args.board[0].length) {
                    if (this.candyAt(col - 1, startStreak + k).id == currentColor && this.candyAt(col, startStreak + k).id == currentColor && this.candyAt(col + 1, startStreak + k).id == currentColor)
                        xCombo = true;
                }
                if (col + 2 <= this.args.board[0].length) {
                    if (this.candyAt(col + 1, startStreak + k).id == currentColor && this.candyAt(col, startStreak + k).id == currentColor && this.candyAt(col + 2, startStreak + k).id == currentColor)
                        xCombo = true;
                }
                if (xCombo && this.selectedCandy != null && this.pickedCandy != null && (col == this.selectedCandy.col && (startStreak + k) == this.selectedCandy.row ||
                        col == this.pickedCandy.col && (startStreak + k) == this.pickedCandy.row)) {
                    this.removeMap[startStreak + k][col] = 4;
                    selectedSlotForSpecialCandy = true;
                }
            }
            if (xCombo && !selectedSlotForSpecialCandy)
                this.removeMap[startStreak + k - 1][col] = 4;
        }
    }

    destroyCandies() {


        //====special for genies & gem
        //============================ 

        var candyToClone = [];

        var destroyed = 0;

        for (var i = 0; i < this.args.board.length; i++) {
            for (var j = 0; j < this.args.board[0].length; j++) {
                if (this.removeMap[i][j] >= 1 && this.removeMap[i][j] < 2) {
                    var candy = this.candyAt(j, i);

                    if (candy.fixed) {

                        continue;
                    }
                    if (this.args.board[i][j] == 0) {

                        continue;
                    }

                    var destroyTween;

                    //=========== handle different candy types

                    //Normal candy
                    if (candy.type == "") {
                        destroyTween = this.destroyCandy(candy, this.removeMap[i][j]);
                    } else if (candy.type == "_hor") {
                        destroyTween = this.animateStripedCandy(candy, 0, this.removeMap[i][j]);
                    } else if (candy.type == "_ver") {
                        destroyTween = this.animateStripedCandy(candy, 90, this.removeMap[i][j]);
                    } else if (candy.type == "_wrap") {
                        destroyTween = this.animateWrappedCandy(candy, this.removeMap[i][j]);
                    } else if (candy.type == "_fish") {
                        destroyTween = this.animateFishCandy(candy, this.removeMap[i][j]);
                    } else if (candy.type == "colorbomb") {
                        destroyTween = this.animateColorBomb(candy, this.removeMap[i][j]);
                    } else if (candy.type == "_match4") {
                        destroyed += this.handleOneTapCandies(false, candy);
                        destroyTween = this.destroyCandy(candy, this.removeMap[i][j]);
                        this.candies[j + ',' + i] = null;
                    } else if (candy.type == '_paw') {

                        if (this.getCandyOnFoxPath(this.foxCurrentAt) != null) {

                            this.getCandyOnFoxPath(this.foxCurrentAt).addMove(1);
                        }

                        candyToClone.push(candy);

                        destroyTween = this.destroyCandy(candy, this.removeMap[i][j]);


                    } else {
                        destroyTween = this.destroyCandy(candy, this.removeMap[i][j]);
                    }

                    //======== end of handle different candy types

                    if (destroyTween == null) {
                        if (candy != -1)
                            this.autoTriggerCandies.push(candy);
                    } else {
                        destroyed++;


                        destroyTween.onComplete.add(function(candyObj) {
                            candyObj.destroy();
                            destroyed--;

                            if (destroyed == 0 && !this.pause) {
                                this.attackCombo++;
                                this.makeCandiesFall();
                                this.respawnCandies();
                            }

                            var enemyNum = 0;

                            if (candyObj.col < (this.args.board[0].length / 3)) {
                                enemyNum = 2;

                            } else if (candyObj.col < (this.args.board[0].length / 3 * 2)) {
                                enemyNum = 0;
                            } else {
                                enemyNum = 1;
                            }


                            //triggered in endcard
                            this.onMatch.dispatch(candyObj, enemyNum, -PiecSettings.danmageAttributes[candyObj.id], this.attackCombo);

                        }, this);
                        this.candies[j + "," + i] = null;
                    }


                } else if (this.removeMap[i][j] >= 2 && this.removeMap[i][j] < 3) {
                    //== customized for empires&puzzles
                    this.changeCandyTo(this.candyAt(j, i), "_match4", this.removeMap[i][j]);
                    //== end customized for empires&puzzles

                    //== original code
                    // this.changeCandyTo(this.candyAt(j, i), "_hor", this.removeMap[i][j]);
                } else if (this.removeMap[i][j] >= 3 && this.removeMap[i][j] < 4) {
                    //== customized for empires&puzzles
                    this.changeCandyTo(this.candyAt(j, i), "_match4", this.removeMap[i][j]);

                    //== original code
                    // this.changeCandyTo(this.candyAt(j, i), "_ver", this.removeMap[i][j]);
                } else if (this.removeMap[i][j] >= 4 && this.removeMap[i][j] < 5) {
                    //== customized for empires&puzzles
                    this.changeCandyTo(this.candyAt(j, i), "_match5", this.removeMap[i][j]);

                    //== original code
                    // this.changeCandyTo(this.candyAt(j, i), "_wrap", this.removeMap[i][j]);
                } else if (this.removeMap[i][j] >= 5 && this.removeMap[i][j] < 6) {
                    //== customized for empires&puzzles
                    this.changeCandyTo(this.candyAt(j, i), "_match5", this.removeMap[i][j]);

                    //== original code                    
                    // this.changeCandyTo(this.candyAt(j, i), "colorbomb");
                } else if (this.removeMap[i][j] >= 6 && this.removeMap[i][j] < 7) {
                    //== customized for empires&puzzles
                    this.changeCandyTo(this.candyAt(j, i), "_match5", this.removeMap[i][j]);
                    //== original code
                    //this.changeCandyTo(this.candyAt(j, i), "_fish", this.removeMap[i][j]);
                }

            }
        }

        if (candyToClone.length > 0) {

            var toClone;

            var fox = this.getCandyOnFoxPath(this.foxCurrentAt);

            for (var i = 0; i < candyToClone.length; i++) {
                toClone = candyToClone[i];

                var clone = new Phaser.Sprite(this.game, 0, 0, toClone.id + '_paw');
                clone.x = toClone.x;
                clone.y = toClone.y;
                clone.anchor.set(0.5);
                clone.scale.x = toClone.width / clone.width;
                clone.scale.y = clone.scale.y;

                this.add(clone);

                clone.bringToTop();

                Tweener.scaleAndFlyToGoal(clone, this.getCandyOnFoxPath(this.foxCurrentAt).x, this.getCandyOnFoxPath(this.foxCurrentAt).y, 0, 800, Phaser.Easing.Quadratic.InOut).onComplete.add(function(e) {
                    this.destroyPawAnimation(clone, 0);
                    e.destroy();
                }, this);

            }

            candyToClone = [];


        }
    }

    moveFox() {


        var foxTile, nextFoxTile;

        this.canPick = false;
        // this.canMove = false;

        this.foxCurrentAt++;

        if (this.foxCurrentAt >= this.foxPathArray.length - 1)
            this.foxCurrentAt = this.foxPathArray.length - 1;

        var fox = this.getCandyOnFoxPath(this.foxCurrentAt - 1);

        var nextCandy = this.getCandyOnFoxPath(this.foxCurrentAt);


        if (nextCandy == undefined || nextCandy == -1 || nextCandy == null) {
            return;
        }
        if (nextCandy.id == 'chest') {
            var chestClone1 = new Phaser.Sprite(this.game, 0, 0, 'chest');

            chestClone1.scale.x = nextCandy.width / (chestClone1.width / chestClone1.scale.x);
            chestClone1.scale.y = chestClone1.scale.x;
            chestClone1.anchor.set(0.5);

            chestClone1.x = nextCandy.x;
            chestClone1.y = nextCandy.y;

            // this.game.add.existing(chestClone1);
            this.add(chestClone1);
            this.bringToTop(fox);

            var chestClone2 = new Phaser.Sprite(this.game, 0, 0, 'chest');

            chestClone2.scale.x = nextCandy.width * 1.05 / (chestClone2.width / chestClone2.scale.x);
            chestClone2.scale.y = chestClone2.scale.x;
            chestClone2.anchor.set(0.5);

            chestClone2.x = nextCandy.worldPosition.x;
            chestClone2.y = nextCandy.worldPosition.y;

            chestClone2.alpha = 0;
            this.game.add.existing(chestClone2);


            this.animateChest(chestClone1, chestClone2);



            nextCandy.alpha = 0;

            // fox.setWinTrue();

            this.finished = true;


            this.onSuccess.dispatch();



        }
        // this.game.time.events.add(100, function() {
        this.swapCandies(fox, nextCandy);
        // }, this);




    }

    animateChest(chest, chestClone) {

        var chestInitialScale = chest.scale.x;


        var newChest = new Phaser.Sprite(this.game, 0, 0, 'chest-open');

        ContainerUtil.fitInContainer(newChest, 'chest-final', 0.5, 0.5);

        newChest.alpha = 0;


        this.game.add.existing(newChest);

        this.game.time.events.add(1000, function() {

            this.playAudio('magic_time_appear', {
                loop: false,
                volume: 1,
            })
        }, this);


        var _this = this;

        // this.chestClone = chestClone;


        // Tweener.scaleTo(chest, chestInitialScale * 1.05, chestInitialScale * 1.05, 500, 500, Phaser.Easing.Quadratic.InOut).onComplete.add(function() {
        this.game.time.events.add(800, function() {

            chestClone.alpha = 1;
            chest.alpha = 0;
        }, this)

        Tweener.moveToContainer(chest, 'chest-final', 500, 800, Phaser.Easing.Quadratic.InOut);

        Tweener.moveToContainer(chestClone, 'chest-final', 500, 800, Phaser.Easing.Quadratic.InOut, function(e) {

            newChest.alpha = 1;
            chestClone.alpha = 0;

            newChest.x = chestClone.worldPosition.x;
            newChest.y = chestClone.worldPosition.y;
            var scale = newChest.scale.x;

            e.game.add.tween(newChest.scale).to({
                x: [scale * 0.95, scale * 1.05, scale],
                y: [scale * 1.05, scale * 0.95, scale],
            }, 500, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {
                Tweener.scaleOut(newChest, 1000, 1000, Phaser.Easing.Quadratic.InOut);
            })

            _this.playAudio('chest_opened', {
                loop: false,
                volume: 1,
            })



        }, this);
        // }, this);

    }



    idleColorbomb(candy) {
        if (candy.tween == undefined) {
            this.game.add.tween(candy.scale).to({
                x: 1.1,
                y: 1.1,
            }, 600, Phaser.Easing.Quadratic.InOut, true).loop(true).yoyo(true);
        } else {
            candy.tween.onComplete.add(function() {
                this.game.add.tween(candy.scale).to({
                    x: 1.1,
                    y: 1.1,
                }, 600, Phaser.Easing.Quadratic.InOut, true).loop(true).yoyo(true);
            }, this);
        }
    }

    changeCandyTo(candy, type, variant) {

        if (candy == null || candy == -1) {
            return null;
        }

        var variantDecimal = (variant % 1).toFixed(1);
        var delay = 0;

        if (variantDecimal == .6) { // Destroyed by FISH
            delay = 1050;
            this.autoTriggerCandies.push(candy);
        }

        var changeTween = this.game.add.tween(candy.scale).to({ x: [1.3, 1], y: [1.3, 1], }, 150, Phaser.Easing.Quadratic.InOut, true, delay);
        candy.tween = changeTween;
        this.game.time.events.add(delay, function() {
            if (candy != null && candy != -1) {
                if (type == "colorbomb") {
                    this.playSoundColorbombCreated();
                    if (!(typeof candy.loadTexture === 'undefined')) {
                        candy.loadTexture("colorbomb");
                        this.idleColorbomb(candy);
                    }
                    candy.id = "colorbomb";
                } else {
                    if (!(typeof candy.loadTexture === 'undefined')) {
                        candy.loadTexture(candy.id + type);
                        // this.idleColorbomb(candy);
                    }
                }

                if (type == "_wrap") {
                    this.playSoundWrappedCreated();
                } else if (type == "_hor" || type == "_ver") {
                    this.playSoundStripedCreated();
                }
                candy.type = type;

                if (variantDecimal == 0.1) { //When converted to new candy by COLORBOMB
                    this.animateRay(candy, candy.rayTo);
                    this.animateRay(candy, candy.rayTo2);
                    delay = 400;
                    this.autoTriggerCandies.push(candy);
                }
            }

        }, this);
    }


    destroyCandy(candy, delayedAnim = 1) {

        if (candy == null || candy == -1) {
            return;
        }

        var delay = 100;
        if (delayedAnim == 1.5) { //WRAPPED combo
            delay = 300;
        } else if (delayedAnim == 1.6) { //Destroyed by FISH
            delay = 1050;
        } else if (delayedAnim == 1.1) { //Destroyed by COLORBOMB
            delay = 600 + Math.random() * 200 + 100;

            this.animateRay(candy, candy.rayTo);
            this.animateRay(candy, candy.rayTo2);
        } else if (delayedAnim == 1.3) {
            delay = 1200;
        } else if (delayedAnim == 1.4) {
            delay = 600;
        }

        // this.destroyCandyAnimation(candy, delay);

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0
        }, 250, Phaser.Easing.Quadratic.InOut, true, delay);

        // this.game.add.tween(candy.scale).to({
        //     x: .01,
        //     y: .01,
        // }, 200, Phaser.Easing.Quadratic.InOut, true, delay - 100);

        // this.animateCandyParticles(candy, 5, delay);
        // var destroyTween;
        var initialScale = candy.scale.x;

        this.game.add.tween(candy.scale).to({
            x: [-initialScale, initialScale]
        }, delay, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {

            this.destroyCandyAnimation(candy, 0);

        }, this);

        // destroyTween = 

        return destroyTween;
    }

    animateRay(candy, rayTo) {

        if (rayTo !== undefined) {
            var ray = new Phaser.Sprite(this.game, 0, 0, "lighting");
            this.add(ray);

            ray.blendMode = PIXI.blendModes.SCREEN;
            ray.tint = PiecSettings.blockColors[candy.id];
            ray.anchor.x = .5;
            ray.anchor.y = 1;

            ray.x = rayTo.x;
            ray.y = rayTo.y;

            var finalAngle = -90 + 180 / Math.PI * Math.atan2(rayTo.y - candy.y, rayTo.x - candy.x);
            ray.angle = finalAngle;

            var finalLength = Math.sqrt(Math.pow(rayTo.x - candy.x, 2) + Math.pow(rayTo.y - candy.y, 2));

            var randomDelay = Math.random() * 200;

            ray.alpha = 0;



            this.game.time.events.add(randomDelay, function() {
                ray.alpha = 1;
            }, this);


            this.game.add.tween(ray.scale).to({
                x: [1, -1, 1],
                y: finalLength / ray.height,
            }, 150, Phaser.Easing.Quadratic.InOut, true, randomDelay);

            this.game.add.tween(ray).to({
                alpha: 0
            }, 100, Phaser.Easing.Quadratic.InOut, true, 950);

            var randomDuration = Math.random() * 400 + 400;

            this.game.add.tween(ray.scale).to({
                x: [2, 1, 1.7, .9, 1.8],
            }, randomDuration, Phaser.Easing.Quadratic.InOut, true).loop(true);

            this.game.time.events.add(200 + randomDelay, function() {
                this.playSoundColorbomb();
            }, this);
        }

    }

    animateColorBomb(candy) {

        this.animateCandyParticles(candy, 10, 1050);

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true, 1250);

        this.game.add.tween(candy.scale).to({
            x: [1.1, 0.01],
            y: [1.1, 0.01],
        }, 400, Phaser.Easing.Quadratic.InOut, true, 1050);

        return destroyTween;
    }

    destroyCandyAnimation(candy, delay) {

        var circle = new Phaser.Sprite(this.game, 0, 0, 'circle');
        circle.blendMode = PIXI.blendModes.SCREEN;
        circle.tint = PiecSettings.blockColors[candy.id];
        circle.anchor.set(0.5);
        circle.x = candy.x;
        circle.y = candy.y;
        this.add(circle);

        var originalScale = candy.width / (circle.width / circle.scale.x);

        circle.scale.set(0.01);


        //    this.game.add.tween(circleColor.scale).to({
        //     x: 1.2,
        //     y: 1.2
        // }, 450, Phaser.Easing.Quadratic.Out, true, delay);

        this.game.add.tween(circle.scale).to({
            x: originalScale * 2,
            y: originalScale * 2
        }, 450, Phaser.Easing.Quadratic.Out, true, delay);

        this.game.add.tween(circle).to({
            alpha: [1, 0],
        }, 150, Phaser.Easing.Quadratic.InOut, true, 300 + delay).onComplete.add(function(circleObj) {
            circleObj.destroy();
        }, this);

    }

    animateCandyParticles(candy, amount, delay) {
        for (var i = 0; i < amount; i++) {

            var particleSrc = candy.id + "_particle";

            if (candy.type == "colorbomb") {
                var randomParticle = Math.random() > .5 ? "_2" : "";
                particleSrc = candy.id + "_particle" + randomParticle;
            }

            var particle = new Phaser.Sprite(this.game, 0, 0, particleSrc);
            particle.x = candy.x;
            particle.y = candy.y;
            particle.anchor.set(0.5);

            this.add(particle);

            var finalX = candy.x + (Math.random()) * this.tileWidth * (Math.random() > 0.5 ? 1 : -1);
            var finalY = candy.y + (Math.random()) * this.tileWidth * (Math.random() > 0.5 ? 1 : -1);
            var randomAngle = Math.floor(Math.random() * 360);
            particle.angle = randomAngle;

            var randomScale = (Math.random() * .5) + .5;
            particle.scale.set(.01);

            var randomDuration = Math.random() * 200 + 550;
            var randomDelay = Math.random() * 200;

            this.game.add.tween(particle).to({
                x: finalX,
                y: finalY,
                alpha: [1, 1, 1, 0],
                angle: [randomAngle, randomAngle + (Math.random() - 0.5) * 270],
            }, randomDuration, Phaser.Easing.Quadratic.Out, true, randomDelay + delay);

            this.game.add.tween(particle.scale).to({
                x: [randomScale, randomScale, randomScale, randomScale, randomScale * 1.2, .01],
                y: [randomScale, randomScale, randomScale, randomScale, randomScale * 1.2, .01],
            }, randomDuration, Phaser.Easing.Quadratic.InOut, true, delay);
        }
    }

    animateParticlesOnTouch(x, y) {

        this.playPopSound();
        var amount = 10;
        var delay = 0;

        for (var i = 0; i < amount; i++) {

            var particleSrc = Math.floor((Math.random() * 7) + 1) + "_particle";

            if (particleSrc == "7_particle") {
                particleSrc = "colorbomb_particle";
            }

            var particle = new Phaser.Sprite(this.game, 0, 0, particleSrc);
            particle.x = x;
            particle.y = y;
            particle.anchor.set(0.5);

            this.game.add.existing(particle);

            var finalX = x + (Math.random()) * this.tileWidth * (Math.random() > 0.5 ? 1 : -1);
            var finalY = y + (Math.random()) * this.tileWidth * (Math.random() > 0.5 ? 1 : -1);
            var randomAngle = Math.floor(Math.random() * 360);
            particle.angle = randomAngle;

            var randomScale = (Math.random() * .5) + .5;
            particle.scale.set(.01);

            var randomDuration = Math.random() * 200 + 550;
            var randomDelay = Math.random() * 200;

            this.game.add.tween(particle).to({
                x: finalX,
                y: finalY,
                alpha: [1, 1, 1, 0],
                angle: [randomAngle, randomAngle + (Math.random() - 0.5) * 270],
            }, randomDuration, Phaser.Easing.Quadratic.Out, true, randomDelay + delay);

            this.game.add.tween(particle.scale).to({
                x: [randomScale, randomScale, randomScale, randomScale, randomScale * 1.2, .01],
                y: [randomScale, randomScale, randomScale, randomScale, randomScale * 1.2, .01],
            }, randomDuration, Phaser.Easing.Quadratic.InOut, true, delay);
        }
    }

    animateFishCandy(candy, variant) {
        if (candy.goTo == null)
            return null;
        var finalX = candy.goTo.x;
        var finalY = candy.goTo.y;
        candy.goTo.id = candy.id;
        var initialX = candy.x;
        var initialY = candy.y;
        var diffX = finalX - initialX;
        var diffY = finalY - initialY;

        this.bringToTop(candy);

        var finalAngle = 30;
        var candyScaleX = 1;
        if (finalY < initialY) {
            if (finalX > initialX) {
                candyScaleX = -1;
                finalAngle -= 90;
            } else {
                finalAngle += 60;
            }
        }
        if (finalY >= initialY) {
            if (finalX > initialX) {
                candyScaleX = -1;
                finalAngle -= 45;
            }
        }

        var additionalDelay = 0;
        if (variant == 1.1) {
            additionalDelay = 600;
        }

        var finalDuration = 900 + Math.random() * 200;
        var finalDelay = Math.random() * 100 + additionalDelay;

        if (!(typeof candy.loadTexture === 'undefined')) {
            if (candy.play == "_ver") {
                candy.loadTexture(candy.id + "_sfish");
                this.animateStripes(candy.goTo, 90, finalDuration * .95);
            } else if (candy.play == "_hor") {
                candy.loadTexture(candy.id + "_sfish");
                this.animateStripes(candy.goTo, 0, finalDuration * .95);
            } else if (candy.play == "_wrap") {
                candy.loadTexture(candy.id + "_wfish");
                this.game.time.events.add(finalDuration, function() {
                    this.playBombSound();
                }, this);
            }
        }

        this.game.add.tween(candy).to({
            angle: [finalAngle, finalAngle - 10, finalAngle + 10, finalAngle],
        }, finalDuration, Phaser.Easing.Quadratic.InOut, true, finalDelay);

        this.game.add.tween(candy.scale).to({
            x: [1.5 * candyScaleX, 1.2 * candyScaleX, 1.2 * candyScaleX, 1.2 * candyScaleX,
                1.2 * candyScaleX, 1.2 * candyScaleX, candyScaleX, candyScaleX, candyScaleX, candyScaleX,
                candyScaleX, 1.1 * candyScaleX, candyScaleX * 0.01
            ],
            y: [1.5, 1.2, 1.2, 1.2, 1.2, 1.2, 1, 1, 1, 1, 1, 1.1, 0.01]
        }, finalDuration, Phaser.Easing.Quadratic.InOut, true, finalDelay);

        this.game.add.tween(candy).to({
            x: [initialX + diffX * .4 - this.tileWidth / 10, initialX + diffX * .8 + this.tileWidth / 10, finalX],
            y: [finalY],
        }, finalDuration, Phaser.Easing.Quadratic.InOut, true, finalDelay);

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true, finalDuration + finalDelay);

        this.playFishMoveSound();
        this.game.time.events.add(finalDuration - 100 + finalDelay, function() {
            this.playFishPopSound();
        }, this);

        return destroyTween;
    }

    animateWrappedCandy(candy, variant) {

        if (variant == 1.2) {
            return this.animateStripedWrapCandy(candy);
        }

        var variantDecimal = (variant % 1).toFixed(1);
        var delay = 0;
        if (variantDecimal == .1) {
            this.animateRay(candy, candy.rayTo);
            this.animateRay(candy, candy.rayTo2);
            delay = 600;
        }
        if (variant == 1.6) {
            delay = 1050;
        }

        this.game.time.events.add(450 + delay, function() {
            this.playBombSound();
        }, this);

        var initialX = candy.x;
        var initialY = candy.y;
        this.bringToTop(candy);
        this.game.add.tween(candy).to({
            x: [initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
                initialX - initialX * .05,
                initialX + initialX * .05,
            ],
        }, 500, Phaser.Easing.Quadratic.InOut, true, delay);

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true, 300 + delay);

        this.game.add.tween(candy.scale).to({
            x: 3,
            y: 3
        }, 400, Phaser.Easing.Quadratic.Out, true, delay);

        return destroyTween;
    }

    animateStripedWrapCandy(candy) {

        if (!(typeof candy.loadTexture === 'undefined'))
            candy.loadTexture(candy.id + "_ver");
        candy.type = "_ver";

        this.game.add.tween(candy.scale).to({
            x: 4,
            y: 4,
        }, 550, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function() {
            if (!(typeof candy.loadTexture === 'undefined'))
                candy.loadTexture(candy.id + "_hor");
            candy.type = "_hor";

            candy.scale.set(1);
            this.game.add.tween(candy.scale).to({
                x: [4],
                y: [4]
            }, 600, Phaser.Easing.Quadratic.InOut, true);
        }, this);

        this.game.time.events.add(500, function() {
            this.playSoundStripeBlast();
        }, this);
        this.game.time.events.add(1100, function() {
            this.playSoundStripeBlast();
        }, this);

        this.animateStripes(candy, 90, 400, 2);
        this.animateStripes(candy, 0, 1000, 2);

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0,
        }, 100, Phaser.Easing.Quadratic.InOut, true, 1200);

        return destroyTween;
    }

    animateStripedCandy(candy, angle, variant) {

        if (variant == 1.2) {
            return this.animateStripedWrapCandy(candy);
        }

        this.playSoundStripeBlast();

        var variantDecimal = (variant % 1).toFixed(1);
        var delay = 0;
        if (variantDecimal == .1) {
            this.animateRay(candy, candy.rayTo);
            delay = 600;
        } else if (variant == 1.3) {
            delay = 1100;
        } else if (variant == 1.6) { //Triggered by a FISH
            delay = 1050;
        }

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0
        }, 250, Phaser.Easing.Quadratic.InOut, true, 50 + delay);

        this.game.add.tween(candy.scale).to({
            x: .01,
            y: .01,
        }, 200, Phaser.Easing.Quadratic.InOut, true, delay);

        this.animateStripes(candy, angle, delay);

        return destroyTween;
    }

    animateStripes(candy, angle = 0, delay = 0, scaleY = 1) {
        var stripes = new Phaser.Sprite(this.game, 0, 0, candy.id + "_stripes");
        stripes.anchor.set(0.5);
        stripes.x = candy.x;
        stripes.y = candy.y;
        stripes.angle = angle;
        stripes.scale.x = .01;
        stripes.scale.y = scaleY;
        stripes.alpha = 0;
        this.add(stripes);

        this.game.time.events.add(delay, function() {
            stripes.alpha = 1;
        }, this);

        this.game.add.tween(stripes.scale).to({
            x: 5,
        }, 350, Phaser.Easing.Quadratic.InOut, true, delay);
        var stripesTween = this.game.add.tween(stripes).to({
            alpha: 0,
        }, 150, Phaser.Easing.Quadratic.InOut, true, 350 + delay);

        stripesTween.onComplete.add(function(stripesObj) {
            stripesObj.destroy();
        }, this);
    }


    makeCandiesFall() {
        if (PiecSettings.blocksFallDirection == undefined || PiecSettings.blocksFallDirection == 'down') {
            this.candiesFallDown();
        } else if (PiecSettings.blocksFallDirection == 'up') {
            this.candiesFallUp();
        }

    }

    getTexture(candy, blur = false) {
        if (candy.type == "colorbomb")
            return "colorbomb";
        if (candy.type == "" && blur)
            return candy.id + "_blur";
        return candy.id + candy.type;
    }

    candiesFallUp() {
        var fallen = 0;
        var restart = false;
        for (var i = 1; i < this.args.board.length; i++) { //1 because it's -1 length, and then another extra row. Last one doesn't need to fall
            for (var j = 0; j < this.args.board[0].length; j++) {
                var candy = this.candyAt(j, i);
                if (candy != -1) {
                    var fallTiles = this.holesUp(j, i);
                    if (fallTiles > 0) {
                        var finalPos = candy.y - fallTiles * this.tileWidth;
                        var animationDuration = this.fallSpeed * fallTiles;
                        var animationDelay = 0;

                        // this.addMotionBlurEffect(candy, animationDuration * .3);

                        var tween = this.game.add.tween(candy).to({
                            y: [finalPos, finalPos - this.tileWidth * .1, finalPos],
                        }, animationDuration, Phaser.Easing.Quadratic.Out, true, animationDelay);

                        fallen++;

                        tween.onComplete.add(function(candy) {
                            // if (!(typeof candy.loadTexture === 'undefined'))
                            //     candy.loadTexture(this.getTexture(candy));
                            fallen--;
                            if (fallen == 0 && !this.pause) {
                                this.respawnCandies();
                            }
                        }, this);
                        candy.row = candy.row - fallTiles;
                        this.candies[candy.col + "," + candy.row] = candy;
                        this.candies[j + "," + i] = null;

                        this.game.time.events.add((animationDuration + animationDelay) / 3.3, function() {
                            // this.playSoundFallingCandy();
                        }, this);
                    }
                }
            }
        }

    }

    candiesFallDown() {

        var fallen = 0;
        var restart = false;

        for (var i = this.args.board.length - 2; i >= 0; i--) { //-2 because it's -1 length, and then another extra row. Last one doesn't need to fall
            for (var j = 0; j < this.args.board[0].length; j++) {
                var candy = this.candyAt(j, i);
                if (candy != -1) {
                    var fallTiles = this.holesBelow(j, i);
                    if (fallTiles > 0) {
                        var finalPos = candy.y + fallTiles * this.tileWidth;
                        var animationDuration = this.fallSpeed * fallTiles;
                        var animationDelay = 0;

                        // this.addMotionBlurEffect(candy, animationDuration * .3);

                        var tween = this.game.add.tween(candy).to({
                            y: [finalPos, finalPos - this.tileWidth * .1, finalPos],
                        }, animationDuration, Phaser.Easing.Quadratic.Out, true, animationDelay);

                        fallen++;

                        tween.onComplete.add(function(candy) {
                            // if (!(typeof candy.loadTexture === 'undefined'))
                            //     candy.loadTexture(this.getTexture(candy));
                            fallen--;
                            if (fallen == 0 && !this.pause) {
                                this.respawnCandies();
                            }
                        }, this);
                        candy.row = candy.row + fallTiles;
                        this.candies[candy.col + "," + candy.row] = candy;
                        this.candies[j + "," + i] = null;

                        this.game.time.events.add((animationDuration + animationDelay) / 3.3, function() {
                            this.playSoundFallingCandy();
                        }, this);
                    }
                }
            }
        }


        if (fallen == 0 && !this.pause) {
            this.respawnCandies();
        }
    }



    //get how many rows the candy can go down
    holesBelow(col, row) {
        var result = 0;

        for (var i = row + 1; i < this.args.board.length; i++) {

            if (this.candyAt(col, i) == -1) {
                if (this.args.board[i][col] != 0) {
                    result++;
                }
            }

        }

        return result;
    }

    //get how many rows the candy can go up
    holesUp(col, row) {
        var result = 0;

        for (var i = row - 1; i >= 0; i--) {

            if (this.candyAt(col, i) == -1) {
                if (this.args.board[i][col] != 0) {
                    result++;
                }
            }

        }

        return result;
    }


    holesInCol(col) {
        var result = 0;
        for (var i = this.topRow[col]; i < this.args.board.length; i++) {
            if (this.candyAt(col, i) == -1) {
                if (this.args.board[i][col] != 0) {
                    result++;
                }
            }
        }
        return result;
    }

    fixedCandiesInBetween(col, topRow, bottomRow) {
        var result = 0;

        for (var i = bottomRow; i >= topRow; i--) {
            if (this.candyAt(col, i) != -1 && this.candyAt(col, i).fixed) {
                result++;
            }
        }

        return result;
    }

    fixedCandiesBelow(col, row) {
        var result = 0;

        // var fixedCandiesRow = []''

        for (var i = row + 1; i < this.args.board.length; i++) {

            if (this.candyAt(col, i) != -1 && this.candyAt(col, i).fixed) {

                result++;

            }
        }

        return result;
    }

    fixedCandiesInCol(col) {
        var result = 0;

        for (var i = this.topRow[col]; i < this.args.board.length; i++) {

            if (this.candyAt(col, i) != -1 && this.candyAt(col, i).fixed) {

                result++;

            }
        }

        return result;
    }


    respawnCandies() {

        var respawned = 0;
        var restart = false;

        var topRow;

        //each column
        for (var j = 0; j < this.args.board[0].length; j++) {

            //spawn from the top row
            topRow = this.topRow[j];


            //get all the spots that is -1 and is not supposed to have a candy
            var emptySpots = this.holesInCol(j);

            if (emptySpots > 0) {

                if (PiecSettings.blocksFallDirection == undefined || PiecSettings.blocksFallDirection == 'down') {

                    //fall from the top row
                    for (var i = topRow; i < emptySpots + topRow; i++) {

                        var color = this.getRandomColor();

                        var special = Math.random() > .97 ? "_fish" : "";

                        var candyRow = i;

                        if (this.fixedCandiesInBetween(j, topRow, candyRow) > 0) {

                            candyRow += this.fixedCandiesInBetween(j, topRow, candyRow);

                        }

                        if (this.candyAt(j, candyRow) != -1) {

                            continue;
                        }

                        var candy = this.createCandy(color, j, candyRow, special);

                        //TODO - RANDOMLY CHOOSE TO CREATE A FISH
                        candy.y = -this.tileWidth * (emptySpots - candyRow) + this.tileWidth / 2;
                        // candy.y = -this.tileWidth * topRow + this.tileWidth / 2;

                        var animationDuration = this.fallSpeed * emptySpots;
                        var animationDelay = 50 + 50 * (this.args.board[0].length - i);
                        var finalPos = this.getTileYFromRow(candyRow);

                        this.showAfterDelay(candy, animationDelay);

                        // this.addMotionBlurEffect(candy, animationDuration * .3);

                        var candyTween = this.game.add.tween(candy).to({
                            y: [finalPos, finalPos * .95, finalPos]
                        }, animationDuration, Phaser.Easing.Quadratic.Out, true, animationDelay);
                        respawned++;

                        this.game.time.events.add((animationDuration + animationDelay) / 3.3, function() {
                            this.playSoundFallingCandy();
                        }, this);

                        this.game.time.events.add(animationDuration * .9, function() {
                            // if (this != null && this.game != null && candy != null && candy != -1 && !(typeof candy.loadTexture === 'undefined')) {
                            if (candy != null && candy != -1) {
                                // candy.loadTexture(this.getTexture(candy, false));
                                respawned--;
                                if (respawned == 0) {
                                    if (restart && !this.pause) {
                                        this.respawnCandies();
                                    } else {

                                        this.onRespawnFinished.dispatch();


                                    }
                                }
                            } else {
                                console.log("ignored -----------------------");
                            }
                        }, this);
                    }
                } else if (PiecSettings.blocksFallDirection == 'up') {

                    //fall from the bottom row
                    for (var i = this.args.board.length - 1; i > this.args.board.length - 1 - emptySpots; i--) {

                        var color = this.getRandomColor();

                        // var special = Math.random() > .97 ? "_fish" : "";

                        var candyRow = i;

                        if (this.fixedCandiesInBetween(j, topRow, candyRow) > 0) {
                            candyRow -= this.fixedCandiesInBetween(j, candyRow, this.args.board.length - 1);

                        }

                        if (this.candyAt(j, candyRow) != -1) {
                            continue;
                        }

                        var candy = this.createCandy(color, j, candyRow, special);

                        candy.y = this.tileWidth * (candyRow + emptySpots) + this.tileWidth / 2;

                        var animationDuration = this.fallSpeed * emptySpots;
                        var animationDelay = 200 - 50 * (this.args.board[0].length - i);
                        var finalPos = this.getTileYFromRow(candyRow);

                        this.showAfterDelay(candy, animationDelay);

                        // this.addMotionBlurEffect(candy, animationDuration * .3);

                        var candyTween = this.game.add.tween(candy).to({
                            y: [finalPos, finalPos * 1.05, finalPos]
                        }, animationDuration, Phaser.Easing.Quadratic.Out, true, animationDelay);
                        respawned++;

                        this.game.time.events.add((animationDuration + animationDelay) / 3.3, function() {
                            // this.playSoundFallingCandy();
                        }, this);

                        this.game.time.events.add(animationDuration * .9, function() {
                            // if (this != null && this.game != null && candy != null && candy != -1 && !(typeof candy.loadTexture === 'undefined')) {
                            if (candy != null && candy != -1) {
                                // candy.loadTexture(this.getTexture(candy, false));
                                respawned--;
                                if (respawned == 0) {
                                    if (restart && !this.pause) {
                                        this.respawnCandies();
                                    } else {

                                        this.onRespawnFinished.dispatch();


                                    }
                                }
                            } else {
                                console.log("ignored -----------------------");
                            }
                        }, this);
                    }
                }

            }
        }
    }


    thereAreAutoTriggerCandies() {
        return this.autoTriggerCandies.length > 0;
    }

    setSelectedCandiesToNull() {
        this.selectedCandy = null;
    }

    showAfterDelay(candy, delay) {
        candy.alpha = 0;
        this.game.time.events.add(delay, function() {
            if (candy != null && candy != -1) {
                candy.alpha = 1;
            }
        }, this);
    }

    addMotionBlurEffect(candy, delay) {
        // if (!(typeof candy.loadTexture === 'undefined'))
        //     candy.loadTexture(this.getTexture(candy, true));
        // this.game.time.events.add(delay, function() {
        //     if (this != null && this.game != null && candy != null && candy != -1 && !(typeof candy.loadTexture === 'undefined')) {
        //         candy.loadTexture(this.getTexture(candy, false));
        //     }
        // }, this);
    }

    getRandomColor() {

        var randomColor = Math.random();

        if (randomColor < this.args.chances[0]) {
            return 1;
        } else if (randomColor < this.args.chances[0] + this.args.chances[1]) {
            return 2;
        } else if (randomColor < this.args.chances[0] + this.args.chances[1] + this.args.chances[2]) {
            return 3;
        } else if (randomColor < this.args.chances[0] + this.args.chances[1] + this.args.chances[2] + this.args.chances[3]) {
            return 4;
        } else if (randomColor < this.args.chances[0] + this.args.chances[1] + this.args.chances[2] + this.args.chances[3] + this.args.chances[4]) {
            return 5;
        } else if (randomColor < this.args.chances[0] + this.args.chances[1] + this.args.chances[2] + this.args.chances[3] + this.args.chances[4] + this.args.chances[5]) {
            return 6;
        }
    }

    getGlobalTileSize() {
        return this.tileWidth * this.scale.x;
    }

    getRowFromYCoord(y) {

        return Math.floor((y - this.y) / this.getGlobalTileSize());
    }

    getColFromXCoord(x) {

        return Math.floor((x - this.x) / this.getGlobalTileSize());
    }

    candyAt(col, row) {

        if (this.candies[col + "," + row] != undefined && this.candies[col + "," + row] != null)
            return this.candies[col + "," + row];
        else
            return -1;
    }


    isHorizontalMatch(col, row) {
        return this.candyAt(col, row).id == this.candyAt(col - 1, row).id && this.candyAt(col, row).id == this.candyAt(col - 2, row).id;
    }

    isVerticalMatch(col, row) {
        return this.candyAt(col, row).id == this.candyAt(col, row - 1).id && this.candyAt(col, row).id == this.candyAt(col, row - 2).id;
    }

    isColorbombMatch() {
        return this.selectedCandy != null && this.pickedCandy != null && (this.selectedCandy.type == "colorbomb" || this.pickedCandy.type == "colorbomb");
    }

    isSpecialCandyMatch() {
        return this.selectedCandy != null && this.pickedCandy != null && (this.selectedCandy.type != "" && this.pickedCandy.type != "");
    }

    isMatch(col, row) {
        return this.isHorizontalMatch(col, row) || this.isVerticalMatch(col, row);
    }

    matchInBoard() {
        for (var i = 0; i < this.args.board.length; i++) {
            for (var j = 0; j < this.args.board[0].length; j++) {
                if (this.args.board[i][j] != 0) {
                    if (this.isMatch(j, i)) {
                        return true;
                    }
                }
            }
        }
        this.canPick = true;
        return false;
    }

    playSoundMatch() {
        console.log("playing sound match");
        var randomLand = Math.floor(Math.random() * 4) + 1;

        var keyName = "match" + randomLand,
            src = PiecSettings.assetsDir + "match" + randomLand + '.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playBombSound() {
        var keyName = "bomb",
            src = PiecSettings.assetsDir + 'bomb.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playFishMoveSound() {
        var keyName = "fish_move",
            src = PiecSettings.assetsDir + 'fish_move.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playFishPopSound() {
        var keyName = "fish_pop",
            src = PiecSettings.assetsDir + 'fish_pop.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playSoundStripeBlast() {
        var keyName = "line_blast",
            src = PiecSettings.assetsDir + 'line_blast.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playMessage(message) {
        var keyName = message,
            src = PiecSettings.assetsDir + message + '.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playSoundFallingCandy() {
        var randomLand = Math.floor(Math.random() * 3) + 1;

        var keyName = "land" + randomLand,
            src = PiecSettings.assetsDir + "land" + randomLand + '.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playSoundColorbomb() {
        var keyName = "colorbomb",
            src = PiecSettings.assetsDir + 'color_bomb.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playSoundColorbombCreated() {
        var keyName = "colorbomb_created",
            src = PiecSettings.assetsDir + 'colour_bomb_created.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playSoundStripedCreated() {
        var keyName = "striped_created",
            src = PiecSettings.assetsDir + 'striped_created.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playSoundWrappedCreated() {
        var keyName = "wrapped_created",
            src = PiecSettings.assetsDir + 'wrapped_created.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playPopSound() {
        var keyName = "pop_sound",
            src = PiecSettings.assetsDir + 'pop.mp3',
            args = {
                loop: false,
                volume: 1,
            };
        this.game.audioController.play(keyName, src, args);
    }

    playChestOpen() {
        var keyName = 'chest_opened',
            src = PiecSettings.assetsDir + 'chest_opened.mp3',
            args = {
                loop: false,
                volume: 1,
            }

        this.game.audioController.play(keyName, src, args);
    }

    playAudio(keyName, args) {
        var src = PiecSettings.assetsDir + keyName + '.mp3';
        this.game.audioController.play(keyName, src, args);
    }

    playFoxMove() {
        var keyName = 'fox_move',
            src = PiecSettings.assetsDir + 'fox_move.mp3',
            args = {
                loop: false,
                volume: 0.5,
            }

        this.game.audioController.play(keyName, src, args);
    }

}

export default Board;