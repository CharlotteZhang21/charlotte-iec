function doSomething(s) {
    return actionClicked(s);
}

function orientationCheck() {
    if (window.innerHeight > window.innerWidth) {
        return 'portrait';
    } else {
        return 'landscape';
    }
}

function hasClass(id, className) {

    var el = document.querySelector(id);
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
}



function changeCSS(el, style, value) {


    el.style[style] = value;

}

function addClass(id, className) {

    var el = document.querySelector(id);
    if (el.classList) {
        el.classList.add(className);
    } else if (!hasClass(el, className)) {
        el.className += " " + className;
    }
}

function removeClass(id, className) {
    console.log(id);
    var el = document.querySelector(id);
    if (el.classList) {
        el.classList.remove(className);
    } else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

function transform(el, x, y, width, duration, delay, transition, customFunction) {
    if (delay == undefined || delay == null) {
        delay = 0;
    }


    setTimeout(function() {
        if (typeof(customFunction) !== 'undefined') {
            customFunction();
        }
        el.style.transitionDuration = duration + "s";
        el.style.transitionTimingFunction = transition;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = width + 'px';
        el.style.padding = '0px';


    }, delay);
}