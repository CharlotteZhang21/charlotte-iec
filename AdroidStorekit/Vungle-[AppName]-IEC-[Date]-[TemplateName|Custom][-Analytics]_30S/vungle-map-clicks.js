// overide old inline (non-iframe) way of calling SDK
window.callSDK = function(action) {

	if(action == 'download') {
    	parent.postMessage('download', '*');
	}
};

// overide old inline (non-iframe) way of calling SDK
window.actionClicked = function() {
    parent.postMessage('download', '*');
};

// overide adwords open event
window.open = function() {
    parent.postMessage('download', '*');
};

window.addEventListener('touchstart', function() {
    parent.postMessage('interacted', '*');
});