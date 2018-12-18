function fitLayout(){
    if (window.viewportSize.width > window.viewportSize.height){

        var scale = Math.min(window.viewportSize.width / MainGame.instance.gameData.widthLand, window.viewportSize.height / MainGame.instance.gameData.heightLand);

        var width = Math.floor(MainGame.instance.gameData.widthLand * scale);
        var height = Math.floor(MainGame.instance.gameData.heightLand * scale);

        MainGame.instance.renderer.view.style.width = width + "px";
        MainGame.instance.renderer.view.style.height = height + "px";


        MainGame.instance.renderer.view.style.position = "absolute";
        MainGame.instance.renderer.view.style.left = ((window.viewportSize.width - width) / 2) + "px";
        MainGame.instance.renderer.resize(960,640);


        MainGame.instance.renderer.view.style.top = "0px";
        if ( MainGame.instance.orientation == 'portrait') {
            MainGame.instance.orientation = 'landscape';
            rotateGame();
            changeArrowMove();

        }

    } else {

        var scale = Math.min(window.viewportSize.width / MainGame.instance.gameData.width, window.viewportSize.height / MainGame.instance.gameData.height);

        var width = Math.floor(MainGame.instance.gameData.width * scale);
        var height = Math.floor(MainGame.instance.gameData.height * scale);

        MainGame.instance.renderer.view.style.width = width + "px";
        MainGame.instance.renderer.view.style.height = height + "px";



        MainGame.instance.renderer.resize(640,960);

        MainGame.instance.renderer.view.style.position = "absolute";
        MainGame.instance.renderer.view.style.left = ((window.viewportSize.width - width) / 2) + "px";

        if (window.viewportSize.height > height){
            MainGame.instance.renderer.view.style.top = ((document.documentElement.clientHeight - height) / 2) + "px";
        }


        if ( MainGame.instance.orientation == 'landscape') {
            MainGame.instance.orientation = 'portrait';
            rotateGame();
            changeArrowMove();

        }

    }

}



function createOverlay(){
    var divOverlay = document.createElement('div');
    // divOverlay.style.backgroundColor = '#000000';
    divOverlay.id = 'overlay';

    divOverlay.style.width = '100%';
    divOverlay.style.height = '100%';
    divOverlay.style.position = 'fixed';
    divOverlay.style.left = '0px';
    divOverlay.style.top = '0px';
    document.body.insertBefore(divOverlay, document.body.getElementsByTagName('canvas')[0]);
}




function loadFonts (callback) {

    var Gamefont = new FontFaceObserver("Gamefont", { });
    var Gamefont_bold = new FontFaceObserver("Gamefont_bold", {});
    var Gamefont_bold_italic = new FontFaceObserver("Gamefont_bold_italic", { });
    var Gamefont_italic = new FontFaceObserver("Gamefont_italic", {});

    Promise.all([
        Gamefont.load(),
        Gamefont_bold.load(),
        Gamefont_bold_italic.load(),
        Gamefont_italic.load()
    ]).then(function() {
        document.documentElement.className += " fonts-loaded";
        PIXI.loader.load(/*onAssetsLoaded*/callback);
    });


}



function addCloseOption (){
    var closeBtn = document.getElementById('vungle-close');
    if (!closeBtn) return;
    /*closeBtn.addEventListener('click', function(){
        doSomething('close');
    })*/
    closeBtn.addEventListener('tap', function(){
        doSomething('close');
    })
}

function Game() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Container();

    for (var key in Assets.images) {
        PIXI.loader.add(key, Assets.images[key]);
    }

    loadFonts(onAssetsLoaded);

    new MainGame();

    function onAssetsLoaded() {

        MainGame.instance.loadAssets();

        // create a renderer instance
        var width = MainGame.instance.gameData.width;
        var height = MainGame.instance.gameData.height;
        

        MainGame.instance.renderer = new PIXI.autoDetectRenderer(width, height, {
            transparent: true,
            //backgroundColor: 0xffffff,
            preserveDrawingBuffer: true
        });

        // add the renderer view element to the DOM
        document.body.appendChild(MainGame.instance.renderer.view);
        createOverlay();

        startGame();
    }

    function startGame() {
        window.viewportSize = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };

        detectOrientation();
        MainGame.instance.field = new FieldUI();
        Animations.instance = new Animations();
        
        MainGame.instance.field.points = 0;

        MainGame.instance.time = MainGame.instance.field.addChild(new Time());
        MainGame.instance.displayObj = new PIXI.DisplayObjectContainer();

        MainGame.instance.displayObj.zIndex = 10;
        MainGame.instance.displayObjBlock = new PIXI.DisplayObjectContainer();
        MainGame.instance.displayObjBlock.zIndex = 100;

        MainGame.instance.saveContainer = new PIXI.DisplayObjectContainer();


        stage.addChild(MainGame.instance.field);
        stage.addChild(MainGame.instance.displayObj);
        stage.addChild(MainGame.instance.displayObjBlock);
        MainGame.instance.field.addStartElementsOnField();

        MainGame.instance.tutorial = MainGame.instance.displayObjBlock.addChild(new Tutorial());

        // MainGame.instance.field.showWin();



        window.addEventListener("resize", function(){
            window.viewportSize = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
            fitLayout();
        });
        fitLayout();
        rotateGame();
        addCloseOption();

       
        requestAnimationFrame(animate);

        // MainGame.instance.field.showWin();

    }

    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
        MainGame.instance.renderer.render(stage);
    }
}




