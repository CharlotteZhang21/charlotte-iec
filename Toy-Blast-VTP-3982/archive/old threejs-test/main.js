
/*===============
 *sound
 *===============*/

var sounds = {
   pop: "pop",
   explosion: 'explosion',
   // finish: 'win',
}

var audioType;
var audio = new Audio();

var audioType = ".wav";
var muted = false;

var audios = {};
var currentAudio;

//Function to play the exact file format
function playAudio(file){
    currentAudio = file;
    if(!muted){
        currentAudio.play();
    }
}

function stopAudio() {
    if(currentAudio!== undefined){
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}


function generateAudio(){
    // for(var i=0; i < sounds.length; i++) {
    //     var audio = new Audio(sounds[i] + audioType);
    //     audios[sounds[i]] = audio; 
    // }

    for(var key in sounds) {
        var audio = new Audio(sounds[key] + audioType);
        audios[key] = audio;
    }

}

/*===============
 *sound
 *===============*/


/*===============
 *360 scene
 *===============*/


var gyroPresent = false;
var orientation = orientationCheck();
var lockView = true; // this restricts viewing the bottom of the 360 view with the gyroscope.

var overlay = document.getElementById('overlay-id');
var endOverlay = document.getElementById('end-overlay');
var hand = document.getElementById('hand-id');

// Inserting base64 data to save space.
var insertLogo = document.getElementById('insert-logo');
var insertSpiral = document.getElementById('insert-spiral');

var u = navigator.userAgent;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios check

var camera, controls;
var renderer;
var scene;
var clock = new THREE.Clock();
var annie = [];
var runner;
var skyBox, skyBox2, skyBox_explosion;

var reqAnim;

var coords = {
    x: 0,
    y: 0,
    rotation: 0.5
};

var raycaster = new THREE.Raycaster();;
var mouse = {};

var objects = [];
var objectsObj = {};

var sizee = 1;
var horizon = 0;

/*===== images ======*/
var imagesToAdd = [
//magic ball
    {
        name: 'explosion',
        link: explosion,
        // clickEffect: 'particles1',
        clickable: false,
        visible: false,
        animateStart: false, // control whether the animate should start or not
        audio: "explosion",
        position: [0,  horizon, -.5],
        rotation: {
            x: THREE.Math.degToRad(0),
            y: THREE.Math.degToRad(0),
            z: THREE.Math.degToRad(0),
        },
        size: [256/150 * sizee, 256/150  *sizee, .5],
        animation: [5, 3, 15, 60, false],
    },

];

var addedImages = {} // Reference for tweening 
var animationInstructions = {};
var textureReference = {};


function initScene() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // camera

    var FOV = orientationCheck()=='portrait' ? 65 : 60;

    camera = new THREE.PerspectiveCamera(FOV, document.body.clientWidth / document.body.clientHeight, 1, 1000);
    camera.target = new THREE.Vector3(0,0,0);
    camera.position.z = 1;

    controls = new DeviceOrientationController(camera);
    // scene

    scene = new THREE.Scene();


    var textureLoader = new THREE.TextureLoader();

    // renderer

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);
    container.appendChild(renderer.domElement);



    //

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    


    /************* 
     * Use 2 background images, animating the background
     *************/
    var textures = getTexturesFromAtlasFile(imageSource, 6);
    var textures2 = getTexturesFromAtlasFile(imageSource2, 6);
    // var textures3 = getTexturesFromAtlasFile(imageSource3, 6);

    var materials = [], materials2 = [], materials3 = [];
    for (var i = 0; i < 6; i++) {
        materials.push(new THREE.MeshBasicMaterial({
            map: textures[i]
        }));
    }

    for (var i = 0; i < 6; i++) {
        materials2.push(new THREE.MeshBasicMaterial({
            map: textures2[i]
        }));
    }


    // for (var i = 0; i < 6; i++) {
    //     materials3.push(new THREE.MeshBasicMaterial({
    //         map: textures3[i]
    //     }));
    // }

    skyBox = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), materials);
     skyBox.applyMatrix(new THREE.Matrix4().makeScale(800, 800, -800));
    scene.add(skyBox);

    skyBox2 = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), materials2);
     skyBox2.applyMatrix(new THREE.Matrix4().makeScale(800, 800, -800));
    scene.add(skyBox2);

    skyBox_explosion = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), materials3);
    skyBox_explosion.applyMatrix(new THREE.Matrix4().makeScale(800, 800, -800));
    scene.add(skyBox_explosion);

    skyBox.visible = false;
    skyBox2.visible = false;
    // skyBox_explosion.visible = false;
    // setInterval(function(){
    //     if(skyBox2.visible)
    //         skyBox2.visible = false;
    //     else 
    //         skyBox2.visible = true;
    // }, 1e3);


    /************* 
     * BackgroundEnd
     *************/

    for (var i = 0; i < imagesToAdd.length; i++) {
        addedImages[imagesToAdd[i]['name']] = createImage(imagesToAdd[i], i);

    }



    // animationInstructions["dragon1"].start();

}

