/*
===Video Playable Variables Controller===
Keeps video playable script variables.
Handles their value, increases and decreases them accordingly when consequences are applied.
Also evaluates conditions applied to them.
Works with a specific syntax, extremely similar to normal javascript variable setting/boolean syntax.
*/
class VideoPlayableVariablesController {

    constructor(variablesConfig) {

        this.variables = [];
        for (var key in variablesConfig) {
            this.variables[key] = variablesConfig[key].value;
        }

        this.initSignals();
    }

    initSignals() {
        this.onVariableUpdate = new Phaser.Signal();
    }

    /*
    ==Apply Consequences==
    Applies consequences (given by a string) to variables.
    Params:
     + consequences : string that specifies consequences to apply. Syntax is as follows
        projectileSuccess=true;anotherVariable+=2;anotherAnotherVariable=5
        - separate variables by ;
        - can set values with '=true' or '=3'
        - can increase/decrease values with '++', '+=', '--', '-='
    */
    applyConsequences(consequences) {
        if (consequences !== undefined) {
            var consequencesArray = consequences.split(';');
            for (var i = 0; i < consequencesArray.length; i++) {
                var consequence = consequencesArray[i];
                var variableName = "";
                // console.log(consequence);
                if (consequence.includes("--")) {
                    this.decreaseVariable(consequence.split("--")[0], 1);
                    variableName = consequence.split("--")[0];
                } else if (consequence.includes("-=")) {
                    this.decreaseVariable(consequence.split("-=")[0], parseFloat(consequence.split("-=")[1]));
                    variableName = consequence.split("-=")[0];
                } else if (consequence.includes("++")) {
                    this.increaseVariable(consequence.split("++")[0], 1);
                    variableName = consequence.split("++")[0];
                } else if (consequence.includes("+=")) {
                    this.increaseVariable(consequence.split("+=")[0], parseFloat(consequence.split("+=")[1]));
                    variableName = consequence.split("+=")[0];
                } else if (consequence.includes("=")) {
                    var value = consequence.split("=")[1];
                    this.setVariable(consequence.split("=")[0], isNaN(value)? value : parseFloat(value));
                    variableName = consequence.split("=")[0];
                }
                this.onVariableUpdate.dispatch(variableName, this.variables[variableName]);
            }
            console.log(this.variables);
        }
    }

    increaseVariable(variableName, value) {
        if (this.variables[variableName] != null) {
            this.variables[variableName] += value;
        }
    }

    decreaseVariable(variableName, value) {
        if (this.variables[variableName] != null) {
            this.variables[variableName] -= value;
        }
    }

    setVariable(variableName, value) {
        if (this.variables[variableName] != null) {
            this.variables[variableName] = value;
        }
    }


    /*
    ==Evaluate Conditions==
    Evaluates a set of conditions (given by a string) depending the values the variables have.
    Params:
     + conditions : string that specifies conditions to evaluate. Syntax is as follows
        projectileSuccess==true&&anotherVariable>=2&&anotherAnotherVariable<5
        - separate variables by && (acts as an AND)
        - can use normal boolean operators '==', '>=', '<=', '<', '>'
    */
    evaluateConditions(conditions) {

        var evaluation = true;
        if (conditions !== undefined) {
            var conditionsArray = conditions.split("&&");
            for (var i = 0; i < conditionsArray.length; i++) {
                var condition = conditionsArray[i];
                if (condition.includes("==")) {
                    var value = condition.split("==")[1];
                    evaluation &= this.variableEqualTo(condition.split("==")[0], isNaN(value)? value : parseFloat(value) );
                } else if (condition.includes("!=")) {
                    var value = condition.split("!=")[1];
                    evaluation &= this.variableDifferentThan(condition.split("!=")[0], isNaN(value)? value : parseFloat(value) );
                } else if (condition.includes(">=")) {
                    var value = condition.split(">=")[1];
                    var evaluationReturn = this.variableBiggerThanOrEqualTo(condition.split(">=")[0], isNaN(value)? value : parseFloat(value) );
                    evaluation &= evaluationReturn;
                } else if (condition.includes("<=")) {
                    var value = condition.split("<=")[1];
                    evaluation &= this.variableSmallerThanOrEqualTo(condition.split("<=")[0], isNaN(value)? value : parseFloat(value) );
                } else if (condition.includes(">")) {
                    var value = condition.split(">")[1];
                    evaluation &= this.variableBiggerThan(condition.split(">")[0], isNaN(value)? value : parseFloat(value) );
                } else if (condition.includes("<")) {
                    var value = condition.split("<")[1];
                    evaluation &= this.variableSmallerThan(condition.split("<")[0], isNaN(value)? value : parseFloat(value) );
                } else {
                    console.log("Operator not supported! " + condition);
                }
            }
        }
        return evaluation;
    }

    variableBiggerThan(variableName, value) {
        return this.variables[variableName] > value;
    }

    variableBiggerThanOrEqualTo(variableName, value) {
        return this.variables[variableName] >= value;
    }

    variableSmallerThan(variableName, value) {
        return this.variables[variableName] < value;
    }

    variableSmallerThanOrEqualTo(variableName, value) {
        return this.variables[variableName] <= value;
    }

    variableEqualTo(variableName, value) {
        return this.variables[variableName].toString() == value.toString();
    }

    variableDifferentThan(variableName, value) {
        return this.variables[variableName].toString() != value.toString();
    }

}

export default VideoPlayableVariablesController;