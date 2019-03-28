import VideoController from './video-controller';

var videoPath = 'video.mp4';

var staticImgSrc = 'bg-static.jpg';

var from = 0; // video starting point

var to = null; // video ends point, if want it to loop, leave it as null

var previewCarousel; // carousel shoot

var videoController = null;

var muted = true;

function main() {

    //show the video or static image
    if (typeof videoPath !== 'undefined') {
        $('#videoBg').removeClass('hide');

        $('#bg-static-img').addClass('hide');

        videoController = new VideoController('videoBg');

        videoController.play(videoPath, { "from": from, "loop": true });

        updateVideo();

    } else {
        $('#videoBg').addClass('hide');

        $('#bg-static-img').removeClass('hide');
        $('#bg-static-img').attr('src', staticImgSrc);
    }


    //show the video or static image END


    /////------ CTA ---------//////////

    document.getElementById('vungle-cta').addEventListener('pointerdown', (event) => {
        console.log('cta download')
        parent.postMessage('download', '*');
    });

    document.getElementById('app-icon').addEventListener('pointerdown', (event) => {
        console.log('cta download')
        parent.postMessage('download', '*');
    });
    /////------ CTA END ------//////////


    ////------ MUTE --------////// 


    document.getElementById('mute-toggle').addEventListener('pointerdown', (event) => {

        muted = !muted;

        if (muted) {
            videoController.mute();
        } else {
            videoController.unmute();
        }

        $('#iconMuted').toggle(muted);
        $('#iconUnmuted').toggle(!muted);
    });
    /////------ MUTE TOGGLE END --------//////////


    ////------ WINDOW SCROLL --------////// 

    // var infoContentTop = $('#info-content').position().top + parseInt($('#info-content').css('margin-top').replace('px', ''))/ 2;
    var infoContentTop = $('#info-content').position().top;
    var lastScroll = 0;
    var contentCloneflag = false;


    $('#wrap').scroll(function() {

        if ($(this).scrollTop() >= infoContentTop) {
            if (!contentCloneflag) {

                $("#info-content").clone().appendTo("#wrap").addClass('fixed').attr('id', 'info-clone');
                $('#info-content').css('opacity', 0);
                contentCloneflag = true;
            } else {
                $('#info-clone').css('opacity', 1);
                $('#info-content').css('opacity', 0);

            }
        } else {

            $('#info-clone').css('opacity', 0);
            $('#info-content').css('opacity', 1);
        }



    });


    ////------ WINDOW SCROLL END --------////// 

}

function updateVideo() {
    setTimeout(function() {
        videoController.update();
        updateVideo();
    }, 10)
}


function initCarousel() {

    var d;

    for (var i = 0; i < windowsSettings.carouselImg.length; i++) {

        d = $('<img>');

        d.attr("data-flickity-lazyload", windowsSettings.carouselImg[i]);

        $('#main-carousel').append(d);
    }

    if (previewCarousel == null) {

        previewCarousel = new Flickity(document.querySelector('#main-carousel'), {
            // Gallery Options:
            cellAlign: 'center',
            // contain: true,
            prevNextButtons: true, // Display arrow controls [True or false]
            setGallerySize: false, // DO NOT TOUCH!!
            pageDots: false, // DO NOT TOUCH!!
            wrapAround: true, // Toggle endless scrolling [True or false]
            fullscreen: true,
            lazyLoad: 3,
            // freeScroll: false, // Toggle stickeyness scrolling [True or false]
            autoPlay: 3000, // Set the Delay between switching Items
            initialIndex: 0 // Which Item should be centered first? 
        });
    }

    previewCarousel.on('staticClick', function(event, pointer, cellElement, cellIndex) {
        console.log(cellIndex);


        previewCarousel.viewFullscreen();
        previewCarousel.select(cellIndex);
        // showFullScreen();
    });
}

function showFullScreen() {
    // console.log('e');
}




window.onload = function() {

    initCarousel();

    main();
}