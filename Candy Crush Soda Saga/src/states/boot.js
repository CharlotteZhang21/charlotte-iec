class Boot extends Phaser.State {

    constructor() {
        super();
    }

    preload() {}

    init() {

        // setup path for asset folder depending on environment
        PiecSettings.assetsDir = PiecSettings.env === 'dev' ? 'assets/' : '';

        var game = this.game;

        // custom game events here
        game.onInteract = new Phaser.Signal();        
        game.onSDKCall = new Phaser.Signal();
        game.onResize = new Phaser.Signal();

        if (typeof piec !== 'undefined') {
            // public API methods
            piec.lockGame = function() {

                game.global.locked = true;
            };

            piec.unlockGame = function() {

                game.global.locked = false;
            };

            piec.destroyGame = function() {

                game.destroy();
            };

            piec.onSDKCall = function () {
                game.onSDKCall.dispatch();
            }

            piec.onResize = function() {
                game.onResize.dispatch();
            }

        }

        // stretch game to fit window
        window.onresize = function() {
            game.scale.setGameSize(document.body.clientWidth * window.devicePixelRatio, document.body.clientHeight * window.devicePixelRatio);
            game.scale.refresh();
            game.state.start('boot', true, false);
        };
    }

    create() {

        this.init();

        this.game.input.maxPointers = 1;

        this.initGlobalVariables();

        this.game.state.start('preloader');

        // this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.onMoveStart = function(game) {

            // increament interactions
            game.global.interactions++;

            if (PiecSettings && PiecSettings.onMoveStart) {
                PiecSettings.onMoveStart(game.global.interactions); // call out externally
            }
        };

        this.game.onMoveComplete = function(game) {

            if (PiecSettings && PiecSettings.onMoveComplete) {
                PiecSettings.onMoveComplete(game.global.moveStats); // call out externally
            }
        };
    }

    initGlobalVariables() {
        this.game.global = {
            interaction: 0,
            gameComplete: false,
            currentVideoScript: null,
        };
    }
}

export default Boot;