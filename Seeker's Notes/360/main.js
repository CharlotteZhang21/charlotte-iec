var debug = false;
var startOverlayTimer = null;

document.ontouchmove = function(e) {
    e.preventDefault();
}

window.onload = function() {
    removeClass(document.body, 'preload');
    
    //360 tool tip
    document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled visible";

    //cta
    document.getElementById('vungle-cta-button').addEventListener('click', function(){
        doSomething("download");
    })
    initCta();
    $('centerScreen').sakura();
    //start overlay

    if(!debug)
    startOverlayTimer = setTimeout(function(){
        hideTooltip();
    }, 3e3);

    document.getElementById('startOverlay').addEventListener('mousedown', function(){
        hideTooltip();
    })

    window.addEventListener('resize', onWindowResize, false);



    init();

    animate();

};

function hideTooltip() {
    if(startOverlayTimer != null){
        clearTimeout(startOverlayTimer);
    }
    document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled";
    addClass(document.getElementById('startOverlay'), 'fadeOut');
    addClass(document.getElementById('objectsDock'), 'moveDockUp');

    window.addEventListener( 'touchstart', onDocumentTouchStart, true );

}

function initCta() {
    var fontSize = document.getElementById('cta-img').offsetHeight * 0.4;
    var fontMarginTop = document.getElementById('cta-img').offsetHeight * 0.05;
    document.getElementById('cta-text').style.fontSize = fontSize + 'px';
    document.getElementById('cta-text').style.top = fontMarginTop + 'px';
    

    document.getElementById('cta-text').style.opacity = 1;
      
}


function onWindowResize() {
    initCta();
    camera.aspect = document.body.clientWidth / document.body.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);
}
