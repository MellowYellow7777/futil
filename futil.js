(() => {

var S_MASK            = 0x8000000000000000n;
var E_MASK            = 0x7ff0000000000000n;
var T_MASK            = 0x000fffffffffffffn;
var SE_MASK           = 0xfff0000000000000n;
var ET_MASK           = 0x7fffffffffffffffn;
var SQ_MASK           = 0x0008000000000000n;
var PL_MASK           = 0x0007ffffffffffffn;
var LB_MASK           = 0x0010000000000000n;

var futil = {};

var _buffer = new ArrayBuffer(8)
var _view = new DataView(_buffer);

futil._buffer = _buffer;
futil._view = _view;

function binary(x) {
  _view.setFloat64(0,x,true);
  return _view.getBigUint64(0,true);
}

function float(x) {
  _view.setBigInt64(0,BigInt(x),true);
  return _view.getFloat64(0,true);
}

function signbit(x) {
  if (typeof x === 'number') x = binary(x);
  return x & S_MASK ? 1 : 0;
}

function signbitBig(x) {
  if (typeof x === 'number') x = binary(x);
  return x & S_MASK ? 1n : 0n;
}

function decodeSignbit(x) {
  if (typeof x === 'number') x = binary(x);
  return x & S_MASK ? -1 : +1;
}

function decodeSignbitBig(x) {
  if (typeof x === 'number') x = binary(x);
  return x & S_MASK ? -1n : +1n;
}

function exponent(x) {
  if (typeof x === 'number') x = binary(x);
  return Number((x & E_MASK) >> 52n);
}

function exponentBig(x) {
  if (typeof x === 'number') x = binary(x);
  return (x & E_MASK) >> 52n;
}

function decodeExponent(x) {
  if (typeof x === 'number') x = binary(x);
  return Number((x & E_MASK) >> 52n) - 1023;
}

function decodeExponentBig(x) {
  if (typeof x === 'number') x = binary(x);
  return ((x & E_MASK) >> 52n) - 1023n;
}

function significand(x) {
  if (typeof x === 'number') x = binary(x);
  return Number(x & T_MASK);
}

function significandBig(x) {
  if (typeof x === 'number') x = binary(x);
  return x & T_MASK;
}

function mantissa(x) {
  if (typeof x === 'number') x = binary(x);
  if (x & E_MASK) return Number(x & T_MASK | LB_MASK);
  return Number(x & T_MASK);
}

function mantissaBig(x) {
  if (typeof x === 'number') x = binary(x);
  if (x & E_MASK) return x & T_MASK | LB_MASK;
  return x & T_MASK;
}

function decodeMantissa(x) {
  if (typeof x === 'number') x = binary(x);
  if (x & E_MASK) return 1 + Number(x & T_MASK) / 0x10000000000000;
  return Number(x & T_MASK) / 0x10000000000000;
}

function payload(x) {
  if (typeof x === 'number') x = binary(x);
  return Number(x & PL_MASK);
}

function payloadBig(x) {
  if (typeof x === 'number') x = binary(x);
  return x & PL_MASK;
}

function pack(sign=0n,exponent=0n,significand=0n) {
  var bin = BigInt(sign) << 63n & S_MASK
          | BigInt(exponent) << 52n & E_MASK
          | BigInt(significand) & T_MASK;
  _view.setBigUint64(0,bin,true);
  return _view.getFloat64(0,true);
}

function packBin(sign=0n,exponent=0n,significand=0n) {
  return BigInt(sign) << 63n & S_MASK
       | BigInt(exponent) << 52n & E_MASK
       | BigInt(significand) & T_MASK;
}

function packNaN(sign=0n,signaling=0n,payload=0n) {
  var bin = BigInt(sign) << 63n & S_MASK
          | BigInt(signaling) << 51n & SQ_MASK
          | BigInt(payload) & PL_MASK;
  _view.setBigUint64(0,bin,true);
  return _view.getFloat64(0,true);
}

function packNaNBin(sign=0n,signaling=0n,payload=0n) {
  return BigInt(sign) << 63n & S_MASK
       | BigInt(signaling) << 51n & SQ_MASK
       | BigInt(payload) & PL_MASK;
}

function unpack(x) {
  if (typeof x === 'number') x = binary(x);
  return [
    x & S_MASK ? 1 : 0,
    Number((x & E_MASK) >> 52n),
    Number(x & T_MASK),
  ];
}

function unpackBig(x) {
  if (typeof x === 'number') x = binary(x);
  return [
    x & S_MASK ? 1n : 0n,
    (x & E_MASK) >> 52n,
    x & T_MASK,
  ];
}

function unpackNaN(x) {
  if (typeof x === 'number') x = binary(x);
  return [
    x & S_MASK ? 1 : 0,
    Number((x & SQ_MASK) >> 51n),
    Number(x & PL_MASK),
  ];
}

function unpackNaNBig(x) {
  if (typeof x === 'number') x = binary(x);
  return [
    x & S_MASK ? 1n : 0n,
    (x & SQ_MASK) >> 51n,
    x & PL_MASK,
  ];
}

function classify(x) {
  if (typeof x === 'number') x = binary(x);
  if (typeof x !== 'bigint') return 'invalid';
  if (x === S_MASK) return 'zero';
  if (x === 0n) return 'zero';
  if (x === SE_MASK) return 'infinite';
  if (x === E_MASK) return 'infinite';
  var e = x & E_MASK;
  if (e === E_MASK)  return 'nan';
  else if (e === 0n) return 'subnormal';
  else return 'normal';
}

function isValid(x) {
  return classify(x) !== 'invalid';
}

function isNaN(x) {
  return classify(x) === 'nan';
}

function isQNaN(x) {
  if (typeof x === 'number') x = binary(x);
  return x & SQ_MASK && isNaN(x);
}

function isSNaN(x) {
  if (typeof x === 'number') x = binary(x);
  return !(x & SQ_MASK) && isNaN(x);
}

function isInfinite(x) {
  return classify(x) === 'infinite';
}

function isZero(x) {
  return classify(x) === 'zero';
}

function isSubnormal(x) {
  return classify(x) === 'subnormal';
}

function isNormal(x) {
  return classify(x) === 'normal';
}

function isFinite(x) {
  var c = classify(x);
  return c === 'normal' || c === 'subnormal' || c === 'zero';
}

function decode(x) {
  if (typeof x === 'number') x = binary(x);
  switch (classify(x)) {
    case 'normal': return {
      type: 'normal',
      sign: x & S_MASK ? -1 : 1,
      exponent: Number((x & E_MASK) >> 52n) - 1023,
      mantissa: 1 + Number(x & T_MASK) / 0x10000000000000,
      raw: x,
    };
    case 'subnormal': return {
      type: 'subnormal',
      sign: x & S_MASK ? -1 : 1,
      exponent: 0,
      mantissa: Number(x & T_MASK) / 0x10000000000000,
      raw: x,
    };
    case 'zero': return {
      type: 'zero',
      sign: x & S_MASK ? -1 : 1,
      exponent: 0,
      raw: x,
    };
    case 'infinite': return {
      type: 'infinite',
      sign: x & S_MASK ? -1 : 1,
      raw: x,
    };
    case 'nan': return {
      type: 'nan',
      sign: x & S_MASK ? -1 : 1,
      signaling: !(x & SQ_MASK),
      payload: Number(x & PL_MASK),
      raw: x,
    };
    default: return {
      type: 'invalid',
      raw: x,
    };
  }
}

function equal(x,y) {
  if (typeof x === 'number') x = binary(x);
  if (typeof y === 'number') y = binary(y);
  return x === y;
}

function sign(x) {
  _view.setFloat64(0,x,true);
  return _view.getBigUint64(0,true) & 0x8000000000000000n ? -1 : 1;
}

function copysign(x,y) {
  if (typeof x === 'number') x = binary(x);
  if (typeof y === 'number') y = binary(y);
  var bin = x & ET_MASK | y & S_MASK;
  _view.setBigUint64(0,bin,true);
  return _view.getFloat64(0,true);
}

function nextup(x) {
  if (isNaN(x)) return NaN;
  if (x === Infinity) return Infinity;
  if (x === -Infinity) return -Number.MAX_VALUE;
  if (x === 0) {
    if (1/x < 0) return 0;
    else return Number.MIN_VALUE;
  }
  _view.setFloat64(0,x,true);
  var bin = _view.getBigUint64(0,true);
  if (x > 0) bin++;
  else bin--;
  _view.setBigUint64(0,bin,true);
  return _view.getFloat64(0,true);
}

function nextdown(x) {
  if (isNaN(x)) return NaN;
  if (x === -Infinity) return -Infinity;
  if (x === Infinity) return Number.MAX_VALUE;
  if (x === 0) {
    if (1/x > 0) return -0;
    else return -Number.MIN_VALUE;
  }
  _view.setFloat64(0,x,true);
  var bin = _view.getBigUint64(0,true);
  if (x > 0) bin--;
  else bin++;
  _view.setBigUint64(0,bin,true);
  return _view.getFloat64(0,true);
}

function nextafter(x,y) {
  if (isNaN(x) || isNaN(y)) return NaN;
  if (x === 0 && y === 0) {
    var xs = 1/x;
    var ys = 1/y;
    if (xs === ys) return y;
    if (ys > xs) return 0;
    else return -0;
  }
  if (x === y) return y;
  if (y > x) return nextup(x);
  else return nextdown(x);
}

function nextbefore(x,y) {
  if (isNaN(x) || isNaN(y)) return NaN;
  if (x === 0 && y === 0) {
    var xs = 1/x;
    var ys = 1/y;
    if (xs === ys) return y;
    if (xs > ys) return Number.MIN_VALUE;
    else return -Number.MIN_VALUE;
  }
  if (x === y) return y;
  if (x > y) return nextup(x);
  else return nextdown(x);
}

futil.QNAN              = 0x7ff8000000000000n;
futil.SNAN              = 0x7ff4000000000000n;
futil.EPSILON           = 0x3cb0000000000000n;
futil.MIN_VALUE         = 0x0000000000000001n;
futil.MAX_VALUE         = 0x7fefffffffffffffn;
futil.NEGATIVE_ZERO     = 0x8000000000000000n;
futil.POSITIVE_ZERO     = 0x0000000000000000n;
futil.NEGATIVE_INFINITY = 0xfff0000000000000n;
futil.POSITIVE_INFINITY = 0x7ff0000000000000n;
futil.MIN_SAFE_INTEGER  = 0xc33fffffffffffffn;
futil.MAX_SAFE_INTEGER  = 0x433fffffffffffffn;
futil.MIN_NORMAL        = 0x0010000000000000n;
futil.MAX_SUBNORRMAL    = 0x000fffffffffffffn;

futil.PI                = 0x400921fb54442d18n;
futil.E                 = 0x4005bf0a8b145769n;
futil.SQRT2             = 0x3ff6a09e667f3bcdn;
futil.SQRT1_2           = 0x3fe6a09e667f3bcdn;
futil.LN2               = 0x3fe62e42fefa39efn;
futil.LN10              = 0x40026bb1bbb55516n;
futil.LOG2E             = 0x3ff71547652b82fen;
futil.LOG10E            = 0x3fdbcb7b1526e50en;

futil.S_MASK            = S_MASK;
futil.E_MASK            = E_MASK;
futil.T_MASK            = T_MASK;
futil.SQ_MASK           = SQ_MASK;
futil.PL_MASK           = PL_MASK;
futil.LB_MASK           = LB_MASK;

futil._buffer           = _buffer;
futil._view             = _view;

futil.binary            = binary;
futil.float             = float;

futil.signbit           = signbit;
futil.exponent          = exponent;
futil.significand       = significand;
futil.mantissa          = mantissa;
futil.payload           = payload;

futil.signbitBig        = signbitBig;
futil.exponentBig       = exponentBig;
futil.significandBig    = significandBig;
futil.mantissaBig       = mantissaBig;
futil.payloadBig        = payloadBig;

futil.decode            = decode;
futil.decodeSignbit     = decodeSignbit;
futil.decodeExponent    = decodeExponent;
futil.decodeMantissa    = decodeMantissa;
futil.decodeSignbitBig  = decodeSignbitBig;
futil.decodeExponentBig = decodeExponentBig;

futil.pack              = pack;
futil.packBin           = packBin;
futil.packNaN           = packNaN;
futil.packNaNBin        = packNaNBin;
futil.unpack            = unpack;
futil.unpackBig         = unpackBig;
futil.unpackNaN         = unpackNaN;
futil.unpackNaNBig      = unpackNaNBig;

futil.classify          = classify;
futil.isValid           = isValid;
futil.isNaN             = isNaN;
futil.isQNaN            = isQNaN;
futil.isSNaN            = isSNaN;
futil.isInfinite        = isInfinite;
futil.isZero            = isZero;
futil.isSubnormal       = isSubnormal;
futil.isNormal          = isNormal;
futil.isFinite          = isFinite;
futil.equal             = equal;

futil.sign              = sign;
futil.copysign          = copysign;
futil.nextup            = nextup;
futil.nextdown          = nextdown;
futil.nextafter         = nextafter;
futil.nextbefore        = nextbefore;

if (typeof module !== 'undefined') {
  module.exports = futil;
}

globalThis.futil = futil;

})();