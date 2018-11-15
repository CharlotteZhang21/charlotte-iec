var debug = false;

document.ontouchmove = function(e) {
    e.preventDefault();
}

window.onload = function() {
    removeClass(document.body, 'preload');
    
    //360 tool tip
    document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled visible";

    setTimeout(function() {
        document.getElementById("interactive-tooltip-360").className = "interactive-tooltip-360 gyro-enabled";
    }, 2800);

    //cta
    document.getElementById('vungle-cta-button').addEventListener('click', function(){
        doSomething("download");
    })
    initCta();

    //start overlay

    if(!debug)
    setTimeout(function(){
        
        addClass(document.getElementById('startOverlay'), 'fadeOut');
        addClass(document.getElementById('objectsDock'), 'moveDockUp');

    }, 3e3);

    window.addEventListener('resize', onWindowResize, false);



    init();
    
    animate();

};

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
