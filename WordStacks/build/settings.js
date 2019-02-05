var PiecSettings = PiecSettings || {};

PiecSettings.version = "DYNAMIC_LOCAL_ASOI_TIMER";

PiecSettings.autoPlay = 10000;
PiecSettings.dynamicLocalisation = true;

PiecSettings.timer = false;
PiecSettings.timerDuration = 4000;

PiecSettings.asoi = true;

PiecSettings.fontColor = "#ffffff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

PiecSettings.colorPalette = {
    default: "0x00f82c",
    correct: "0x44AD12",
    incorrect: "0xe3442d",
    repeated: "0xf6a200",
    wordBoxDefault: ["0x00f82c"],
};                          //Used by the lines and box

PiecSettings.ctaBackground = true; // set false when you don't want bg;

PiecSettings.useAlternativeAssetForSolvedLetters = false; //Can use alternative asset for letters on the board (as opposed to letters on the pan). This will be the letter with "-2" behind
                                                        // E.g.: "a.png" alternative version would be "a-2.png".

PiecSettings.hint = [{
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


// for wordstacks letters
PiecSettings.highlightColor = '#00f82c'; //cookie box color

PiecSettings.stackLetterStyle = {
    fontWeight: "bold",
    fontFamily: PiecSettings.fontFamily,
    color: ['#771a1a'], // if there is no gradient, leave only one color in the array
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

// PiecSettings.letterScaleInBoxCookie = 0.86; //How much of the width a letter takes inside the boxCookie

// PiecSettings.panAnchor = [0.5,0.49]; //Anchor of circle where letters are positioned, as ratio of total width/height
// PiecSettings.panRadius = 0.28;       //Specifies how big the radius of the circle where letters are positioned is
//                                      //as a ratio of the total height of the pan background.
// // PiecSettings.panAnchorLandscape = [0.5,0.49];
// PiecSettings.panRadiusLandscape = 0.2;
// PiecSettings.boardAnchor = [0.49,0.7];

/////// FINAL OVERLAY SCREEN SETTINGS ///////
// PiecSettings.finalOverlay = {
//     color: 0x281065,
//     alpha: 0.65,
//     delay: 3000,
// };

PiecSettings.pngAnimations = [
    // {
    //     src: 'burst_01.png',
    //     spriteWidth: 200,
    //     spriteHeight: 205,
    //     spriteNumber: 18,
    //     loops: 1,
    //     delay: 0,
    //     fps: 15,
    // },
    // {
    //     src: 'burst_02.png',
    //     spriteWidth: 240,
    //     spriteHeight: 240,
    //     spriteNumber: 19,
    //     loops: 1,
    //     delay: 0,
    //     fps: 10,
    // },
    // {
    //     src: 'burst_03.png',
    //     spriteWidth: 240,
    //     spriteHeight: 240,
    //     spriteNumber: 19,
    //     loops: 1,
    //     delay: 0,
    //     fps: 10,
    // },
];