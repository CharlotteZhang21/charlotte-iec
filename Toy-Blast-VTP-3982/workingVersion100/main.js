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
function playAudio(file) {
    currentAudio = file;
    if (!muted) {
        currentAudio.play();
    }
}

function stopAudio() {
    if (currentAudio !== undefined) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}


function generateAudio() {
    // for(var i=0; i < sounds.length; i++) {
    //     var audio = new Audio(sounds[i] + audioType);
    //     audios[sounds[i]] = audio; 
    // }

    for (var key in sounds) {
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

// Inserting base64 data to save space.

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

];

var addedImages = {} // Reference for tweening 
var animationInstructions = {};
var textureReference = {};

function initScene() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // camera

    var FOV = orientationCheck() == 'portrait' ? 65 : 70;

    camera = new THREE.PerspectiveCamera(FOV, document.body.clientWidth / document.body.clientHeight, 1, 1000);
    camera.target = new THREE.Vector3(0, 0, 0);
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

    skyBox = new THREE.CubeTextureLoader().setPath('').load([
        panoleft,
        panoright,
        panotop,
        panobottom,
        panoback,
        panofront,
    ]);


    skyBox2 = new THREE.CubeTextureLoader().setPath('').load([
        left2,
        right2,
        top2,
        bottom2,
        back2,
        front2,
    ]);
    scene.background = skyBox2;
    scene.background.rotation = 180;

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
    var angle = Math.acos(this.vector.z / Math.sqrt(this.vector.x * this.vector.x + this.vector.y * this.vector.y + this.vector.z * this.vector.z)) * 180 / Math.PI * multiplier + 180;

    if (angle > 180) {
        angle -= 270;
    } else {
        angle += 90;
    }
    angle -= 90;
    angle *= -1;

    TWEEN.update(time);

    // show my 3D model
    if (this.myGltf) {
        updateAndShow();
    }
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
    var intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
        for (var i = 0; i < intersects.length; i++) {

            if (intersects[i].object.hasOwnProperty('clickable') && intersects[i].object.clickable === true) {
                // updateTexture(intersects[i].object);

                playAudio(audios['pop']);
                TNTClick();
            } else {
                console.log('wrong');
                playAudio(audios['wrong']);
            }
        }

    } else {
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
        ease: Quad.easeInOut,
        onComplete: function() {

            var nextPoint = document.getElementById("dock-" + obj.name);


            var targetScale = nextPoint.clientWidth / item.clientWidth;

            var parent = nextPoint.parentNode;

            TweenMax.to(item, 1, {
                top: parent.offsetTop + nextPoint.offsetTop + nextPoint.offsetHeight / 2,
                left: parent.offsetLeft + nextPoint.offsetLeft + nextPoint.offsetWidth / 2,
                scale: targetScale,
                ease: Quad.easeInOut,
                onComplete: function() {

                    addClass(item, 'hide');
                    addClass(nextPoint, 'fadeInTransition')
                    nextPoint.src = obj.name + '.png';
                    //fade in out the dock item 
                    var container = $('#objectsDock');
                    var className = "fadeInTransition";
                    if (checkChildrenHaveClass(container, className) === true) {
                        endgame();
                    };
                }
            });
        },
    }, )

}

