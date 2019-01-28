import InteractiveElement from '../prefabs/interactive-element';
import HandGestureController from '../prefabs/hand-gesture-controller';
import ProjectileGame from '../prefabs/projectile-game';
import PowerUpGame from '../prefabs/powerup-game';
import HiddenObjectGame from '../prefabs/hiddenobject-game';
import RhythmGame from '../prefabs/rhythm-game';

import * as VideoPlayableUtil from '../utils/video-playable-util';
import * as Util from '../utils/util';


class VideoPlayableInteractiveElementsController {

    constructor(game, videoPlayableStateController) {
        this.game = game;
        this.videoPlayableStateController = videoPlayableStateController;
        this.currentInteractions = null;
        this.interactiveElements = [];

        this.handGestureController = new HandGestureController(this.game);

        this.initSignals();
        this.setupController();
    }

    initSignals() {
        this.onInteract = new Phaser.Signal();
        this.onHudCreate = new Phaser.Signal();
    }

    setupController() {

    }

    update(currentTime, variablesController, interactions) {

        this.handGestureController.update();

        if (this.currentInteractions != interactions) {
            this.currentInteractions = interactions;
            this.clearCurrentInteractiveElements();
            this.createInteractiveElements(currentTime, interactions, variablesController);
        }
        //Check if we need to enable any interactive elements!
        if (interactions == undefined || interactions == null)
            return;

        // console.log(this.interactiveElements);
        for (var i = 0; i < interactions.length; i++) {
            var interaction = interactions[i];
            if (this.checkIfInteractionShouldBeEnabled(interaction, currentTime) &&
                variablesController.evaluateConditions(interactions[i].conditions)) {
                    if(this.interactiveElements.length > 0)
                        this.interactiveElements[i].enable();
                } else {
                    if(this.interactiveElements.length > 0)
                        this.interactiveElements[i].disable();
                }
        }
    }

    areThereEnabledInteractions(currentTime, variablesController, interactions) {
        if (interactions == undefined || interactions == null)
            return false;
        for (var i = 0; i < interactions.length; i++) {
            var interaction = interactions[i];
            if (this.checkIfInteractionShouldBeEnabled(interaction, currentTime) &&
                variablesController.evaluateConditions(interactions[i].conditions)) {
                return true;
            }
        }
        return false;
    }

    clearCurrentInteractiveElements() {
        var persistingElements = [];
        var length = this.interactiveElements.length;
        for (var i = 0; i < length; i++) {
            if (!this.elementShouldPersist(this.interactiveElements[i])) { //Check if the element needs to persist (it still exists in this video section)
                this.interactiveElements[i].disable();
                this.interactiveElements[i].autoDestroy(100);
            } else {
                persistingElements.push(this.interactiveElements[i]);
            }
        }
        this.interactiveElements = persistingElements;
    }

    elementShouldPersist(interactiveElement) {
        if (this.currentInteractions != undefined && this.currentInteractions != null) {
            for (var i = 0; i < this.currentInteractions.length; i++) {
                if (this.currentInteractions[i].typeOfInteraction == interactiveElement.tag && this.typeOfInteractionIsAMiniGame(this.currentInteractions[i].typeOfInteraction)) {
                    // console.log("SHOULD PERSIST");
                    return true;
                }
            }
        }
        // console.log("SHOULD NOT PERSIST");
        return false;
    }

    interactiveElementMiniGameAlreadyExists(typeOfInteraction) {
        if (this.interactiveElements != undefined && this.interactiveElements != null) {
            for (var i = 0; i < this.interactiveElements.length; i++) {
                if (this.interactiveElements[i].tag == typeOfInteraction && this.typeOfInteractionIsAMiniGame(typeOfInteraction)) {
                    return this.interactiveElements[i];
                }
            }
        }
        return null;
    }

    calculateDuration(from, to) {
        return (VideoPlayableUtil.timeOrFramerateInSeconds(to) - VideoPlayableUtil.timeOrFramerateInSeconds(from)) * 1000;
    }