//load the background material texture image
function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {

    var textures = [];

    for (var i = 0; i < tilesNum; i++) {

        textures[i] = new THREE.Texture();

    }

    var imageObj = new Image();


    imageObj.onload = function() {

        var canvas, context;
        var tileWidth = imageObj.height;

        for (var i = 0; i < textures.length; i++) {

            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage(imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
            textures[i].image = canvas
            textures[i].needsUpdate = true;
        }

    };
    imageObj.src = atlasImgUrl;
    // imageObj.src = imageSource;

    return textures;

}

function animate(time) {


    controls.update();

    renderer.render(scene, camera);

    reqAnim = requestAnimationFrame(animate);

    this.vector = new THREE.Vector3(0, 0, -1);
    this.vector.applyQuaternion(camera.quaternion);

    for (var i = 0; i < imagesToAdd.length; i++) {
        if (imagesToAdd[i].hasOwnProperty('animateOnSight')) {

            if (imagesToAdd[i].animateOnSight !== 'done' &&
                this.vector.x < imagesToAdd[i].animateOnSight[0] + .05 &&
                this.vector.x > imagesToAdd[i].animateOnSight[0] - .05
            ) {
                imagesToAdd[i].animateOnSight = 'ready';

            }     
           
        }
    }

    var delta = clock.getDelta();

    for (var i = 0; i < annie.length; i++) {
        annie[i].update(1000 * delta);
    }

    var multiplier = 1;
    if (this.vector.x < 0) {
        multiplier = -1;
    }
    var angle = Math.acos(this.vector.z/Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y + this.vector.z * this.vector.z)) * 180/Math.PI * multiplier + 180;

    if (angle > 180) {
        angle -= 270;
    } else {
        angle += 90;
    }
    angle -= 90;
    angle *= -1;

    TWEEN.update(time);



}

function createImage(obj, arrayInPosition) {
    var texture = new THREE.ImageUtils.loadTexture(obj.link);
    var delay = obj.delay || 0;
    if (obj.hasOwnProperty('spritesheetData')) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(obj.spritesheetData[2]/498, obj.spritesheetData[3]/1265);
        texture.offset.x = (obj.spritesheetData[0])/498;
        texture.offset.y = (1265 - obj.spritesheetData[1] - obj.spritesheetData[3])/1265;
    }
    if (obj.hasOwnProperty('animation')) {
        // var delay = obj.animationDelay || 0;
        var pushtoArray = new TextureAnimator(texture, obj.animation[0], obj.animation[1], obj.animation[2], obj.animation[3], arrayInPosition, obj.animation[4], obj.position[0], obj.position[2]); // texture, #horiz, #vert, #total, duration.
        // pushtoArray.delay = delay;
        annie.push(pushtoArray);
    }
    var material = new THREE.MeshBasicMaterial({
        transparent: true,
        map: texture,
        side: THREE.DoubleSide
    });

    material.opacity = typeof(obj.opacity) === 'undefined' ? 1 : obj.opacity;

    textureReference[obj.name] = material;

    var geometry = new THREE.PlaneGeometry(obj.size[0], obj.size[1], obj.size[2]);
    entity = new THREE.Mesh(geometry, material);
    entity.position.x = obj.position[0];
    entity.position.y = obj.position[1];
    entity.position.z = obj.position[2];
    entity.rotation.x = obj.rotation.x || 0;
    entity.rotation.y = obj.rotation.y || 0;
    entity.rotation.z = obj.rotation.z || 0;
    entity.name = obj.name;
    entity.audio = obj.audio || null;
    entity.clickable = obj.clickable || false;
    entity.visible = obj.visible == undefined? true : false;
    entity.clickEffect = obj.clickEffect;
    scene.add(entity);
    objects.push(entity);
    objectsObj[obj.name] = entity;
    
    return entity;
}



