"use strict";

class Characters {

    constructor() {
        this.gltfs = [];
        this.load();
        this.current = 0;
    }

    load() {
        // The non-draco versions load much more quickly, but draco compression
        // might help if we have more complex models.
        
        // let urls = ["gltf/dragon/dragon.gltf", "gltf/female/female.gltf", "gltf/hero/hero.gltf", 'TNT_01b_2018.gltf'];

        let urls = ['TNT.gltf'];

        var newScale = 50;
        
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

                self.gltfs[i] = gltf;
            });
            // loader.load(urls[i], function (gltf) {
                // self.gltfs[i] = urls[i];
            // });
        }
    }

    getPreviousCharacter() {
        if (this.gltfs == null) {
            return null;
        }
        let previous = (this.current + this.gltfs.length - 1) % this.gltfs.length;
        if (this.gltfs[previous] != null) {
            this.current = previous;
            return this.gltfs[previous];
        }
        return null;
    }

    getNextCharacter() {
        if (this.gltfs == null) {
            return null;
        }
        let next = (this.current + 1) % this.gltfs.length;
        if (this.gltfs[next] != null) {
            this.current = next;
            return this.gltfs[next];
        }
        return null;
    }

    getCurrent() {
        return this.gltfs[this.current];
    }
}