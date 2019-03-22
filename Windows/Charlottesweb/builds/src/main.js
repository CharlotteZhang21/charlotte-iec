// import * as jQuery from './jquery.min.js';
// import Flickity from './vunglrousel.pkgd.min.js';
import VideoController from './video-controller';

var videoPath = 'video.mp4';

var staticImgSrc = 'bg-static.jpg';

var from = 0;

var to = null;

function main() {

    //show the video or static image
    if (typeof videoPath !== 'undefined') {
        $('#videoBg').removeClass('hide');

        $('#bg-static-img').addClass('hide');

        var videoController = new VideoController('videoBg');

        videoController.play(videoPath, { "from": from, "to": to, "loop": true });
    } else {
        $('#videoBg').addClass('hide');

        $('#bg-static-img').removeClass('hide');
        $('#bg-static-img').attr('src', staticImgSrc);
    }


}

function lightBox() {
    console.log('lightBox');
}

window.onload = function() {
	var elem = document.querySelector('#main-carousel');
    var flkty = new Flickity(elem, {
        // Gallery Options:
        cellAlign: 'center',
        // contain: true,
        prevNextButtons: true, // Display arrow controls [True or false]
        setGallerySize: false, // DO NOT TOUCH!!
        pageDots: false, // DO NOT TOUCH!!
        wrapAround: true, // Toggle endless scrolling [True or false]
        // freeScroll: false, // Toggle stickeyness scrolling [True or false]
        // autoPlay: 3000, // Set the Delay between switching Items
        initialIndex: 0 // Which Item should be centered first? 
    });

    // flkty.on('staticClick', lightBox);
    main();
}