    createInteractiveElements(currentTime, interactions, variablesController) {

        if (interactions == undefined || interactions == null)
            return;

        for (var i = 0; i < interactions.length; i++) {
            var interaction = interactions[i];

            var interactionDuration = 0;
            var interactionDelay = 0;
            var duration;

            if (interaction.to !== undefined) {
                duration = this.calculateDuration(interaction.from, interaction.to);
                interactionDuration = duration;
            } else
                duration = null;

            if (!this.typeOfInteractionIsAMiniGame(interaction.typeOfInteraction)) {
                var onInteractEvent = "onInputDown";
                if (interaction.typeOfInteraction == "release")
                    onInteractEvent = "onInputUp";

                var interactiveElement = new InteractiveElement(this.game, this.handGestureController, { 'src': interaction.src, 'container': interaction.htmlTag, 'onInteractEvent': onInteractEvent });
                interactiveElement.onSuccess = interaction.onSuccess;
                interactiveElement.consequences = interaction.consequences;

                this.game.add.existing(interactiveElement);
                this.interactiveElements.push(interactiveElement);

                interactiveElement.hide();
                interactiveElement.disable();

                if (interactiveElement !== undefined) {
                    interactiveElement.onInteract.add(function(obj) {
                        if (obj.typeOfInteraction == "pauseResume") {
                            this.onInteract.dispatch(null, null);
                        } else {
                            this.onInteract.dispatch(obj.onSuccess, obj.consequences);
                        }
                    }, this);
                }

            } else if (interaction.typeOfInteraction == "minigame") {
                //TODO - Want to modify the architecture of this mini game in particular

                var gameScript = PiecSettings.minigames[interaction.gameTag];
                var args = { 'initialTimeMargin': gameScript.initialTimeMargin, 'endTimeMargin': gameScript.endTimeMargin, 'gameDuration': duration, 'container': interaction.htmlTag };

                interactionDuration -= (gameScript.initialTimeMargin + gameScript.endTimeMargin);
                interactionDelay += gameScript.initialTimeMargin;

                var minigame = new ProjectileGame(this.game, this.handGestureController, Util.JSONmerge(gameScript, args));

                this.initMinigame(interaction, minigame, i, variablesController);

            } else if (this.typeOfInteractionIsAPowerupGame(interaction.typeOfInteraction)) {
                
                var interactiveElementMiniGame = this.interactiveElementMiniGameAlreadyExists(interaction.typeOfInteraction);

                if (interactiveElementMiniGame == null) { //It doesn't exist

                    var gameScript = PiecSettings.minigames[interaction.typeOfInteraction];
                    var args = gameScript;

                    args.currentStateAutoPlay = this.videoPlayableStateController.currentState.autoplay.after;

                    var minigame = new PowerUpGame(
                        this.game,
                        this.handGestureController,
                        this.videoPlayableStateController.videoPlayableAudioController,
                        this.videoPlayableStateController.videoPlayableHudController,
                        args);
                    this.initMinigame(interaction, minigame, i, variablesController);

                    minigame.onHudCreate.add(function(tag, object) {
                        this.onHudCreate.dispatch(tag, object);
                    }, this);

                }else { //It does exist, so act accordingly for a persisting instance of it
                        
                    interactiveElementMiniGame.reinitStateForPersistingInstance();
                }

            } else if (this.typeOfInteractionIsAHiddenObjectGame(interaction.typeOfInteraction)) {
                    
                    // hidden object game
                var gameScript = PiecSettings.minigames[interaction.typeOfInteraction];
                var args = gameScript;

                args.currentStateAutoPlay = this.videoPlayableStateController.currentState.autoplay.after;

                var minigame = new HiddenObjectGame(
                    this.game,
                    this.videoPlayableStateController.videoPlayableAudioController,
                    this.videoPlayableStateController.videoPlayableHudController,
                    args);
                this.initMinigame(interaction, minigame, i, variablesController);
            } else if (this.typeOfInteractionIsARhythmGame(interaction.typeOfInteraction)) {
                
                var gameScript = PiecSettings.minigames[interaction.typeOfInteraction];
                
                var args = { 'initialTimeMargin': gameScript.initialTimeMargin, 'endTimeMargin': gameScript.endTimeMargin, 'gameDuration': duration, 'container': interaction.htmlTag, successConsequences: interaction.successConsequences };
                
                interactionDuration -= (gameScript.initialTimeMargin + gameScript.endTimeMargin);
                interactionDelay += gameScript.initialTimeMargin;

                var minigame = new RhythmGame(this.game, this.handGestureController, Util.JSONmerge(gameScript, args));

                this.initMinigame(interaction, minigame, i, variablesController);



                // var gameScript = PiecSettings.minigames[interaction.gameTag];
                // var args = { 'initialTimeMargin': gameScript.initialTimeMargin, 'endTimeMargin': gameScript.endTimeMargin, 'gameDuration': duration, 'container': interaction.htmlTag };

                // interactionDuration -= (gameScript.initialTimeMargin + gameScript.endTimeMargin);
                // interactionDelay += gameScript.initialTimeMargin;
                
                // var minigame = new ProjectileGame(this.game, this.handGestureController, Util.JSONmerge(gameScript, args));

                // this.initMinigame(interaction, minigame, i, variablesController);

            } 

            if (this.interactionHasTimer(interaction)) {
                var timerDelay = interactionDelay + this.calculateDuration(currentTime, interaction.from);
                if (this.videoPlayableStateController.videoPlayableTimer != null)
                    this.videoPlayableStateController.videoPlayableTimer.startTimer(timerDelay, interactionDuration / 1000);
            }

        }
    }

