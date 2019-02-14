/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

var DeviceOrientationController = function(object) {

    var scope = this;

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.element = document;

    this.enabled = true;

    this.enableManualDrag = true; // enable manual user drag override control by default
    this.enableManualZoom = true; // enable manual user zoom override control by default

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alpha = 0;
    this.alphaOffsetAngle = 0;

    this.startQuat = null;

    this.initLat = 0;
    this.initLon = 0;
    this.returnStepLat = 0.5;
    this.returnStepLon = 2;
    this.lon = this.initLon, this.lat = this.initLat, this.phi = 0, this.theta = 0;
    this.prevLat = 0;
    this.prevLon = 0;


    this.minLatPort = -3;
    this.maxLatPort = 3;

    this.minLatLands = -3;
    this.maxLatLands = 3;
    
    //Portrait
    this.minLonPort = -60;
    this.maxLonPort = 60;
    //Landscape
    this.minLonLands = -30;
    this.maxLonLands = 30;
    //motion sensitivity of ios / android
    this.mobileVibrationValue = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? 0.022 : 0.022;

    // Manual rotate override components
    var startX = 0,
        startY = 0,
        currentX = 0,
        currentY = 0,
        scrollSpeedX, scrollSpeedY,
        tmpQuat = new THREE.Quaternion();


    var CONTROLLER_STATE = {
        AUTO: 0,
        MANUAL_ROTATE: 1,
        MANUAL_ZOOM: 2
    };

    var CONTROLLER_EVENT = {
        CALIBRATE_COMPASS: 'compassneedscalibration',
        SCREEN_ORIENTATION: 'orientationchange',
        MANUAL_CONTROL: 'userinteraction', // userinteractionstart, userinteractionend
        ZOOM_CONTROL: 'zoom', // zoomstart, zoomend
        ROTATE_CONTROL: 'rotate' // rotatestart, rotateend
    };

    var deviceQuat = new THREE.Quaternion();

    var appState = CONTROLLER_STATE.AUTO;

    var fireEvent = function() {
        var eventData;

        return function(name) {
            eventData = arguments || {};

            eventData.type = name;
            eventData.target = this;

            this.dispatchEvent(eventData);
        }.bind(this);
    }.bind(this)();


    var onDeviceOrientationChangeEvent = function(event) {

        scope.deviceOrientation = event;

    };

    var onScreenOrientationChangeEvent = function() {

        scope.screenOrientation = window.orientation || 0;

    };

    var onDeviceMotionEvent = function() {
        if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
            gyroPresent = true;
        if (typeof event.rotationRate === "undefined") return;
        var x = event.rotationRate.alpha;
        var y = event.rotationRate.beta;
        var portrait = typeof event.portrait !== "undefined" ? event.portrait : window.matchMedia("(orientation: portrait)").matches;
        var landscape = typeof event.landscape !== "undefined" ? event.landscape : window.matchMedia("(orientation: landscape)").matches;
        var orientation = event.orientation || window.orientation;

        if (portrait) {
            this.lon = this.lon - y * this.mobileVibrationValue;
            this.lat = this.lat + x * this.mobileVibrationValue;
        } else if (landscape) {
            var orientationDegree = -90;
            if (typeof orientation != "undefined") {
                orientationDegree = orientation;
            }

            this.lon = orientationDegree == -90 ? this.lon + x * this.mobileVibrationValue : this.lon - x * this.mobileVibrationValue;
            this.lat = orientationDegree == -90 ? this.lat + y * this.mobileVibrationValue : this.lat - y * this.mobileVibrationValue;
        }
    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    var setObjectQuaternion = function() {

        var zee = new THREE.Vector3(0, 0, 1);

        var euler = new THREE.Euler();

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        this.sceneOffsetAngle = 0;

        return function(quaternion, alpha, beta, gamma, orient, offsetY = 0) {

            euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

            quaternion.setFromEuler(euler); // orient the device

            // var alternateQ1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

            quaternion.multiply(q1); // camera looks out the back of the device, not the top

            quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

            //Additional rotation
            quaternion.multiply(q0.setFromAxisAngle(new THREE.Vector3(0, 1, 0), offsetY));

        }

    }();

    this.connect = function() {

        onScreenOrientationChangeEvent(); // run once on load

        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);


        window.addEventListener("devicemotion", function(event) {
            if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
                gyroPresent = true;
            if (typeof event.rotationRate === "undefined") return;
            var x = event.rotationRate.alpha;
            var y = event.rotationRate.beta;
            var portrait = typeof event.portrait !== "undefined" ? event.portrait : window.matchMedia("(orientation: portrait)").matches;
            var landscape = typeof event.landscape !== "undefined" ? event.landscape : window.matchMedia("(orientation: landscape)").matches;
            var orientation = event.orientation || window.orientation;

            if (portrait) {
                this.lon = this.lon - y * this.mobileVibrationValue;
                this.lat = this.lat + x * this.mobileVibrationValue;
            } else if (landscape) {
                var orientationDegree = -90;
                if (typeof orientation != "undefined") {
                    orientationDegree = orientation;
                }

                this.lon = orientationDegree == -90 ? this.lon + x * this.mobileVibrationValue : this.lon - x * this.mobileVibrationValue;
                this.lat = orientationDegree == -90 ? this.lat + y * this.mobileVibrationValue : this.lat - y * this.mobileVibrationValue;
            }
        }.bind(this), false);

        this.element.addEventListener('mousedown', this.onDocumentMouseDown, false);
        this.element.addEventListener('touchstart', this.onDocumentTouchStart, false);


        scope.enabled = true;

    };

    this.disconnect = function() {

        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        this.element.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        this.element.removeEventListener('touchstart', this.onDocumentTouchStart, false);

        scope.enabled = false;

    };

    this.quat2Angle = function(x, y, z, w) {

        var pitch, roll, yaw;

        var test = x * y + z * w;

        if (test > 0.499) {
            yaw = 2 * Math.atan2(x, w);
            pitch = Math.PI / 2;
            roll = 0;

            var euler = new THREE.Vector3(pitch, roll, yaw);
            return euler;
        }

        if (test < -0.499) {
            yaw = -2 * Math.atan2(x, w);
            pitch = -Math.PI / 2;
            roll = 0;
            var euler = new THREE.Vector3(pitch, roll, yaw);
            return euler;
        }

        var sqx = x * x;
        var sqy = y * y;
        var sqz = z * z;
        yaw = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
        pitch = Math.asin(2 * test);
        roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);

        var euler = new THREE.Vector3(pitch, roll, yaw);

        return euler;
    }

    this.update = function() {
        if (gyroPresent && scope.deviceOrientation.alpha != undefined) {

            if (scope.enabled === false) return;

            if (document.body.clientHeight > document.body.clientWidth) { //portrait
                this.lat = Math.max(this.minLatPort, Math.min(this.maxLatPort, this.lat));
                this.lon = Math.max(this.minLonPort, Math.min(this.maxLonPort, this.lon));
            } else {
                this.lat = Math.max(this.minLatLands, Math.min(this.maxLatLands, this.lat));
                this.lon = Math.max(this.minLonLands, Math.min(this.maxLonLands, this.lon));
            }
            
            this.phi = THREE.Math.degToRad(90 - this.lat);
            this.theta = THREE.Math.degToRad(this.lon);

            this.thetaCamera = THREE.Math.degToRad(this.lon - 90);
            this.phiCamera = THREE.Math.degToRad(90 - this.lat);

            if (lockView) {
                if (this.lat < -10) {
                    this.phiCamera = THREE.Math.degToRad(100);
                }
            }

            camera.target.x = 500 * Math.sin(this.phiCamera) * Math.cos(this.thetaCamera);
            camera.target.y = 500 * Math.cos(this.phiCamera);
            camera.target.z = 500 * Math.sin(this.phiCamera) * Math.sin(this.thetaCamera);
            camera.lookAt(camera.target);

        } else {
            if (appState !== CONTROLLER_STATE.AUTO) {
                this.updateManualMove();
            }
        }

    };

    this.updateAlphaOffsetAngle = function(angle) {

        this.alphaOffsetAngle = angle;
        this.update();

    };

    this.dispose = function() {

        this.disconnect();

    };


    this.onDocumentMouseDown = function(event) {

        if (this.enableManualDrag !== true) return;

        //event.preventDefault();

        appState = CONTROLLER_STATE.MANUAL_ROTATE;

        this.freeze = true;

        tmpQuat.copy(this.object.quaternion);

        startX = currentX = event.pageX;
        startY = currentY = event.pageY;

        // Set consistent scroll speed based on current viewport width/height
        scrollSpeedX = (1200 / window.innerWidth) * 0.2;
        scrollSpeedY = (800 / window.innerHeight) * 0.2;

        this.element.addEventListener('mousemove', this.onDocumentMouseMove, false);
        this.element.addEventListener('mouseup', this.onDocumentMouseUp, false);

        fireEvent(CONTROLLER_EVENT.MANUAL_CONTROL + 'start');
        fireEvent(CONTROLLER_EVENT.ROTATE_CONTROL + 'start');
    }.bind(this);

    this.onDocumentMouseMove = function(event) {
        currentX = event.pageX;
        currentY = event.pageY;
    }.bind(this);

    this.onDocumentMouseUp = function(event) {
        this.element.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        this.element.removeEventListener('mouseup', this.onDocumentMouseUp, false);

        appState = CONTROLLER_STATE.AUTO;

        this.freeze = false;

        fireEvent(CONTROLLER_EVENT.MANUAL_CONTROL + 'end');
        fireEvent(CONTROLLER_EVENT.ROTATE_CONTROL + 'end');
    }.bind(this);

    this.onDocumentTouchStart = function(event) {

        //event.preventDefault();
        //event.stopPropagation();

        switch (event.touches.length) {
            case 1: // ROTATE
                if (this.enableManualDrag !== true) return;

                appState = CONTROLLER_STATE.MANUAL_ROTATE;

                this.freeze = true;

                tmpQuat.copy(this.object.quaternion);

                startX = currentX = event.touches[0].pageX;
                startY = currentY = event.touches[0].pageY;

                // Set consistent scroll speed based on current viewport width/height
                scrollSpeedX = (1200 / window.innerWidth) * 0.1;
                scrollSpeedY = (800 / window.innerHeight) * 0.1;

                this.element.addEventListener('touchmove', this.onDocumentTouchMove, false);
                this.element.addEventListener('touchend', this.onDocumentTouchEnd, false);

                fireEvent(CONTROLLER_EVENT.MANUAL_CONTROL + 'start');
                fireEvent(CONTROLLER_EVENT.ROTATE_CONTROL + 'start');

                break;

            case 2: // ZOOM
                if (this.enableManualZoom !== true) return;

                appState = CONTROLLER_STATE.MANUAL_ZOOM;

                this.freeze = true;

                tmpFOV = this.object.fov;

                zoomP1.set(event.touches[0].pageX, event.touches[0].pageY);
                zoomP2.set(event.touches[1].pageX, event.touches[1].pageY);

                zoomStart = zoomCurrent = zoomP1.distanceTo(zoomP2);

                this.element.addEventListener('touchmove', this.onDocumentTouchMove, false);
                this.element.addEventListener('touchend', this.onDocumentTouchEnd, false);

                fireEvent(CONTROLLER_EVENT.MANUAL_CONTROL + 'start');
                fireEvent(CONTROLLER_EVENT.ZOOM_CONTROL + 'start');

                break;
        }
    }.bind(this);

    this.onDocumentTouchMove = function(event) {
        switch (event.touches.length) {
            case 1:
                currentX = event.touches[0].pageX;
                currentY = event.touches[0].pageY;
                break;

            case 2:
                zoomP1.set(event.touches[0].pageX, event.touches[0].pageY);
                zoomP2.set(event.touches[1].pageX, event.touches[1].pageY);
                break;
        }
    }.bind(this);

    this.onDocumentTouchEnd = function(event) {
        this.element.removeEventListener('touchmove', this.onDocumentTouchMove, false);
        this.element.removeEventListener('touchend', this.onDocumentTouchEnd, false);

        if (appState === CONTROLLER_STATE.MANUAL_ROTATE) {

            appState = CONTROLLER_STATE.AUTO; // reset control state

            this.freeze = false;

            fireEvent(CONTROLLER_EVENT.MANUAL_CONTROL + 'end');
            fireEvent(CONTROLLER_EVENT.ROTATE_CONTROL + 'end');

        } else if (appState === CONTROLLER_STATE.MANUAL_ZOOM) {

            this.constrainObjectFOV(); // re-instate original object FOV

            appState = CONTROLLER_STATE.AUTO; // reset control state

            this.freeze = false;

            fireEvent(CONTROLLER_EVENT.MANUAL_CONTROL + 'end');
            fireEvent(CONTROLLER_EVENT.ZOOM_CONTROL + 'end');

        }

        this.prevLat = this.lat;
        this.prevLon = this.lon;

    }.bind(this);


    this.updateManualMove = function() {

        var lat, lon;
        var phi, theta;

        var rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        var rotQuat = new THREE.Quaternion();
        var objQuat = new THREE.Quaternion();

        var tmpZ, objZ, realZ;

        var zoomFactor, minZoomFactor = 1; // maxZoomFactor = Infinity

        return function() {

            objQuat.copy(tmpQuat);

            if (appState === CONTROLLER_STATE.MANUAL_ROTATE) {

                lat = (startY - currentY) * scrollSpeedY;
                lon = (startX - currentX) * scrollSpeedX;

                this.lat = this.prevLat + lat;
                this.lon = this.prevLon + lon;

                if (document.body.clientHeight > document.body.clientWidth) { //portrait
                    this.lat = Math.max(this.minLatPort, Math.min(this.maxLatPort, this.lat));
                    this.lon = Math.max(this.minLonPort, Math.min(this.maxLonPort, this.lon));
                } else {
                    this.lat = Math.max(this.minLatLands, Math.min(this.maxLatLands, this.lat));
                    this.lon = Math.max(this.minLonLands, Math.min(this.maxLonLands, this.lon));
                }

                if (lockView) {
                    if (this.lat < -10) {
                        this.lat = -10;
                    }
                }

                lat = this.lat - this.prevLat;
                lon = this.lon - this.prevLon;
                phi = THREE.Math.degToRad(lat);
                theta = THREE.Math.degToRad(lon);

                // document.getElementById("coords").innerHTML = "Lat: " + this.lat + ", Lon: " + this.lon;

             

                rotQuat.set(0, Math.sin(theta / 2), 0, Math.cos(theta / 2));

                objQuat.multiply(rotQuat);

                rotQuat.set(Math.sin(phi / 2), 0, 0, Math.cos(phi / 2));

                objQuat.multiply(rotQuat);

                // Remove introduced z-axis rotation and add device's current z-axis rotation

                tmpZ = rotation.setFromQuaternion(tmpQuat, 'YXZ').z;
                objZ = rotation.setFromQuaternion(objQuat, 'YXZ').z;
                realZ = rotation.setFromQuaternion(deviceQuat || tmpQuat, 'YXZ').z;

                rotQuat.set(0, 0, Math.sin((realZ - tmpZ) / 2), Math.cos((realZ - tmpZ) / 2));

                tmpQuat.multiply(rotQuat);

                rotQuat.set(0, 0, Math.sin((realZ - objZ) / 2), Math.cos((realZ - objZ) / 2));

                objQuat.multiply(rotQuat);

                this.object.quaternion.copy(objQuat);

            } else if (appState === CONTROLLER_STATE.MANUAL_ZOOM) {

                zoomCurrent = zoomP1.distanceTo(zoomP2);

                zoomFactor = zoomStart / zoomCurrent;

                if (zoomFactor <= minZoomFactor) {

                    this.object.fov = tmpFOV * zoomFactor;

                    this.object.updateProjectionMatrix();

                }

                // Add device's current z-axis rotation

                if (deviceQuat) {

                    tmpZ = rotation.setFromQuaternion(tmpQuat, 'YXZ').z;
                    realZ = rotation.setFromQuaternion(deviceQuat, 'YXZ').z;

                    rotQuat.set(0, 0, Math.sin((realZ - tmpZ) / 2), Math.cos((realZ - tmpZ) / 2));

                    tmpQuat.multiply(rotQuat);

                    this.object.quaternion.copy(tmpQuat);

                }

            }

        };

    }();


    this.connect();

    /*
    var h_alpha = 0;
    var h_beta = Math.PI/2;
    var h_gamma = 0;
    var h_orient = 0;
    
    var p_alpha;
    var p_beta;
    var p_gamma;
    var p_orient;
    
    setObjectQuaternion(this.object.quaternion, h_alpha, h_beta, h_gamma, h_orient);
    */

};


DeviceOrientationController.prototype = Object.create(THREE.EventDispatcher.prototype);