var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

//////// DEFAULT SETTINGS FOR SLOT GAMES ////////

PiecSettings.winlinePalette = [0xfdf9c6, 0xf3d868, 0xc98e43, 0xff8247, 0xfaed60, 0xeba22c]; //Colours used by the winlines
PiecSettings.fontColor = "#ffffff"; //Remove empty if you want to use the default golden gradient
PiecSettings.fontFamily = "Baskerville"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

//////// SLOTS GAME SETTINGS ///////////////

// PiecSettings.tooltip = { // If there is a "src" value, it will always pic the image.
//     text: "SPIN TO\nWIN!",
//     fontColor: "#ffffff" //Remove if you want to use the default golden gradient
//     src: 'tooltip.png',
// };

PiecSettings.reelLayout = [3,3,3]; // Heights of each of the reels in array form, where the first item is the height of the first reel, and so on.
PiecSettings.reels = [ // Tease on first spin, win on second, big win on third
    ["C","C","C","C","C","C","L","R","B","S","P","C","C","E","E","C","W","W","W","W","W","W","W","L","H","H","C","C","C","C","C","C","P","L","C","C","C"],
    ["W","W","W","L","B","J","J","J","E","W","W","W","W","S","E","E","P","S","H","J","J","J","J","J","J","H","H","H","P","H","S","E","J","J","J","H","R","P"],
    ["C","C","C","C","C","H","P","R","H","C","C","C","C","B","R","L","P","W","W","W","W","W","H","H","J","J","J","E","C","C","C","P","J","J","J","J","J","J","E","S","J"],
];
PiecSettings.reelsAnimation = {
    delayPerReel: [0,300,600],
};

/////// Win Counter settings
PiecSettings.winCounterInitialValue = 0;
PiecSettings.winCounterCommaSeparation = true; //One thousand will appear as 1,000 if this is true; 1000 if this is false

/////// Control symbol vertical spacing here
PiecSettings.symbolHeight = 113;

/////// FINAL OVERLAY SCREEN SETTINGS ///////

PiecSettings.finalOverlay = {
    color: 0x000000,
    alpha: 0.5,
    delay: 3000,
};

/////// SLOTS SPINS SETTINGS ////////

PiecSettings.spins = [
    { // Spin 1
        stopPositions: [23,24,22], //Stop positions for Spin 1, for each of reels 1, 2 and so on
        winlines: [ // Highlighted winlines
            [2,1,0], // Specifies the symbol index that needs to be highlighted per reel. 0,0,0 is the first row
            [1,1,1], // 1,1,1 is the second row
        ],
        // respinFeature: {
        //     newStopPositions: [12,11,12],
        // },
        winCounter: 250000,
        winAnimations: [
            'coin-line-burst-01',
        ],
    },
    { // Spin 2
        stopPositions: [13,13,13], //Stop positions for Spin 1, for each of reels 1, 2 and so on
        // winlines: [
        //     [0,1,2],
        //     [1,1,1],
        // ],
        // respinFeature: {
        //     newStopPositions: [13,13,12],
        // },
        // symbolPatternFeature: {
        //     symbol: 'W',
        //     pattern:  [
        //         [1],
        //         [],
        //         [1]
        //     ],
        // },
        // winCounter: 32000,
        // winAnimations: [
        //     "coin-line-burst-02",
        // ],
    },
    { // Spin 3
        stopPositions: [0,1,0], //Stop positions for Spin 1, for each of reels 1, 2 and so on
        winlines: [
            [0,0,0],
            [1,1,1],
            [2,2,2],
            [0,1,2],
            [2,1,0],
        ],
        respinFeature: {
            newStopPositions: [0,0,0],
        },
        winCounter: 5000000,
        winAnimations: [
            'coin-area-burst-03',
            'coin-cascade-02',
            'coin-line-stack-01',
        ],
        pngSequence: {
            src: 'cleopatra_anim.jpg',
            htmlContainer:'cleopatra-container',
            spriteWidth: 339.6,
            spriteHeight: 248,
            spriteNumber: 16,
            loops: 0, //write 0 if infinite loop
            delay: 3000,
            fps: 10,
            effect: 'fade-in',
        },
        // winMessage: {
        //     src: "hugewin--.png",
        //     animation: 'zoom-and-bounce-in',
        //     duration: 1000,
        //     delay: 4700,
        // }
    }
];