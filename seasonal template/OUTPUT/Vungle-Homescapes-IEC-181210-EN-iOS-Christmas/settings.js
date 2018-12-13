var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

// PiecSettings.autoPlay = {
//     activateAfter: 4000,
// }

PiecSettings.assets = [
    'sky.png',
    'lid.png',
    'box.png',
    'boxBg.png',
    'blueTree.png',
    'christmasTree.png',
    'ground.png',
    'shadow.png',
    'santa.png',
    'fence.png',

]

PiecSettings.portrait = {
    envelopeY: .72,
    contentsFinalWidth: 1.55, //in % (50% should be 0.5)
    contentsFinalY: -0.01,     //in %
};

PiecSettings.portraitTablet = {
    envelopeY: .72,
    contentsFinalWidth: 1.4, //in % (50% should be 0.5)
    contentsFinalY: 0,     //in %
};

PiecSettings.landscape = {
    envelopeY: .45,         // envelope vertical position
    contentsFinalWidth: .9,
    contentsFinalY: .09,     //in %
};

PiecSettings.landscapeTablet = {
    envelopeY: .55,
    contentsFinalWidth: .95, //in % (50% should be 0.5)
    contentsFinalY: .3,     //in %
};

// PiecSettings.pngAnimations = [
//     { // 1
//         src: 'firework-ani.png',
//         spriteWidth: 1024/4,
//         spriteHeight: 1024/4,
//         spriteNumber: 16,
//         loops: 1,
//         delay: 0,
//         fps: 24,
//         scale: 1,
//         isReversed: false,
//     }
// ];

