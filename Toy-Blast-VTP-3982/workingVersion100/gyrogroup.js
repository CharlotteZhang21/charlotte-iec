"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GyroGroup =
/*#__PURE__*/
function (_THREE$Group) {
  _inherits(GyroGroup, _THREE$Group);

  function GyroGroup() {
    var _this;

    _classCallCheck(this, GyroGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GyroGroup).call(this));
    _this.X = 0;
    _this.Y = 0;
    _this.Z = 0;
    _this.gyroNorm = new GyroNorm();
    _this.range = 0.1;

    var self = _assertThisInitialized(_this);

    var args = {
      frequency: 10,
      // ( How often the object sends the values - milliseconds )
      gravityNormalized: true,
      // ( If the gravity related values to be normalized )
      orientationBase: GyroNorm.GAME,
      // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
      decimalCount: 4,
      // ( How many digits after the decimal point will there be in the return values )
      logger: null,
      // ( Function to be called to log messages from gyronorm.js )
      screenAdjusted: false // ( If set to true it will return screen adjusted values. )

    };

    _this.gyroNorm.init(args).then(function () {
      self.gyroNorm.start(function (data) {
        GyroGroup.createQuaternion(self, data.do.alpha, data.do.beta, data.do.gamma);
      });
    }).catch(function (e) {
      console.log("Device orientation error " + e);
    });

    return _this;
  }

  _createClass(GyroGroup, null, [{
    key: "createQuaternion",
    value: function createQuaternion(self, alpha, beta, gamma) {
      var x = beta ? beta * Math.PI / 180 : 0;
      var y = gamma ? gamma * Math.PI / 180 : 0;
      var z = alpha ? alpha * Math.PI / 180 : 0;
      var cX = Math.cos(x / 2);
      var cY = Math.cos(y / 2);
      var cZ = Math.cos(z / 2);
      var sX = Math.sin(x / 2);
      var sY = Math.sin(y / 2);
      var sZ = Math.sin(z / 2);
      var qw = cX * cY * cZ - sX * sY * sZ;
      var qx = sX * cY * cZ - cX * sY * sZ;
      var qy = cX * sY * cZ + sX * cY * sZ;
      var qz = cX * cY * sZ + sX * sY * cZ; // Calculate inverse.

      var sq = qw * qw + qx * qx + qy * qy + qz * qz;
      qw /= sq;
      qx /= -sq;
      qy /= -sq;
      qz /= -sq; // Need to deconstruct the quaternion in order to limit the rotation.

      GyroGroup.quaternionToEulerAngle(self, qw, qx, qy, qz);
      GyroGroup.eulerAngleToQuaternion(self);
    }
  }, {
    key: "quaternionToEulerAngle",
    value: function quaternionToEulerAngle(self, w, x, y, z) {
      var t0 = 2.0 * (w * x + y * z);
      var t1 = 1.0 - 2.0 * (x * x + y * y);
      self.X = GyroGroup.boundCheck(self, Math.atan2(t0, t1));
      var t2 = 2.0 * (w * y - z * x);

      if (t2 > 1.0) {
        t2 = 1.0;
      } else if (t2 < -1.0) {
        t2 = -1.0;
      }

      self.Y = GyroGroup.boundCheck(self, Math.asin(t2));
      var t3 = 2.0 * (w * z + x * y);
      var t4 = 1.0 - 2.0 * (y * y + z * z);
      self.Z = GyroGroup.boundCheck(self, Math.atan2(t3, t4));
    }
  }, {
    key: "boundCheck",
    value: function boundCheck(self, v) {
      v /= 10;

      if (v < -self.range) {
        v = -self.range;
      }

      if (v > self.range) {
        v = self.range;
      }

      return v;
    }
  }, {
    key: "eulerAngleToQuaternion",
    value: function eulerAngleToQuaternion(self) {
      var cx = Math.cos(self.X * 0.5);
      var sx = Math.sin(self.X * 0.5);
      var cy = Math.cos(self.Y * 0.5);
      var sy = Math.sin(self.Y * 0.5);
      var cz = Math.cos(self.Z * 0.5);
      var sz = Math.sin(self.Z * 0.5);
      var qw = cz * cx * cy + sz * sx * sy;
      var qx = cz * sx * cy - sz * cx * sy;
      var qy = cz * cx * sy + sz * sx * cy;
      var qz = sz * cx * cy - cz * sx * sy;
      self.quaternion.set(qx, qy, qz, qw);
    }
  }]);

  return GyroGroup;
}(THREE.Group);