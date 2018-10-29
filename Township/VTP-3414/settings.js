var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.timer = 6000;

PiecSettings.ASOI = true;

//////// DEFAULT SETTINGS FOR SLOT GAMES ////////

PiecSettings.fontColor = "#1e5183"; //Remove empty if you want to use the default golden gradient
PiecSettings.fontFamily = "Poetsenone"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)

//////// SLOTS GAME SETTINGS ///////////////


PiecSettings.options = [
	"cake_factory", "dolphinarium", "nursery_school"
] 


PiecSettings.optionsText = true; // if it shows the text

PiecSettings.animation = {
	"happy": {
		width: 2000 / 8,
		height: 1356 / 3,
		totalNum: 22,
		delay: 0,
		loop: 0,
		speed: 10,
		persistent: false,

	},
	"sad": {
		width: 2000 / 8,
		height: 1356 / 3,
		totalNum: 20,
		delay: 0,
		loop: 0,
		speed: 10,
		persistent: false,
	}
};