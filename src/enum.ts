/**
 * @see https://github.com/kawanet/8pack
 */

export const enum defaults {
    initialBufferSize = 2048,
}

export const enum PayloadLayout {
    wide = 0x80,
    offsetMask = 0x40,
    offset2 = 0x00,
    offset8 = 0x40,
    offset2wide = offset2 | wide,
    sizeMask = 0x0f,
    external = 0x40,
    offset8size8 = wide,
}

/**
 * @see https://github.com/v8/v8/blob/master/src/objects/value-serializer.cc
 */

export const enum SerializationTag {
    kPadding = 0x00, // \0
    kUndefined = 0x5f, // _
    kNull = 0x30, // 0
    kTrue = 0x54, // T
    kFalse = 0x46, // F
    kInt32 = 0x49, // I
    kDouble = 0x4e, // N
    kBigInt = 0x5a, // Z
    kUtf8String = 0x53, // S
    kOneByteString = 0x22, // "
    kTwoByteString = 0x63, // c
    kBeginJSObject = 0x6f, // o
    kBeginDenseJSArray = 0x41, // A
    kDate = 0x44, // D
    kRegExp = 0x52, // R
    kBeginJSMap = 0x3b, // ;
    kBeginJSSet = 0x27, // '
    kArrayBuffer = 0x42, // B
    kArrayBufferView = 0x56, // V
}

export const enum ArrayBufferViewTag {
    kInt8Array = 0x62, // b
    kUint8Array = 0x42, // B
    kUint8ClampedArray = 0x43, // C
    kInt16Array = 0x77, // w
    kUint16Array = 0x57, // W
    kInt32Array = 0x64, // d
    kUint32Array = 0x44, // D
    kFloat32Array = 0x66, // f
    kFloat64Array = 0x46, // F
    kBigInt64Array = 0x71, // q
    kBigUint64Array = 0x51, // Q
    kDataView = 0x3F, // ?
}
