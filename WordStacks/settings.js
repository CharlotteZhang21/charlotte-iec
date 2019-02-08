var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.autoPlay = 15000;
PiecSettings.dynamicLocalisation = true;


PiecSettings.fontColor = "#ffffff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

PiecSettings.colorPalette = {
    wordBoxPlaceHolder: ["0xffffff"], 
    stackDefault: "#32b0fd", // default colour for the stacks
    stackWhenPress: "#ffffff", //font colour change to when inputDown
    wordBoxDefault: ["0xffffff"], // chosen letters box colour
};                          //Used by the lines and box

PiecSettings.ctaBackground = true; // set false when you don't want bg;

PiecSettings.useAlternativeAssetForSolvedLetters = false; //Can use alternative asset for letters on the board (as opposed to letters on the pan). This will be the letter with "-2" behind
                                                        // E.g.: "a.png" alternative version would be "a-2.png".

PiecSettings.responsiveBg = true; // if it's true then please add in bg-landscape.jpg as the background for landscape
PiecSettings.hint = [
    {
        start: {r: 0 ,c: 4},
        end: {r: 4 ,c: 4},
    },{ 
        start: {r: 4 ,c: 5},
        end: {r: 4 ,c: 1},
    },{
        start: {r: 4 ,c: 3},
        end: {r: 4 ,c: 6},
    }
]; 

// PiecSettings.connectionLine = "line"; //"line"
// PiecSettings.circleLetter = true;

PiecSettings.gameCategory = 'SOUR TASTING';

PiecSettings.stackLetterStyle = {
    fontWeight: "bold",
    fontFamily: PiecSettings.fontFamily,
    color: ['#32b0fd'], // if there is no gradient, leave only one color in the array
    stroke: 'black', // if there is no stroke, can delete it
    shadow: {
        x: 2,
        y: 6,
        color: 'rgb(0,0,0)',
        blur: 0
    }, //phaser shadow
    anchor: {
        x: .5,
        y: .6
    }

}

PiecSettings.wordsGridWidth = 7;
PiecSettings.wordsGridHeight = 5;

PiecSettings.words = [
    ['-', '-', '-', '-', 'C', '-', '-'],
    ['-', '-', '-', '-', 'A', '-', '-'],
    ['-', '-', '-', '-', 'N', '-', '-'],
    ['-', '-', 'L', 'I', 'D', 'M', '-'],
    ['N', 'O', 'M', 'E', 'Y', 'L', 'E'],
];

PiecSettings.goals = ["CANDY", "LEMON", "LIME", ]; // case sensitive  

PiecSettings.tutorialAutoFill = true; // weather or not auto Fill the first word

PiecSettings.preFilledLettersCoordinates = [ //For individual letters
    // [10,0],
    // [0,5],
    // [1,5],
    // [2,3],
    // [3,3],
    // [2,5],
    // [13,1],
    // [13,2],
    // [13,3],
];


PiecSettings.pngAnimations = [
];