    typeOfInteractionIsAMiniGame(typeOfInteraction) {

        return !(typeOfInteraction == "tap" || typeOfInteraction == "release" || typeOfInteraction == "pauseResume");
    }

    typeOfInteractionIsAPowerupGame(typeOfInteraction) {

        return PiecSettings.minigames[typeOfInteraction] !== undefined && PiecSettings.minigames[typeOfInteraction].type == "powerup-minigame";
    }

    typeOfInteractionIsAHiddenObjectGame(typeOfInteraction) {
        
        return PiecSettings.minigames[typeOfInteraction] !== undefined && PiecSettings.minigames[typeOfInteraction].type == "hidenobject-minigame";
    }
    typeOfInteractionIsARhythmGame(typeOfInteraction) {
        return PiecSettings.minigames[typeOfInteraction] !== undefined && PiecSettings.minigames[typeOfInteraction].type == "rhythm-minigame";
    }

    initMinigame(interaction, minigame, index, variablesController) {
        minigame.successConsequences = interaction.successConsequences;
        minigame.successScript = interaction.onSuccess;
        minigame.failConsequences = interaction.failConsequences;
        minigame.failScript = interaction.onFail;

        minigame.tag = interaction.typeOfInteraction; //We add the tag to the minigame!

        this.game.add.existing(minigame);
        this.interactiveElements.push(minigame);
        minigame.hide();
        minigame.disable();

        minigame.onSuccess.add(function(obj, index = null) {

            var consequencesToApply, stateToTransition;

            if (obj.successConsequences !== undefined)
                consequencesToApply = variablesController.applyConsequences(obj.successConsequences);
            if (obj.successScript !== undefined) {
                if (index != null && !(typeof minigame.successScript === 'string')) { //If index is not null, it means that we have an array of successes and not just one, and we should play success[index]
                    stateToTransition = obj.successScript[index];
                } else {
                    stateToTransition = obj.successScript;
                }
                this.onInteract.dispatch(stateToTransition, consequencesToApply);
            }
            minigame.disable();
        }, this);

        minigame.onFail.add(function(obj) {

            var consequencesToApply, stateToTransition;

            minigame.disable();
            if (obj.failConsequences !== undefined)
                consequencesToApply = variablesController.applyConsequences(obj.failConsequences);
            if (obj.failScript !== undefined) {
                stateToTransition = obj.failScript;

                this.onInteract.dispatch(stateToTransition, consequencesToApply);
            }
        }, this);
    }

    interactionHasTimer(interaction) {
        return interaction.timer !== undefined && interaction.timer;
    }

    checkIfInteractionShouldBeEnabled(interaction, currentTime) {
        if (VideoPlayableUtil.timeOrFramerateInSeconds(interaction.to) !== undefined && currentTime > VideoPlayableUtil.timeOrFramerateInSeconds(interaction.to)) {
            return false;
        }
        if (VideoPlayableUtil.timeOrFramerateInSeconds(interaction.from)!== undefined && currentTime >= VideoPlayableUtil.timeOrFramerateInSeconds(interaction.from)) {
            return true;
        }
        return false;
    }

}

export default VideoPlayableInteractiveElementsController;