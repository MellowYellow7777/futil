sets a global variable "futil" which has the following properties:

```javascript
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
```
