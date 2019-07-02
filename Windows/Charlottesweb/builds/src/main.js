import VideoController from './video-controller';
import * as Utils from './auto-localisation-util';

var videoPath = 'video.mp4';

var staticImgSrc = 'bg-static.jpg';

var from = 0; // video starting point

var to = null; // video ends point, if want it to loop, leave it as null

var previewCarousel; // carousel shoot

var videoController = null;

var muted = true;

var infoContentTop = 10000;
var infoContentBottom = 0;

var contentCloneflag = false;

function main() {


    /////------ CTA ---------//////////

    var text = Utils.getLocalisedCta().text;
    var fontFamily = Utils.getLocalisedCta().font;
    var fontSizeMultiplier = Utils.getLocalisedCta().fontSizeMultiplier;

    var fontSize = document.getElementById('vungle-cta').offsetHeight * fontSizeMultiplier;



    // var fontMarginTop = orientationCheck()=='portrait'? document.getElementById('cta-img').offsetHeight * 0.05 : document.getElementById('cta-img').offsetHeight * 0.3;

    document.getElementById('vungle-cta').style.fontSize = fontSize + 'px';
    // document.getElementById('cta-text').style.top = fontMarginTop + 'px';


    document.getElementById('vungle-cta').style.opacity = 1;

    document.getElementById('vungle-cta').innerHTML = text;

    // document.getElementById('info-content-fixed-cta').innerHTML = text;

    bindCtaClick(document.getElementById('vungle-cta'));

    bindCtaClick(document.getElementById('app-icon'));


    /////------ CTA END ------//////////




    ////------ WINDOW SCROLL --------////// 

    // var infoContentTop = $('#videoBg').position().top + $('#videoBg').height();



    $('#wrap').scroll(function() {

        stickyBanner();
        showScrollIndicator($(this).scrollTop());

        if (infoContentTop <= 0) {
            if ($(this).scrollTop() >= infoContentTop) {

                repositionInfoContent();
            }

        } else {

            $('#info-clone').css('opacity', 0);
            $('#info-content').css('opacity', 1);
        }

        infoContentTop = $('#info-content').offset().top;



    });


    ////------ WINDOW SCROLL END --------////// 

}

function repositionInfoContent() {

    if (!contentCloneflag) {

        $("#info-content").clone().appendTo("#wrap").addClass('fixed').attr('id', 'info-clone');

        $('#info-clone').find('#vungle-cta').attr('id', 'vungle-cta-clone');
        $('#info-clone').find('#app-icon').attr('id', 'app-icon-clone');

        bindCtaClick(document.getElementById('vungle-cta-clone'));
        bindCtaClick(document.getElementById('app-icon-clone'));

        $('#info-content').css('opacity', 0);

        contentCloneflag = true;
    } else {
        $('#info-clone').css('opacity', 1);
        $('#info-content').css('opacity', 0);

    }
}

function bindCtaClick(obj) {
    // console.log(obj.focus);
    // obj.focus();
    obj.addEventListener("click", function() {
        console.log('cta download');
        parent.postMessage('download', '*');
    });

}


// function isElementInViewport(el) {

//     var rect = el.position();

//     return (
//         rect.top + parseInt(el.css('margin-top')) >= (window.innerHeight || document.documentElement.clientHeight))

// }

function stickyBanner() {
    if(document.body.clientWidth > document.body.clientHeight && document.body.clientHeight <= 500){
        return;
    }

    if ($('#wrap').scrollTop() < infoContentBottom - document.body.clientHeight) {
        $('#info-content').addClass('fixedToBottom')
    } else {
        $('#info-content').removeClass('fixedToBottom');
    }


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
            accessibility: true,
            // freeScroll: false, // Toggle stickeyness scrolling [True or false]
            autoPlay: 3000, // Set the Delay between switching Items
            initialIndex: 0 // Which Item should be centered first? 
        });
    }

    previewCarousel.on('staticClick', function(event, pointer, cellElement, cellIndex) {
        // console.log(cellIndex);

        previewCarousel.viewFullscreen();
        previewCarousel.select(cellIndex);

    });

    previewCarousel.on('fullscreenChange', function(isFullscreen) {
        if (isFullscreen) {
            // console.log('hide');
            parent.postMessage('hideCloseButton', '*');

        } else {
            if ($(window).scrollTop() < infoContentTop) {
                $('#info-clone').css('opacity', 0);
                $('#info-content').css('opacity', 1);
            }
            // repositionInfoContent();
            console.log($(window).scrollTop());
            console.log($('#info-content').offset().top);
            parent.postMessage('revealCloseButton', '*');
        }
    });
}


