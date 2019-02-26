"use strict";

class GyroGroup extends THREE.Group {

    constructor() {
        super();
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.gyroNorm = new GyroNorm();
        this.range = 0.1;
        let self = this;
        let args = {
            frequency: 10, // ( How often the object sends the values - milliseconds )
            gravityNormalized: true, // ( If the gravity related values to be normalized )
            orientationBase: GyroNorm.GAME, // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
            decimalCount: 4, // ( How many digits after the decimal point will there be in the return values )
            logger: null, // ( Function to be called to log messages from gyronorm.js )
            screenAdjusted: false // ( If set to true it will return screen adjusted values. )
        };

        this.gyroNorm.init(args).then(function () {
            self.gyroNorm.start(function (data) {
                GyroGroup.createQuaternion(self, data.do.alpha, data.do.beta, data.do.gamma);
            });
        }).catch(function (e) {
            console.log("Device orientation error " + e);
        });
    }

    static createQuaternion(self, alpha, beta, gamma) {
        let x = beta ? beta * Math.PI / 180 : 0;
        let y = gamma ? gamma * Math.PI / 180 : 0;
        let z = alpha ? alpha * Math.PI / 180 : 0;

        let cX = Math.cos(x / 2);
        let cY = Math.cos(y / 2);
        let cZ = Math.cos(z / 2);
        let sX = Math.sin(x / 2);
        let sY = Math.sin(y / 2);
        let sZ = Math.sin(z / 2);

        let qw = cX * cY * cZ - sX * sY * sZ;
        let qx = sX * cY * cZ - cX * sY * sZ;
        let qy = cX * sY * cZ + sX * cY * sZ;
        let qz = cX * cY * sZ + sX * sY * cZ;

        // Calculate inverse.
        let sq = qw * qw + qx * qx + qy * qy + qz * qz;
        qw /= sq;
        qx /= -sq;
        qy /= -sq;
        qz /= -sq;

        // Need to deconstruct the quaternion in order to limit the rotation.
        GyroGroup.quaternionToEulerAngle(self, qw, qx, qy, qz);
        GyroGroup.eulerAngleToQuaternion(self);
    }

    static quaternionToEulerAngle(self, w, x, y, z) {
        let t0 = 2.0 * (w * x + y * z);
        let t1 = 1.0 - 2.0 * (x * x + y * y);
        self.X = GyroGroup.boundCheck(self, Math.atan2(t0, t1));

        let t2 = 2.0 * (w * y - z * x);
        if (t2 > 1.0) {
            t2 = 1.0;
        } else if (t2 < -1.0) {
            t2 = -1.0;
        }
        self.Y = GyroGroup.boundCheck(self, Math.asin(t2));

        let t3 = 2.0 * (w * z + x * y);
        let t4 = 1.0 - 2.0 * (y * y + z * z);
        self.Z = GyroGroup.boundCheck(self, Math.atan2(t3, t4));
    }

    static boundCheck(self, v) {
        v /= 10;
        if (v < -self.range) {
            v = -self.range;
        }
        if (v > self.range) {
            v = self.range;
        }
        return v;
    }

    static eulerAngleToQuaternion(self) {
        let cx = Math.cos(self.X * 0.5);
        let sx = Math.sin(self.X * 0.5);
        let cy = Math.cos(self.Y * 0.5);
        let sy = Math.sin(self.Y * 0.5);
        let cz = Math.cos(self.Z * 0.5);
        let sz = Math.sin(self.Z * 0.5);

        let qw = cz * cx * cy + sz * sx * sy;
        let qx = cz * sx * cy - sz * cx * sy;
        let qy = cz * cx * sy + sz * sx * cy;
        let qz = sz * cx * cy - cz * sx * sy;

        self.quaternion.set(qx, qy, qz, qw);
    }
}