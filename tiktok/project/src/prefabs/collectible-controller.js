import Collectible from '../prefabs/collectible';
/*
===Collectible Controller===
Controls current state of all collectibles, instantiates them at the beginning, 
checks for any required updates.
*/
class CollectibleController {

    constructor(game) {

        this.game = game;
        this.initSignals();

        if (PiecSettings.collectibles !== undefined)
            this.createCollectibles();

        this.setupController();

    }

    initSignals() {
        this.onHudCreate = new Phaser.Signal();
        this.onCollectUpdate = new Phaser.Signal();
    }

    setupController() {

    }

    createCollectibles() {
        this.collectibles = [];

        for (var key in PiecSettings.collectibles) {

            var collectible = new Collectible(this.game, key, PiecSettings.collectibles[key]);
            collectible.onHudCreate.add(function(tag, object) {
                this.onHudCreate.dispatch(tag, object);
            }, this);
            collectible.onCollectUpdate.add(function(tag, amount) {
                this.onCollectUpdate.dispatch(tag, amount);
            }, this);

            this.collectibles[key] = collectible;
        }
    }

    getCollectible(tag) {
        return this.collectibles[tag];
    }

}

export default CollectibleController;