function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, arrayInPosition, loop, x, z) {


    // note: texture passed by reference, will be updated by the update function.
    this.ready = imagesToAdd[arrayInPosition].animateOnSight || 'ready';

    this.animateStart = imagesToAdd[arrayInPosition].animateStart === undefined? true : imagesToAdd[arrayInPosition].animateStart;

    this.arrayPos = arrayInPosition;
    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    this.xPos = x;
    this.zPos = z;
    // how many images does this spritesheet contain?
    //  usually equals tilesHoriz * tilesVert, but not necessarily,
    //  if there at blank tiles at the bottom of the spritesheet. 
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    // how long should each image be displayed?
    this.tileDisplayDuration = tileDispDuration;

    // how long has the current image been displayed?
    this.currentDisplayTime = 0;

    // which image is currently being displayed?
    this.currentTile = 0

    this.loop = loop;
    this.counter = 0;

    texture.offset.x = 0;
    texture.offset.y = 1/this.tilesVertical;

    this.update = function(milliSec) {
        this.ready = imagesToAdd[this.arrayPos].animateOnSight || 'ready';
        if (this.ready === 'ready' && objectsObj[imagesToAdd[arrayInPosition].name].animateStart) {
            if (this.loop || this.loop == false && this.counter < this.numberOfTiles) {
                this.currentDisplayTime += milliSec;
                while (this.currentDisplayTime > this.tileDisplayDuration) {
                    this.currentDisplayTime -= this.tileDisplayDuration;
                    this.currentTile++;
                    if (this.currentTile == this.numberOfTiles && loop)
                        this.currentTile = 0;
                    if (this.currentTile == this.numberOfTiles && !loop) {
                        scene.remove(objects[this.arrayPos]);
                    }
                    var currentColumn = this.currentTile % this.tilesHorizontal;
                    texture.offset.x = currentColumn / this.tilesHorizontal;
                    var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
                    texture.offset.y = Math.abs( 1 - currentRow / this.tilesVertical) - 1/this.tilesVertical;
                    if (!this.loop) {
                        this.counter++;
                    }
                }
            }
        }
    };
}


function onDocumentTouchStart(event) {


    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);

}


function onDocumentMouseDown(event) {

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // console.log("mousex : " + mouse.x + "mousY: " + mouse.y);
    var intersects = raycaster.intersectObjects(objects);
    
    if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {
        
            if (intersects[i].object.hasOwnProperty('clickable') && intersects[i].object.clickable === true) {
                // updateTexture(intersects[i].object);
                
                playAudio(audios['correct']);
                intersects[i].object.clickable = false;
                var onClickEffect = intersects[i].object.clickEffect;
                objectsObj[onClickEffect].animateStart = true;

                objectsObj[onClickEffect].visible = true;

                showAndAnimate(intersects[i].object, event.clientX, event.clientY);


            }else {
                console.log('wrong');
                playAudio(audios['wrong']);
            }
        }

    }else {
        // console.log('wrong');
        // playAudio(audios['wrong']);
    }
}

var centerScreen = document.getElementById("centerScreen");

