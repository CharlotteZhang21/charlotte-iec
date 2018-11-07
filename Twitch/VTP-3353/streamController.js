/*============
Stream controller JS
==============*/

var embed;
var player;
var containerId = 'stream-frame';

var sizeMultiplier = orientationCheck() == 'portrait'? 1 : 1.12;

function initStream(){
	var options = {
		width: document.body.clientWidth * sizeMultiplier,
		height: document.body.clientHeight,
		channel: "tinny",
		layout: 'video-with-chat',
		theme: 'dark',
		autoplay: false
	};


	embed = new Twitch.Embed(containerId, options);

	embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
		$('#loading').addClass('hide');
		$('#'+containerId).removeClass('hide');
		player = embed.getPlayer();
		player.play();
	});
}

function resizeStream(){
	sizeMultiplier = orientationCheck() == 'portrait'? 1 : 1.12;
	var iframe = document.getElementById(containerId).getElementsByTagName('iframe')[0];
	iframe.width = document.body.clientWidth * sizeMultiplier;
	iframe.height = document.body.clientHeight;
}

function resizeCTA() {


	if(orientationCheck() == 'portrait'){
		$('#cta').removeClass('landscape');
		$('#cta').addClass('portrait');
	}else{
		$('#cta').removeClass('portrait');
		$('#cta').addClass('landscape');
	}

	$('#cta').click(function(){
		downloadAndMute();
	});

}

var vungleTimerInterval, countingDown;

window.onload = function() {
	initStream();
	// resizeCTA();

	$('body').removeClass('preload');

	$('#loading').addClass('preloadAni');

	$('#cta').click(function(){
		downloadAndMute();
	});
	if(CONFIG.timer !== undefined){
		
		switch(CONFIG.timer) {
			case 'NOTIMER': 
				revealCloseButton();
				break;
			case 'TIMER':
				setTimeout(function(){
					revealCloseButton();
				}, 4e3);
				break;
			default: 
				startCountingDownTimer();
		}		
	}else{
		startCountingDownTimer();
	}

    

}

window.onresize = function() {

	// embed.destroy();
	resizeStream();
	// resizeCTA();
}


function startCountingDownTimer() {
    document.getElementById("close-button-replacement").className = "";
    if(countingDown == null){
    	countingDown = CONFIG.timerDuration / 1000;
    }
    if(vungleTimerInterval == null)
        vungleTimerInterval = setInterval(function(){
            document.getElementById("close-button-replacement").innerHTML = countingDown--;
            if(countingDown < 0){
                revealCloseButton();
                if(CONFIG.endcard) {
                	showEndcard();
                }
            }
        }, 1e3);

}


function revealCloseButton() { 
    clearInterval(vungleTimerInterval); document.getElementById("vungle-close").className = "" , document.getElementById("close-button-replacement").className = "hide"; 
}

function closeAndMute() {
	// player.setMuted(true);
	player.pause();
	doSomething('close');
}

function downloadAndMute() {
	// player.setMuted(true);
	player.pause();
	doSomething('download');
}

function showEndcard(){
	player.pause();
	// addClass(document.getElementById(containerId), 'hide');	
	$('#'+containerId).addClass('hide');
	$('#static-endcard').removeClass('hideBottom');
}