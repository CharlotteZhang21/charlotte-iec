var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.timer = 6000;

PiecSettings.ASOI = true;

//////// DEFAULT SETTINGS FOR SLOT GAMES ////////

PiecSettings.fontColor = "#1e5183"; //Remove empty if you want to use the default golden gradient
PiecSettings.fontFamily = "Poetsenone"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

//////// SLOTS GAME SETTINGS ///////////////


PiecSettings.options = [
	"cake_factory", "dolphinarium", "nursery"
] 

PiecSettings.characterText = [
	"Hey you!",
	"Please help me \nbuild my town",
]


PiecSettings.optionsText = true; // if it shows the text

PiecSettings.workerNum = 3; // change if you like more or less workers to build the building, and add the corresponding animations below 

PiecSettings.animation = {
	"congrats": {
		src: 'congrats',
		width: 2000 / 8,
		height: 1356 / 3,
		totalNum: 22,
		delay: 0,
		loop: 0,
		speed: 10,
		persistent: false,
		container: 'character-happy',


	},
	"sad": {
		src: 'sad',
		width: 2000 / 8,
		height: 1356 / 3,
		totalNum: 20,
		delay: 0,
		loop: 0,
		speed: 10,
		persistent: false,
		container: 'character',
	},
	"smoke-1": {
		src: 'smoke',
		width: 1818 / 9,
		height: 525 / 3,
		totalNum: 27,
		delay: 10,
		loop: 3,
		speed: 10,
		persistent: false,
		container: 'smoke-1',
	},

	"smoke-2": {
		src: 'smoke',
		width: 1818 / 9,
		height: 525 / 3,
		totalNum: 27,
		delay: 20,
		loop: 3,
		speed: 10,
		persistent: false,
		container: 'smoke-2',
	},


	"smoke-3": {
		src: 'smoke',
		width: 1818 / 9,
		height: 525 / 3,
		totalNum: 27,
		delay: 30,
		loop: 3,
		speed: 10,
		persistent: false,
		container: 'smoke-3',
	},

	"worker-1": {
		src: 'worker-1',
		width: 1216 / 8,
		height: 152 / 1,
		totalNum: 8,
		delay: 0,
		loop: 0,
		speed: 20,
		persistent: false,
		container: 'worker-1',
	},
	"worker-2": {
		src: 'worker-2',
		width: 1368 / 9,
		height: 200 / 1,
		totalNum: 9,
		delay: 0,
		loop: 0,
		speed: 20,
		persistent: false,
		container: 'worker-2',
	},

	"worker-3": {
		src: 'worker-1',
		width: 456 / 3,
		height: 456 / 3,
		totalNum: 9,
		delay: 0,
		loop: 0,
		speed: 10,
		persistent: false,
		container: 'worker-3',
	},
};