function showAndAnimate(obj, posX, posY) {
    obj.visible = false;

    var item = document.getElementById('found_' + obj.name);
    removeClass(item, 'hide');
    item.style.top = posY + 'px';
    item.style.left = posX + 'px';


    TweenMax.to(item, 1, {
        top: centerScreen.offsetTop + centerScreen.clientHeight / 2,
        left: centerScreen.offsetLeft + centerScreen.clientWidth / 2,
        scale: 2,
        ease:Quad.easeInOut,
        onComplete: function(){

            var nextPoint = document.getElementById("dock-" + obj.name);


            var targetScale = nextPoint.clientWidth / item.clientWidth;

            var parent = nextPoint.parentNode;

             TweenMax.to(item, 1, {
                top: parent.offsetTop + nextPoint.offsetTop + nextPoint.offsetHeight / 2,
                left: parent.offsetLeft + nextPoint.offsetLeft + nextPoint.offsetWidth / 2,
                scale: targetScale,
                ease: Quad.easeInOut,
                onComplete: function(){
                    
                    addClass(item, 'hide');                        
                    addClass(nextPoint, 'fadeInTransition')
                    nextPoint.src = obj.name + '.png';
                    //fade in out the dock item 
                    var container = $('#objectsDock');
                    var className = "fadeInTransition";
                    if(checkChildrenHaveClass(container, className)===true){
                       endgame();
                    };
                }
             });
        },
    },
    )

}

function checkChildrenHaveClass(container, className) {
    
    
    var childrenGrp = container.children('.object');

    

    if(childrenGrp.length > 0){
        for (var i = 0; i < childrenGrp.length; i++) {
            var node = childrenGrp[i];
            
            if(node.className.indexOf('fadeInTransition') == -1){
    
                return false;
            }
        }
    }
    
    return true;
}

function spiralAway(obj) {
    console.log(obj);
    var coords = {
        scale: 1,
        rotation: 10,

    }
    var spiral = new TWEEN.Tween(coords)
        .to({
            scale: 0,
            rotation: 0,
        }, 1000)
        .onUpdate(function() {
            addedImages[obj].rotation.z = this.rotation;
            addedImages[obj].scale.set(this.scale, this.scale, 0);
        })
    spiral.interpolation(TWEEN.Interpolation.Bezier);
    spiral.start();

}

function endgame() {
    

    
    TweenMax.to($('#logo'), 3, {
        top: '10%',
        scale: 1.4,
        rotation: 360,
        delay: 0.5,
        ease: Elastic.easeOut.config(1, 0.6),
    });

    TweenMax.to($('#character'), 1.5, {
        top: '40%',
        delay: 0.5,
        ease: Elastic.easeOut.config(1, 0.5),
    });

    // document.getElementById('end-screen').addEventListener('click', function(){

    // })

    if(ASOI) {
        setTimeout(function(){
            stopAudio();
            doSomething('download');
        }, 2000);
    }

}

function downloadAndMute() {
    stopAudio();
    doSomething("download");
}

function closeAndMute() {
    stopAudio();
    doSomething('close');
}


/*===============
 *360 scene
 *===============*/


var debug = false;
var startOverlayTimer = null;

document.ontouchmove = function(e) {
    e.preventDefault();
}

var dynamicLocal = 'v2';
var ASOI = true;
var closeButtonTimerDuration = 0; //seconds
// var containersToLocalise = [
//     'findObjects',
//     'tapToPlay',
//     'goodJob'
// ]

window.onload = function() {
    removeClass(document.body, 'preload');
    generateAudio();
    setTimeout(function(){
        removeClass(document.getElementById('vungle-close'), 'hide');
    }, closeButtonTimerDuration * 1000);


    loadTNT();


    if(dynamicLocal !==undefined && dynamicLocal == 'v2'){

        // for (var i = 0; i < containersToLocalise.length; i++) {
           // var findObjectsContainer = document.getElementById('findObject');
           // findObjectsContainer.innerHTML = getLocalisedFindObjects().text;
           // findObjectsContainer.style.font = getLocalisedFindObjects().font;

           // var tapToPlayContainer = document.getElementById('tapToPlay');
           // tapToPlayContainer.innerHTML = getLocalisedTapToPlay().text;               
           // tapToPlayContainer.style.font = getLocalisedTapToPlay().font;



           // var goodJobContainer = document.getElementById('goodJob');
           // goodJobContainer.innerHTML = getLocalisedGoodJob().text;               
           // goodJobContainer.style.font = getLocalisedGoodJob().font;

           // var container = document.getElementById('findObjects');
           // container.innerHTML = getLocalisedFindObjects().text;
           // container.style.font = getLocalisedFindObjects().font;

        // }
         
        

    }


    //360 tool tip
    // document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled visible";

    //cta
    document.getElementById('vungle-cta-button').addEventListener('click', function(){
        stopAudio();
        doSomething("download");
    })


    //listen to the first tap
    
    $('#background_2D').click(function(){
        skyBox.visible = true;
        $('#startOverlay').addClass('fade');
        $('#board_2D').addClass('zoomOut');
        setTimeout(function(){
            $('#board_2D').addClass('fade');
        }, 400)
        
    })

    var pBar = $('#tntProgress')[0];
    var tntCharged = pBar.value;
    
    var tntEverTap = 20; // how much does one tap charge the tnt
    $('#centerScreen').click(function(){
       
        tntCharged += tntEverTap;
        
        if(pBar.value < pBar.max){
            pBar.value = tntCharged;
        }else {
            pBar.value = pBar.max;

            setTimeout(function(){
                explodeTNT();

            }, 500);
        }

        playAudio(audios['pop']);
    })

    initCta();
    // console.log(isiOS)
    // if(!isiOS)
    //start overlay

    // if(!debug)
    // startOverlayTimer = setTimeout(function(){
        // hideTooltip();
    // }, 3e3);

    document.getElementById('startOverlay').addEventListener('mousedown', function(){
        // hideTooltip();
    })

    window.addEventListener('resize', onWindowResize, false);



    initScene();

    animate();

};

