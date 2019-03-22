var isWin81 = !!(navigator.userAgent.match('Windows Phone 8.1'));
var screenSizeCheck = window.matchMedia("(min-width: 900px)");

var carouselElem;

var vungleCloseButton = document.getElementById('vungle-close');
var topContainer = document.getElementById('top-container');
var bottomContainer = document.getElementById('bottom-container');
var copyCenterContainer = document.getElementById('copy-center');
var screenshotsContainer = document.getElementById('screenshots-container');
var carouselButton = document.getElementById('carousel-button');
var carouselContainer = document.getElementById('carousel-container');
var carouselCloseButton = document.getElementById('carousel-close');
var vungleCTA = document.getElementById('vungle-cta');

function doSomething(s) {
	return actionClicked(s);
}

function windows81Check() {
	var metaEl = document.createElement("meta");
	metaEl.setAttribute("name", "viewport");
	metaEl.setAttribute("content", "initial-scale = 1.0,maximum-scale = 1.0");
	document.head.appendChild(metaEl);
}

function fadeIn(el) {
	el.style.opacity = 0;
	el.style.display = 'block';
	setTimeout(function(){
		el.style.opacity = 1;
	}, 100);
}

function showCarousel() {
	var ccStyle = window.getComputedStyle(carouselContainer);
	if (ccStyle.display === "none") {
		fadeIn(carouselContainer);
		if(typeof carouselElem == "undefined") {
			
			carouselElem = new Slider('#carousel', '.z-slide-item', {
				'current': 0,
				'duration': 1,
				'minPercentToSlide': null,
				'autoplay': false,
				'direction': 'left',
				'interval': 3
			});
		}
	} else {
		fadeIn(carouselContainer);
	}
	carouselCloseButton.focus();
	vungleCloseButton.style.display = 'none';
}

function hideCarousel() {
	carouselContainer.style.opacity = 0;
	setTimeout(function(){
		vungleCloseButton.style.display = 'inline-block';
		carouselContainer.style.display = 'none';
	}, 250);
	vungleCTA.focus();
}

function updateCSS() {
	if (isWin81) {
		windows81Check();
		if (window.innerHeight > window.innerWidth){
			metaEl.setAttribute("content", "initial-scale = 1.0,maximum-scale = 1.0");
		} else {
			metaEl.setAttribute("content", "initial-scale = 0.5,maximum-scale = 0.5");
		}
	}
	
	
	if(document.body.clientWidth > 900){
		//Surface or XBox
		
		carouselButton.addEventListener("click", showCarousel);
		carouselCloseButton.addEventListener("click", hideCarousel);

		bottomContainer.removeAttribute('style');
		copyCenterContainer.removeAttribute('style');
		
		document.body.classList.add('large');
		
		if (carouselContainer.style.opacity == 1) vungleCloseButton.style.display = 'none';

	} else {
		//Mobile
		
		document.body.classList.remove('large');
		vungleCloseButton.style.display = 'inline-block';
		
		
		if(window.innerHeight > window.innerWidth){
			document.body.classList.remove('landscape');
			bottomContainerHeight = (window.innerHeight-topContainer.offsetHeight);
			bottomContainer.style.height = bottomContainerHeight+'px';
		} else {
			document.body.classList.add('landscape');
			bottomContainer.style.height = window.innerHeight+'px';
		}
		
		var copyCenterHeight = document.getElementById('copy-center').clientHeight;
		var copyContainerHeight = document.getElementById('copy-container').clientHeight;

		var copySpacing = (copyContainerHeight-copyCenterHeight)/2;
		copyCenterContainer.style.marginTop = copySpacing+'px';
	}
}

window.onload = function() {
	document.body.classList.remove("preload");
	updateCSS();	
	vungleCTA.focus();
};

window.onresize = function() {
	updateCSS();
};

document.ontouchmove = function(e){
	e.preventDefault();
}	