function initContent() {
    if (windowsSettings.appName == undefined || windowsSettings.appName == '') {
        console.log('no appName')
    } else {
        $('#app-name').html(windowsSettings.appName);
    }


    if (windowsSettings.callOut == undefined || windowsSettings.callOut == '') {
        console.log('no callOut')
    } else {
        $('#app-callout').html(windowsSettings.callOut);
    }

    if (windowsSettings.stars == undefined || windowsSettings.stars.length < 5) {
        console.log('five stars have to be defined');
    } else {
        var d = $("<div />").appendTo($('#app-stars'));

        var span;
        for (var i = 0; i < windowsSettings.stars.length; i++) {
            console.log("vungle-star-" + windowsSettings.stars[i]);
            span = $("<span />").addClass("star").addClass("vungicon-star-" + windowsSettings.stars[i]);
            span.appendTo(d);
        }

    }

    if (windowsSettings.reviewCounts == undefined || windowsSettings.reviewCounts == '') {
        console.log('no reviewCounts')
    } else {
        $("<span />").addClass("counts").html(windowsSettings.reviewCounts).appendTo($("#app-stars"));


    }



    if (windowsSettings.descriptionContent == undefined || windowsSettings.descriptionContent == '') {
        console.log('no descriptionContent')
    } else {
        $('#info-app-description-content').html(windowsSettings.descriptionContent);
    }


    if (windowsSettings.ESRB == undefined || windowsSettings.ESRB == {}) {
        console.log('no ESRB')
    } else {
        if (windowsSettings.ESRB.image && windowsSettings.ESRB.image == '') {
            console.log('no ESRB image');
        } else {
            $('<img />').attr('src', windowsSettings.ESRB.image).appendTo($('#ESRB'));
        }


        if (windowsSettings.ESRB.text && windowsSettings.ESRB.text == '') {
            console.log('no ESRB text');
        } else {
            $('<p />').html(windowsSettings.ESRB.text).appendTo($('#ESRB'));
        }


    }

    // $('#info-content-fixed')
    //     .append("<img src='app-icon.jpg'>")
    //     .append("<p>" + windowsSettings.appName + "</p>")
    //     // .append("<div>"+windowsSettings.appName+"</div>")
    //     .append("<button id='info-content-fixed-cta'>Get</button>");

}


function showScrollIndicator(currentScroll) {

    if (currentScroll > 10) {
        $('#scrollIndicator').addClass('hide');
    } else {
        $('#scrollIndicator').removeClass('hide');
        $('#scrollIndicator').find('.dot').each(function(index) {
            $(this).addClass('fadeInDown-' + index);
        })
    }
}

window.resize = function() {
    previewCarousel.resize();
    stickyBanner();
    
}

window.onload = function() {


    //show the video or static image
    if (typeof videoPath !== 'undefined') {
        $('#videoBg').removeClass('hide');

        $('#bg-static-img').addClass('hide');

        videoController = new VideoController('videoBg');

        videoController.play(videoPath, { "from": from, "loop": true, "simple": true });


        videoController.video.onloadedmetadata = function() {

            //init Everything 
            $('body').removeClass('preload');


            infoContentBottom = $('#info-content').position().top + $('#info-content').height() + parseInt($('#info-content').css('margin-top'));
            // console.log('infoContentBottom', infoContentBottom);
            stickyBanner();



            if ($('.vungle-footer').offset().top > $(window).height()) {


                showScrollIndicator(0);

            }
            $('#scrollIndicator').click(function() {
                // if (isElementInViewport($("#info-content"))) {
                    // $('#info-content').animate({
                    //     scrollTop: 0
                    // }, 1000);

                    $('#wrap').animate({
                        scrollTop: $("#info-content").offset().top
                    }, 800);
                // }
            })

            initContent()
            initCarousel();
            main();
        };
        // updateVideo();


        ////------ MUTE --------////// 

        $('#mute-toggle').removeClass('hide');

        document.getElementById('mute-toggle').addEventListener('pointerdown', function(event) {

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

    } else {

        $('#videoBg').addClass('hide');

        $('#bg-static-img').removeClass('hide');

        $('#bg-static-img').attr('src', staticImgSrc);
    }


    //show the video or static image END



}