function explodeTNT() {
    // cancel the click event
    $('#centerScreen').off("click"); 
   
    
        skyBox.visible = false;

    // setTimeout(function(){
    //     skyBox_explosion.visible = true;
    // }, 200);

    // setTimeout(function(){
        // skyBox_explosion.visible = false;
        skyBox2.visible = true;
    // }, 200);
    $('#tntProgress').addClass("fade");

    //playExplosionAnimation
    objectsObj['explosion'].animateStart = true;
    objectsObj['explosion'].visible = true;

    var sakuraNewOn = 100;
    var block_colours = ["red", "blue", "yellow"];
    $('#centerScreen').sakura({
        className: block_colours,
        maxSize: 50,
        minSize: 30,
        fallSpeed: 0.1, 
        newOn: sakuraNewOn
    });

    playAudio(audios['explosion']);

    endgame();
}

function hideTooltip() {
    if(startOverlayTimer != null){
        clearTimeout(startOverlayTimer);
    }
    document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled";
    addClass(document.getElementById('startOverlay'), 'fadeOut');
    addClass(document.getElementById('objectsDock'), 'moveDockUp');

    window.addEventListener( 'touchstart', onDocumentTouchStart, true );

}

function initCta(){
    var text = getLocalisedCta().text;
    var fontFamily = getLocalisedCta().font;
    var fontSizeMultiplier = getLocalisedCta().fontSizeMultiplier;

    var fontSize = document.getElementById('cta-img').offsetHeight * fontSizeMultiplier;

    document.getElementById('cta-text').innerHTML = text;

    // var fontMarginTop = orientationCheck()=='portrait'? document.getElementById('cta-img').offsetHeight * 0.05 : document.getElementById('cta-img').offsetHeight * 0.3;



    document.getElementById('cta-text').style.fontSize = fontSize + 'px';
    // document.getElementById('cta-text').style.top = fontMarginTop + 'px';

    // document.getElementById('cta-text').offsetWidth = document.getElementById('cta-img').offsetWidth * 0.8;
    

    document.getElementById('cta-text').style.opacity = 1;

      
}


function onWindowResize() {
    initCta();
    camera.aspect = document.body.clientWidth / document.body.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);
}


function loadTNT() {
    
    let gltfs = [];
    let urls = ['TNT.gltf'];

    var newScale = 50;
    console.log('gere');
    // let urls = []
    let loader = new THREE.GLTFLoader();
    // loader.setDRACOLoader(new THREE.DRACOLoader());
    let self = this;
    for (let i = 0; i < urls.length; i++) {

        loader.parse(ASSETS[urls[i]], urls[i], function(gltf) {


            if(gltf.parser.options.path === 'TNT.gltf') {

                gltf.scene.scale.x = newScale;
                gltf.scene.scale.y = newScale;
                gltf.scene.scale.z = newScale;
            }

            gltfs[i] = gltf;
        });
        // loader.load(urls[i], function (gltf) {
            // self.gltfs[i] = urls[i];
        // });
    }
}