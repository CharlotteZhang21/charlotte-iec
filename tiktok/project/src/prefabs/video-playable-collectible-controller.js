import CollectibleController from '../prefabs/collectible-controller';

class VideoPlayableCollectibleController {

    constructor(game) {
        this.game = game;
        this.initSignals();

        this.collectibleController = new CollectibleController(this.game);
        this.collectibleList = [];
        this.collectibleListFired = [];

        this.setupController();
    }

    initSignals() {
        this.onHudCreate = new Phaser.Signal();
        this.onCollectUpdate = new Phaser.Signal();
    }

    setupController() {
        this.collectibleController.onHudCreate.add(function(tag, object) {
            this.onHudCreate.dispatch(tag, object);
        }, this);

        this.collectibleController.onCollectUpdate.add(function(tag, amount) {
            this.onCollectUpdate.dispatch(tag, amount);
            if (this.variablesController) {
                this.variablesController.applyConsequences(this.collectibleController.getCollectible(tag).consequences);
            }
        }, this);

    }


    setCollectibleAmount(tag, amount) {
        var collectible = this.collectibleController.getCollectible(tag);
        if (collectible != null)
            collectible.setCollectibleAmount(amount);
    }

    update(currentTime, variablesController, collectibleList) {

        if (!this.variablesController)
            this.variablesController = variablesController;

        if (collectibleList !== undefined) {

            if (this.collectibleList != collectibleList) {
                this.collectibleList = collectibleList;
                this.collectibleListFired = [];
            }

            for (var i = 0; i < collectibleList.length; i++) {
                var tag = collectibleList[i].tag;

                if (!this.collectibleListFired[i] &&
                    variablesController.evaluateConditions(collectibleList[i].conditions) &&
                    this.checkIfCollectibleShouldBeFired(collectibleList[i], currentTime)) {

                    this.collectibleListFired[i] = true;

                    if (collectibleList[i].spawn !== undefined && collectibleList[i].spawn) {
                        this.collectibleController.getCollectible(tag).spawnCollectibles({
                            "amount": collectibleList[i].amount,
                            "lifetime": (collectibleList[i].to - collectibleList[i].from) * 1000,
                            "spawnArea": collectibleList[i].htmlTag,
                        });
                    } else {
                        this.collectibleController.getCollectible(tag).increaseCollectibleAmount(collectibleList[i].amount, collectibleList[i].spawn);
                    }

                    this.collectibleController.getCollectible(tag).consequences = collectibleList[i].consequences;

                }
            }
        }
    }

    checkIfCollectibleShouldBeFired(collectibleElement, currentTime) {
        if (collectibleElement.from !== undefined && currentTime >= collectibleElement.from) {
            return true;
        }
        return false;
    }

}

export default VideoPlayableCollectibleController;