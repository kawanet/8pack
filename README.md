# 8pack

[![Node.js CI](https://github.com/kawanet/8pack/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/8pack/actions/)
[![npm version](https://img.shields.io/npm/v/8pack)](https://www.npmjs.com/package/8pack)
[![minified size](https://img.shields.io/bundlephobia/min/8pack)](https://cdn.jsdelivr.net/npm/8pack/dist/8pack.min.js)

TBD

## SYNOPSIS

```js
const {epack} = require("8pack");

const object = {text: "string", data: new Uint8Array([1, 2, 3, 4])};

const encoded = epack.encode(object); // => Uint8Array
const decoded = epack.decode(encoded); // => object
(decoded.data instanceof Uint8Array); // => true
```

Good old `JSON.stringify()` does not support binary on the other hand.

```js
const encoded = JSON.string(object); // => string
const decoded = bpack.decode(encoded); // => object
(decoded.data instanceof Uint8Array); // => false
```

### Node.js

`bpack` is available to encode to and decode from [Buffer](https://nodejs.org/api/buffer.html) on Node.js.

```js
const {bpack} = require("8pack");

const object = {text: "string", data: new Buffer([1, 2, 3, 4])};

const encoded = bpack.encode(object); // => Buffer
const decoded = bpack.decode(encoded); // => object
(decoded.data instanceof Buffer); // => true
```

### Types

SerializationTag

| name | tag | hex | type or class | payload |
|----|----|----|----|----|
| kPadding | `\0` | `00 00 00 00 00 00 00 00` | N/A ||
| kUndefined | `_` | `5f 00 00 00 00 00 00 00` | undefined ||
| kNull | `0` | `30 00 00 00 00 00 00 00` | null ||
| kTrue | `T` | `54 00 00 00 00 00 00 00` | boolean ||
| kFalse | `F` | `46 00 00 00 00 00 00 00` | boolean ||
| kInt32 | `I` | `49 00 00 00 xx xx xx xx` | number | int32 |
| kDouble | `N` | `4e 80 00 00 00 00 00 00` `...` | number | double |
| kBigInt | `Z` | `5a PL xx xx xx xx xx xx` | BigInt | Latin-1 |
| kUtf8String | `S` | `53 00 00 00 00 00 00 00` | string | UTF-8 |
| kOneByteString | `"` | `22 PL xx xx xx xx xx xx` | string | Latin-1 |
| kTwoByteString | `c` | `63 PL xx xx xx xx xx xx` | string | UTF-16 |
| kBeginJSObject | `o` | `6f 00 00 00 hh hh hh hh` `...` | object | 8pack[] |
| kBeginDenseJSArray | `A` | `41 00 00 00 hh hh hh hh` `...` | Array | 8pack[] |
| kDate | `D` | `44 80 00 00 00 00 00 00` `...` | Date | double |
| kRegExp | `R` | `52 PL xx xx xx xx xx xx` | RegExp ||
| kBeginJSMap | `;` | `3b 00 00 00 hh hh hh hh` `...` | Map | 8pack[] |
| kBeginJSSet | `'` | `27 00 00 00 hh hh hh hh` `...` | Set | 8pack[] |
| kArrayBuffer | `B` | `42 40 00 00 hh hh hh hh` `...` | ArrayBuffer | uint8[] |
| kArrayBufferView | `V` | `56 40 SS 00 hh hh hh hh` `...` | TypedArray | uint8[] |
| kExtension | 128-255 | `xx PL xx xx xx xx xx xx` | any | uint8[] |

ArrayBufferViewTag

| name | tag | hex | type or class | payload |
|----|----|----|----|----|
| kInt8Array | `b` | `56 40 62 00 hh hh hh hh` `...` |||
| kUint8Array | `B` | `56 40 42 00 hh hh hh hh` `...` |||
| kUint8ClampedArray | `C` | `56 40 43 00 hh hh hh hh` `...` |||
| kInt16Array | `w` | `56 40 77 00 hh hh hh hh` `...` |||
| kUint16Array | `W` | `56 40 57 00 hh hh hh hh` `...` |||
| kInt32Array | `d` | `56 40 64 00 hh hh hh hh` `...` |||
| kUint32Array | `D` | `56 40 44 00 hh hh hh hh` `...` |||
| kFloat32Array | `f` | `56 40 66 00 hh hh hh hh` `...` |||
| kFloat64Array | `F` | `56 40 46 00 hh hh hh hh` `...` |||
| kBigInt64Array | `q` | `56 40 71 00 hh hh hh hh` `...` |||
| kBigUint64Array | `Q` | `56 40 51 00 hh hh hh hh` `...` |||
| kDataView | `?` | `56 40 3f 00 hh hh hh hh` `...` |||
| kBuffer | 255 | `56 40 ff 00 hh hh hh hh` `...` | Buffer ||

### Payload Layout Bitmask

| hex | bitmask |  packet size | payload offset |payload length | description |
|----|----|----|----|----|----|
| `00` | `0 - - - - - - -` | 8 byte | - | - | short packet |
| `80` | `1 - - - - - - -` | 16 byte | - | - | wide packet |
| `0x` | `0 0 0 0 0 x x x` | 8 byte | 2 | 0 - 6 | inline payload |
| `8x` | `1 0 0 0 x x x x` | 16 byte | 2 | 7 - 14 | inline payload |
| `40` | `0 1 0 0 0 0 0 0` | 8 byte | 8 | 0 - 2GB | external payload |

### LINKS

- https://github.com/kawanet/8pack
- https://www.npmjs.com/package/8pack
