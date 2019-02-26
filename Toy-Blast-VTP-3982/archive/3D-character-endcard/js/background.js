"use strict";

class Background {

    constructor(scene) {
        this.plane = new THREE.Plane();
        // We have to make the picture big enough to go far enough back to not
        // interfere with the scene.

        this.skybox = new THREE.CubeTextureLoader().setPath('').load([
                panoright,
                panoleft,
                panotop,
                panobottom,
                panofront,
                panoback,
            ]);

        // scene.background = this.skyBox;
        

        let geometry = new THREE.PlaneBufferGeometry(1920 * 2, 1080 * 2, 1, 1);
        // let texture = new THREE.TextureLoader().load(ASSETS["images/lava-bg.png"]);
        let texture = this.skybox;
        let material = new THREE.MeshBasicMaterial({map: texture});
        this.plane = new THREE.Mesh(geometry, material);
        this.d = -400;
        this.plane.position.z = this.d;
        scene.add(this.plane);
    }

    update(cameraPosition) {
        // Set the distance of the plane from the origin depending on the distance
        // of the model camera.  Background camera never moves.
        this.plane.position.z = this.d - Math.sqrt(cameraPosition.x * cameraPosition.x
            + cameraPosition.y * cameraPosition.y
            + cameraPosition.z * cameraPosition.z) / 1.6;
    }
}