function checkChildrenHaveClass(container, className) {


    var childrenGrp = container.children('.object');



    if (childrenGrp.length > 0) {
        for (var i = 0; i < childrenGrp.length; i++) {
            var node = childrenGrp[i];

            if (node.className.indexOf('fadeInTransition') == -1) {

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
    setTimeout(function() {
        this.myGltf.scene.visible = false;
    }, 500);

    TweenMax.set($('#logo'), { transformOrigin: "50% 50% 0" });
    TweenMax.to($('#logo'), 2, {
        top: $('#logo-final').position().top,
        scale: 1.4,
        rotation: 360,
        delay: 1.5,
        ease: Elastic.easeOut.config(1, 0.6),
    });

    TweenMax.to($('#character'), 1.5, {
        // top: '40%',
        top: $('#character-final').position().top,
        delay: 1.5,
        ease: Elastic.easeOut.config(1, 0.5),
    });

    // document.getElementById('end-screen').addEventListener('click', function(){

    // })

    if (ASOI) {
        setTimeout(function() {
            stopAudio();
            doSomething('download');
        }, 3000);
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
var containersToLocalise = [
    'findObjects',
    // 'tapToPlay',
    // 'goodJob'
]


var pBar = $('#tntProgress')[0];
var tntCharged = pBar.value;

var tntEverTap = 20; // how much does one tap charge the tnt

var handTween = null;
var handTween2 = null;
window.onload = function() {
    removeClass(document.body, 'preload');
    generateAudio();


    /*===start tutorial animation===*/
    handTween = TweenMax.to($('#hand'), 0.5, {
        rotation: -15,
        ease: Expo.easeInOut,
        yoyo: true, 
        repeat:3,
        delay: 0.5,
        onComplete: function() {
            TweenMax.to($('#hand'), 0.5, {
                opacity: 0,
                ease: Linear.None
            })
            handTween.kill();
        }
    });

    setTimeout(function() {
        removeClass(document.getElementById('vungle-close'), 'hide');
    }, closeButtonTimerDuration * 1000);

    this.lastFrameTime = 0;


    // document.addEventListener('keydown', checkKey.bind(this), false);

    // function checkKey(e) {

    //     var inc = 0.1;

    //     e = e || window.event;

    //     if (e.keyCode == '38') {
    //         // up arrow
    //         this.myGltf.scene.position.x += inc;
    //         console.log(this.myGltf.scene.position.x);

    //         localStorage.setItem('x', this.myGltf.scene.position.x);
    //     } else if (e.keyCode == '40') {
    //         // down arrow
    //         this.myGltf.scene.position.x -= inc;
    //         console.log(this.myGltf.scene.position.x);
    //         localStorage.setItem('x', this.myGltf.scene.position.x);
    //     } else if (e.keyCode == '37') {
    //         // left arrow
    //         this.myGltf.scene.position.z -= inc;
    //         localStorage.setItem('z', this.myGltf.scene.position.z);
    //     } else if (e.keyCode == '39') {
    //         // right arrow
    //         this.myGltf.scene.position.z += inc;
    //         localStorage.setItem('z', this.myGltf.scene.position.z);
    //     }
    // }

    if (dynamicLocal !== undefined && dynamicLocal == 'v2') {

        for (var i = 0; i < containersToLocalise.length; i++) {
            var findObjectsContainer = document.getElementById('findObject');
            findObjectsContainer.innerHTML = getLocalisedFindObjects().text;
            findObjectsContainer.style.font = getLocalisedFindObjects().font;
            TweenMax.to($('#findObject'), 0.5, {
                opacity: 1,
                ease: Linear.None
            });

        }



    }

    //cta
    document.getElementById('vungle-cta-button').addEventListener('click', function() {
        stopAudio();
        doSomething("download");
    })


    //listen to the first tap

    $('#startOverlay').on('touchstart', function() {
        // skyBox.visible = true;

        loadTNT();

        window.addEventListener('touchstart', onDocumentTouchStart, true);
        
        if (handTween != null) {
            handTween.kill();
            TweenMax.to($('#hand'), 0.5, {
                opacity: 0,
                ease: Linear.None,
                onComplete: function() {
                    $('#hand').css({'opacity': 1, transform: 'rotate(0deg)'});

                    handTween2 = TweenMax.to($('#hand'), 0.5, {
                        rotation: -15,
                        ease: Expo.easeInOut,
                        yoyo: true,
                        repeat: 3,
                        delay: 0.5,
                        onComplete: function() {
                            TweenMax.to($('#hand'), 0.5, {
                                opacity: 0,
                                ease: Linear.None,
                                onComplete: function(){
                                    handTween2.kill();
                                }
                            })
                        }
                    })
                }
            })
        }
        $('#startOverlay').addClass('fade');
        $('#board_2D').addClass('zoomOut');
        setTimeout(function() {
            $('#board_2D').addClass('fade');
        }, 400)

        setTimeout(function() {
            $('#hand').removeClass('animate');
        }, 2000);

    })

    initCta();
    // console.log(isiOS)
    // if(!isiOS)
    //start overlay

    // if(!debug)
    // startOverlayTimer = setTimeout(function(){
    // hideTooltip();
    // }, 3e3);

    window.addEventListener('resize', onWindowResize, false);

    initScene();

    animate();

};



function TNTClick() {
    if(handTween2 != null) {
        TweenMax.to($('#hand'), 0.5, {
                opacity: 0,
                ease: Linear.None
            })
        handTween2.kill();
    }
    tntCharged += tntEverTap;

    if (tntCharged < pBar.max) {

        pBar.value = tntCharged;

    } else {

        pBar.value = pBar.max;

        explodeTNT();

    }

    playAudio(audios['pop']);

    this.myGltfAction.reset();
    this.myGltfAction.play();

}

function explodeTNT() {

    scene.background = skyBox;
    TweenMax.to($('#explosion-layer-2'), 0.2, {
        opacity: 1,
        ease: Linear.None
    });
    TweenMax.to($('#explosion-layer-2'), 0.5, {
        scale: 100,
        // rotation: 360,
        delay: 0.1,
        ease: Linear.easeIn,
        onComplete: function() {
            TweenMax.to($('#explosion-layer-2'), 0.3, {
                opacity: 0,
                ease: Linear.None
            });

        }
    });

    TweenMax.to($('#explosion-layer-1'), 0.5, {
        scale: 100,
        opacity: 1,
        delay: 0.5,
        ease: Linear.easeIn,
        onComplete: function() {
            TweenMax.to($('#explosion-layer-1'), 1, {
                opacity: 0,
                ease: Linear.None
            });
            
        }
    });



    TweenMax.to($('#smoke-1'), 0.2, {
        opacity: 1,
        top: $('#smoke-1-final').position().top,
        scale: 2,
        ease: Linear.None
    });
    TweenMax.to($('#smoke-2'), 0.2, {
        opacity: 1,
        top: $('#smoke-2-final').position().top,
        scale: 6,
        ease: Linear.None
    });


    TweenMax.to($('#smoke-1'), 3, {
        top: '-100%',
        scale: 3,
        ease: Linear.None,
        onComplete: function(){
            TweenMax.to($('smoke-2'), 0.5, {
                opacity: 0
            })
        }
    });

    TweenMax.to($('#smoke-2'), 5, {
        top: '-100%',
        scale: 1.5,
        ease: Linear.None,
        onComplete: function(){
            TweenMax.to($('smoke-2'), 0.5, {
                opacity: 0
            })
        }
    });

    var sakuraNewOn = 100;
    var block_colours = ["red", "blue", "yellow"];
    setTimeout(function() {
        $('#centerScreen').sakura({
            className: block_colours,
            maxSize: 50,
            minSize: 30,
            fallSpeed: 0.1,
            newOn: sakuraNewOn
        });

    }, 1000);


    $('#tntProgress').addClass("fade");

    playAudio(audios['explosion']);

    endgame();
}

function hideTooltip() {
    if (startOverlayTimer != null) {
        clearTimeout(startOverlayTimer);
    }
    document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled";
    addClass(document.getElementById('startOverlay'), 'fadeOut');
    addClass(document.getElementById('objectsDock'), 'moveDockUp');



}

function initCta() {
    var text = getLocalisedCta().text;
    var fontFamily = getLocalisedCta().font;
    var fontSizeMultiplier = getLocalisedCta().fontSizeMultiplier;

    var fontSize = document.getElementById('cta-img').offsetHeight * fontSizeMultiplier;

    document.getElementById('cta-text').innerHTML = text;



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

    this.myGltf;
    this.myGltfAction;

    var urls = ['TNT.gltf'];

    var newScale = orientationCheck() == 'portrait'? 0.65 : 1;

    // var urls = []
    var loader = new THREE.GLTFLoader();
    // loader.setDRACOLoader(new THREE.DRACOLoader());
    var self = this;
    for (var i = 0; i < urls.length; i++) {

        loader.parse(ASSETS[urls[i]], urls[i], function(gltf) {


            if (gltf.parser.options.path === 'TNT.gltf') {

                gltf.scene.scale.x = newScale;
                gltf.scene.scale.y = newScale;
                gltf.scene.scale.z = newScale;

                gltf.scene.position.x = 0;
                gltf.scene.position.y = 0;
                gltf.scene.position.z = -1.55;

                gltf.scene.rotation.x = THREE.Math.degToRad(15);
                gltf.scene.rotation.y = THREE.Math.degToRad(0);
                gltf.scene.rotation.z = 0;
            }



            // objects.push(this.myGltf);
            gltf.scene.traverse(function(object) {

                if (object.isMesh) {
                    object.clickable = true;
                    objects.push(object);
                }

            });

            this.myGltf = gltf;

            // Remove the old character before adding the new one.
            var gyroGroup = new GyroGroup();
            gyroGroup.add(gltf.scene);
            this.scene.add(gyroGroup);
            this.mixer = new THREE.AnimationMixer(gltf.scene);
            // The first animation seems to be always idle.
            var clip = gltf.animations[0];

            this.myGltfAction = this.mixer.clipAction(clip);

            this.myGltfAction.setLoop(THREE.LoopOnce)


        });
        // loader.load(urls[i], function (gltf) {
        // self.gltfs[i] = urls[i];
        // });
    }
}

function updateAndShow() {
    if (this.mixer != null) {
        var frameTime = window.performance.now() * 1.0e-3;
        var deltaTime = 0;
        if (this.lastFrameTime !== 0) {
            deltaTime = frameTime - this.lastFrameTime;
        }
        this.lastFrameTime = frameTime;
        // Animate the character model.
        this.mixer.update(deltaTime);
        // Add gyro rotation to the background.
        // this.background.update(this.camera.position);
        this.renderer.clearDepth();
        // Render the background.
        // this.renderer.render(this.backgroundScene, this.backgroundCamera);
        // Don't clear the buffers and render the foreground.
        this.renderer.render(this.scene, this.camera);
        // Give orbit controls a chance to damp the rotation if needed.
        this.controls.update();
    }
}