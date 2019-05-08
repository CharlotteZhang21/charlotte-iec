import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';

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
        this.initSounds();

        this.game.input.onDown.add(this.candySelect, this);
        this.game.input.onUp.add(this.candyDeselect, this);

        this.selectedCandy = null;

        this.resize();

        if (PiecSettings.helperFeature !== undefined && PiecSettings.helperFeature == true)
            this.randomHelper();

        this.createMessage();

        this.createHand();

        if (PiecSettings.showPrompt !== undefined && PiecSettings.showPrompt)
            this.createPrompt();
    }

    createPrompt() {

        this.prompt = new CustomText(this.game, {
            "text": "Match the",
            "container": "prompt",
            "anchor": PiecSettings.prompt.anchor,
            "style": PiecSettings.prompt.style,
            "autolocalise": true,
        });

        this.prompt.show();

        var finalScale = this.prompt.scale.x;

        this.prompt.angleTween = this.game.add.tween(this.prompt).to({
            angle: -2,
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        this.prompt.scaleTween = this.game.add.tween(this.prompt.scale).to({
            x: finalScale * 1.1,
            y: finalScale * 1.1
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        this.game.time.events.add(2000, function() {
            this.game.tweens.remove(this.prompt.angleTween);
            this.game.tweens.remove(this.prompt.scaleTween);
            this.game.add.tween(this.prompt).to({
                alpha: 0,
            }, 100, Phaser.Easing.Quadratic.InOut, true, 100);
            this.game.add.tween(this.prompt.scale).to({
                x: 0.01,
                y: 0.01
            }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
        }, this);

        this.prompt2 = new CustomText(this.game, {
            "text": "candies",
            "container": "prompt2",
            "anchor": PiecSettings.prompt.anchor,
            "style": PiecSettings.prompt.style,
            "autolocalise": true,
        });

        this.prompt2.show();

        var finalScale = this.prompt2.scale.x;

        this.prompt2.angleTween = this.game.add.tween(this.prompt2).to({
            angle: -2,
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        this.prompt2.scaleTween = this.game.add.tween(this.prompt2.scale).to({
            x: finalScale * 1.1,
            y: finalScale * 1.1
        }, 500, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(true).loop(2);

        this.game.time.events.add(2000, function() {
            this.game.tweens.remove(this.prompt2.angleTween);
            this.game.tweens.remove(this.prompt2.scaleTween);
            this.game.add.tween(this.prompt2).to({
                alpha: 0,
            }, 100, Phaser.Easing.Quadratic.InOut, true, 100);
            this.game.add.tween(this.prompt2.scale).to({
                x: 0.01,
                y: 0.01
            }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
        }, this);
    }

    createHand() {
        this.hand = new Phaser.Sprite(this.game, 0, 0, 'hand');

        this.add(this.hand);

        ContainerUtil.fitInContainer(this.hand, 'hand', 0, 0);
        this.hand.anchor.set(.1, .1);

        var candy1 = this.candyAt(this.args.hand[0][0], this.args.hand[0][1]);
        var candy2 = this.candyAt(this.args.hand[1][0], this.args.hand[1][1]);

        var initialX = candy1.x;
        var initialY = candy1.y;
        var finalX = candy2.x;
        var finalY = candy2.y;
        var initialScale = this.hand.scale.x;

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

    cancelHand() {
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
        var randomMessage = randomPick > .66 ? "sweet" : (randomPick > .33 ? "tasty" : "divine");
        this.message.loadTexture(randomMessage);

        this.game.add.tween(this.message.scale).to({
            x: this.message.initialScale,
            y: this.message.initialScale,
        }, 500, Phaser.Easing.Back.Out, true, 0);
        this.game.add.tween(this.message).to({
            y: this.message.initialY - this.message.initialHeight,
            alpha: [1, 1, 1, 1, 1, 0],
        }, 800, Phaser.Easing.Quadratic.InOut, true, 200);

        this.playMessage(randomMessage);

    }

    initSounds() {
        this.game.audioController.initAudio("land1", PiecSettings.assetsDir + 'land1.mp3');
        this.game.audioController.initAudio("land2", PiecSettings.assetsDir + 'land2.mp3');
        this.game.audioController.initAudio("land3", PiecSettings.assetsDir + 'land3.mp3');
        this.game.audioController.initAudio("land4", PiecSettings.assetsDir + 'land4.mp3');
        this.game.audioController.initAudio("colorbomb_created", PiecSettings.assetsDir + 'colour_bomb_created.mp3');
        this.game.audioController.initAudio("colorbomb", PiecSettings.assetsDir + 'color_bomb.mp3');
        this.game.audioController.initAudio("striped_created", PiecSettings.assetsDir + 'striped_created.mp3');
        this.game.audioController.initAudio("wrapped_created", PiecSettings.assetsDir + 'wrapped_created.mp3');
        this.game.audioController.initAudio("line_blast", PiecSettings.assetsDir + 'line_blast.mp3');

        this.game.audioController.initAudio("match1", PiecSettings.assetsDir + 'match1.mp3');
        this.game.audioController.initAudio("match2", PiecSettings.assetsDir + 'match2.mp3');
        this.game.audioController.initAudio("match3", PiecSettings.assetsDir + 'match3.mp3');
        this.game.audioController.initAudio("match4", PiecSettings.assetsDir + 'match4.mp3');
        this.game.audioController.initAudio("match5", PiecSettings.assetsDir + 'match5.mp3');

        this.game.audioController.initAudio("pop_sound", PiecSettings.assetsDir + 'pop.mp3');

        this.game.audioController.initAudio("fish_pop", PiecSettings.assetsDir + 'fish_pop.mp3');
        this.game.audioController.initAudio("fish_move", PiecSettings.assetsDir + 'fish_move.mp3');
        this.game.audioController.initAudio("bomb", PiecSettings.assetsDir + 'bomb_sound.mp3');

        this.game.audioController.initAudio("sweet", PiecSettings.assetsDir + 'sweet.mp3');
        this.game.audioController.initAudio("tasty", PiecSettings.assetsDir + 'tasty.mp3');
        this.game.audioController.initAudio("divine", PiecSettings.assetsDir + 'divine.mp3');
    }

    initSignals() {
        this.onCandySelect = new Phaser.Signal();
    }

    randomHelper() {
        this.game.time.events.loop(Phaser.Timer.SECOND * 2, function() {
            // console.log("HERE");
            if (this.canPick && !this.pause) {
                // console.log("HERE 2");
                var candy = this.getRandomCandy();
                if (candy != null && candy != -1 && candy.type != "colorbomb")
                    this.upgradeCandy(candy);
            }
        }, this);
    }

    upgradeCandy(candy) {
        var randomUpgrade = Math.floor(Math.random() * 5) + 2;
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
    }


    initCandies(board) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                this.createCandy(board[i][j], j, i);
            }
        }
    }

    createCandy(id, col, row, special = "") {
        var type = special;
        if (id == 8) {
            id = "colorbomb";
            type = "colorbomb";
        }
        var src = id;
        src += special;
        // id += special;
        var candy = new Phaser.Sprite(this.game, 0, 0, src);
        candy.anchor.set(0.5);
        candy.x = this.getTileXFromCol(col);
        candy.y = this.getTileYFromRow(row);
        candy.col = col;
        candy.row = row;
        candy.id = id;
        candy.type = type;
        this.add(candy);
        this.candies[col + "," + row] = candy;

        if (id == "colorbomb") {
            this.idleColorbomb(candy);
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
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (board[i][j] != 0) {
                    if( i % 2 == 0) {
                        boardColor = j % 2 == 0 ? 'board-bg-1' : 'board-bg-2';
                    }else {
                        boardColor = j % 2 != 0 ? 'board-bg-1' : 'board-bg-2';
                    }
                    
                    backgroundTile = new Phaser.Sprite(this.game, 0, 0, boardColor);
                    backgroundTile.x = j * backgroundTile.height;
                    backgroundTile.y = i * backgroundTile.width;
                    this.add(backgroundTile);
                    this.tileWidth = backgroundTile.width;
                }
            }
        }
    }

    candySelect(e) {

        var x = e.clientX * window.devicePixelRatio;
        var y = e.clientY * window.devicePixelRatio;

        this.animateParticlesOnTouch(x, y);
        this.cancelHand();

        if (this.canPick) {

            this.onCandySelect.dispatch();

            this.pickedCandy = this.candyAt(this.getColFromXCoord(x), this.getRowFromYCoord(y));

            if (this.pickedCandy != -1) {
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
                if (this.pickedCandy != -1) {
                    this.swapCandies(this.selectedCandy, this.pickedCandy, true);
                    this.game.input.deleteMoveCallback(this.candyMove, this);
                }
            }
        }

    }

    swapCandies(candy1, candy2, swapBack) {
        this.canPick = false;

        var auxCol = candy1.col;
        var auxRow = candy1.row;
        candy1.col = candy2.col;
        candy1.row = candy2.row;
        candy2.col = auxCol;
        candy2.row = auxRow;
        this.candies[candy1.col + "," + candy1.row] = candy1;
        this.candies[candy2.col + "," + candy2.row] = candy2;

        var candy1Tween = this.game.add.tween(candy1).to({
            x: this.getTileXFromCol(candy1.col),
            y: this.getTileYFromRow(candy1.row),
        }, 300, Phaser.Easing.Quadratic.InOut, true);

        var candy2Tween = this.game.add.tween(candy2).to({
            x: this.getTileXFromCol(candy2.col),
            y: this.getTileYFromRow(candy2.row),
        }, 300, Phaser.Easing.Quadratic.InOut, true);

        candy2Tween.onComplete.add(function() {
            if (this.isColorbombMatch() || this.isSpecialCandyMatch() && !this.pause) {
                this.handleMatches();
            } else {
                var matchInBoard = this.matchInBoard();
                if (!matchInBoard && swapBack && !this.pause) {
                    this.swapCandies(candy1, candy2, false);
                } else {
                    if (!this.pause) {
                        if (matchInBoard) {
                            this.game.time.events.add(200, function() {
                                this.playSoundMatch();
                            }, this);
                            this.handleMatches();
                        } else {
                            this.canPick = true;
                        }
                        this.setSelectedCandiesToNull();
                    }
                }
            }
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
        var candy = this.candyAt(randX, randY);
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
        // console.log(this.removeMap);

        var destroyed = 0;
        for (var i = 0; i < this.args.board.length; i++) {
            for (var j = 0; j < this.args.board[0].length; j++) {
                if (this.removeMap[i][j] >= 1 && this.removeMap[i][j] < 2) {
                    var candy = this.candyAt(j, i);

                    var destroyTween;
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
                    } else {
                        destroyTween = this.destroyCandy(candy, this.removeMap[i][j]);
                    }

                    if (destroyTween == null) {
                        this.autoTriggerCandies.push(candy);
                    } else {
                        destroyed++;
                        destroyTween.onComplete.add(function(candyObj) {
                            candyObj.destroy();
                            destroyed--;
                            if (destroyed == 0 && !this.pause) {
                                this.makeCandiesFall();
                                this.respawnCandies();
                            }
                        }, this);
                        this.candies[j + "," + i] = null;
                    }


                } else if (this.removeMap[i][j] >= 2 && this.removeMap[i][j] < 3) {
                    this.changeCandyTo(this.candyAt(j, i), "_hor", this.removeMap[i][j]);
                } else if (this.removeMap[i][j] >= 3 && this.removeMap[i][j] < 4) {
                    this.changeCandyTo(this.candyAt(j, i), "_ver", this.removeMap[i][j]);
                } else if (this.removeMap[i][j] >= 4 && this.removeMap[i][j] < 5) {
                    this.changeCandyTo(this.candyAt(j, i), "_wrap", this.removeMap[i][j]);
                } else if (this.removeMap[i][j] >= 5 && this.removeMap[i][j] < 6) {
                    this.changeCandyTo(this.candyAt(j, i), "colorbomb");
                } else if (this.removeMap[i][j] >= 6 && this.removeMap[i][j] < 7) {
                    this.changeCandyTo(this.candyAt(j, i), "_fish", this.removeMap[i][j]);
                }
            }
        }
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

        this.destroyCandyAnimation(candy, delay);

        var destroyTween = this.game.add.tween(candy).to({
            alpha: 0
        }, 150, Phaser.Easing.Quadratic.InOut, true, delay);

        this.game.add.tween(candy.scale).to({
            x: .01,
            y: .01,
        }, 200, Phaser.Easing.Quadratic.InOut, true, delay - 100);

        this.animateCandyParticles(candy, 5, delay);

        return destroyTween;
    }

    animateRay(candy, rayTo) {

        if (rayTo !== undefined) {
            var ray = new Phaser.Sprite(this.game, 0, 0, "colorbomb_ray");
            this.add(ray);
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
        circle.anchor.set(0.5);
        circle.x = candy.x;
        circle.y = candy.y;
        this.add(circle);

        circle.scale.set(0.01);

        this.game.add.tween(circle.scale).to({
            x: 1.2,
            y: 1.2
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

    getTexture(candy, blur = false) {
        if (candy.type == "colorbomb")
            return "colorbomb";
        if (candy.type == "" && blur)
            return candy.id + "_blur";
        return candy.id + candy.type;
    }

    holesBelow(col, row) {
        var result = 0;
        for (var i = row + 1; i < this.args.board.length; i++) {
            if (this.candyAt(col, i) == -1) {
                result++;
            }
        }
        return result;
    }

    holesInCol(col) {
        var result = 0;
        for (var i = 0; i < this.args.board.length; i++) {
            if (this.candyAt(col, i) == -1) {
                result++;
            }
        }
        return result;
    }

    respawnCandies() {
        var respawned = 0;
        var restart = false;

        for (var j = 0; j < this.args.board[0].length; j++) {
            var emptySpots = this.holesInCol(j);
            if (emptySpots > 0) {
                for (var i = 0; i < emptySpots; i++) {

                    var color = this.getRandomColor();
                    var special = Math.random() > .97 ? "_fish" : "";
                    // if (special == "_fish"){
                    //     color += "_fish";
                    // }
                    var candy = this.createCandy(color, j, i, special);
                    //TODO - RANDOMLY CHOOSE TO CREATE A FISH
                    candy.y = -this.tileWidth * (emptySpots - i) + this.tileWidth / 2;

                    var animationDuration = this.fallSpeed * emptySpots;
                    var animationDelay = 50 + 50 * (this.args.board[0].length - i);
                    var finalPos = this.getTileYFromRow(i);

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
                                    if (!this.pause) {
                                        if (this.matchInBoard() || this.thereAreAutoTriggerCandies()) {
                                            this.game.time.events.add(250, function() {
                                                this.handleMatches();
                                            }, this);
                                        } else {
                                            this.canPick = true;
                                            this.animateMessage();
                                        }
                                        this.setSelectedCandiesToNull();
                                    }
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

        if (this.candies[col + "," + row] != undefined)
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
                if (this.isMatch(j, i)) {
                    return true;
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

}

export default Board;