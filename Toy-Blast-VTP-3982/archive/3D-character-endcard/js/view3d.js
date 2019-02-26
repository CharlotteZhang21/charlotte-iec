"use strict";

class View3D {

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        // We need to prevent automatic overwriting of buffers between renders
        // as we will render the background first from one camera and the character model
        // afterwards from a different camera without clearing the frame.
        this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Jay's models do not look right without these colour settings.
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.autoClear = false;
        this.renderer.autoClearColor = false;
        this.container = document.getElementById("container");
        this.container.appendChild(this.renderer.domElement);
        let aspect = window.innerWidth / window.innerHeight;
        // The camera for the character model, will be moved by orbit controls.
        this.camera = new THREE.PerspectiveCamera(65, aspect, 5, 2000);
        this.camera.position.set(0, 0, 400);
        // The centre of the character is at the origin.
        this.camera.lookAt(0, 0, 0);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.screenSpacePanning = false;
        this.controls.enablePan = false; // Pinch and zoom only.
        this.controls.enableRotate = true;
        this.controls.minDistance = 120;
        this.controls.maxDistance = 600;
        // Used to time the character animation tracks.
        this.lastFrameTime = 0;
        window.addEventListener("resize", this.onWindowResize, false);
        // Slideshow (top left button) removes most of the buttons from the screen.
        let slideshowButton = document.querySelector("#slideshow-button");
        slideshowButton.addEventListener("click", function () {
            let download = document.querySelector("#download");
            let actions = document.querySelector("#actions");
            let hidden = document.querySelectorAll(".hide-me");
            if (download.style.display === "none") {
                download.style.display = "flex";
                actions.style.display = "grid";
                for (let i = 0; i < hidden.length; i++) {
                    hidden[i].style.display = "block"
                }
            } else {
                download.style.display = "none";
                actions.style.display = "none";
                for (let i = 0; i < hidden.length; i++) {
                    hidden[i].style.display = "none";
                }
            }
        });
        // We need a new scene and camera for the background as this needs to be
        // stationary except for gyro motion.  Orbit controls will not affect it.
        this.backgroundScene = this.scene.clone();
        this.backgroundCamera = this.camera.clone();
        let gyroGroup = new GyroGroup();
        this.background = new Background(gyroGroup);
        this.backgroundScene.add(gyroGroup);
    }

    updateAndShow() {
        if (this.mixer != null) {
            let frameTime = window.performance.now() * 1.0e-3;
            let deltaTime = 0;
            if (this.lastFrameTime !== 0) {
                deltaTime = frameTime - this.lastFrameTime;
            }
            this.lastFrameTime = frameTime;
            // Animate the character model.
            this.mixer.update(deltaTime);
            // Add gyro rotation to the background.
            this.background.update(this.camera.position);
            this.renderer.clearDepth();
            // Render the background.
            this.renderer.render(this.backgroundScene, this.backgroundCamera);
            // Don't clear the buffers and render the foreground.
            this.renderer.render(this.scene, this.camera);
            // Give orbit controls a chance to damp the rotation if needed.
            this.controls.update();
        }
    }

    replaceCharacter(gltf) {
        // Remove the old character before adding the new one.
        if (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        let gyroGroup = new GyroGroup();
        gyroGroup.add(gltf.scene);
        this.scene.add(gyroGroup);
        this.mixer = new THREE.AnimationMixer(gltf.scene);
        // The first animation seems to be always idle.
        let clip = gltf.animations[0];
        let action = this.mixer.clipAction(clip);
        action.play();
        this.gltf = gltf;
    }

    replaceAnimation(animationClip) {
        // Swap to a new animation with the same model.
        this.mixer = new THREE.AnimationMixer(this.gltf.scene);
        let action = this.mixer.clipAction(animationClip);
        action.play();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}