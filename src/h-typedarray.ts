/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {SerializationTag as Tag, ArrayBufferViewTag as ST} from "./enum";
import * as Buffer from "./node-buffer";

type Handler<T> = eightpack.Handler<T>;

/**
 * subset interface of TypedArray constructor
 */

interface C {
    new(buffer: ArrayBuffer, byteOffset?: number, length?: number): ArrayBufferView;

    BYTES_PER_ELEMENT?: number;
}

/**
 * Definition
 */

interface Type {
    tag: number;

    size: number;

    // Buffer.from()
    from: (buffer: ArrayBuffer, byteOffset?: number, length?: number) => ArrayBufferView;

    // Buffer.isBuffer()
    match: (value: ArrayBufferView) => boolean;
}

const typeList: Type[] = [];
const tagIndex: Type[] = [];

const addType = (tag: number, fn: C): Type => {
    const def = {} as Type;
    def.tag = tag;
    def.size = fn.BYTES_PER_ELEMENT || 1;
    def.from = ((buffer, byteOffset, length) => new fn(buffer, byteOffset, length));
    def.match = (value => value instanceof fn);
    typeList.push(def);
    tagIndex[tag] = def;
    return def;
};

addType(ST.kInt8Array, Int8Array);
addType(ST.kUint8Array, Uint8Array);
addType(ST.kUint8ClampedArray, Uint8ClampedArray);
addType(ST.kInt16Array, Int16Array);
addType(ST.kUint16Array, Uint16Array);
addType(ST.kInt32Array, Int32Array);
addType(ST.kUint32Array, Uint32Array);
addType(ST.kFloat32Array, Float32Array);
addType(ST.kFloat64Array, Float64Array);
if ("undefined" !== typeof BigInt64Array) addType(ST.kBigInt64Array, BigInt64Array);
if ("undefined" !== typeof BigUint64Array) addType(ST.kBigUint64Array, BigUint64Array);
addType(ST.kDataView, DataView);

const defaultType = tagIndex[ST.kUint8Array];

const pickSubTag = (obj: ArrayBufferView): number => {
    for (const type of typeList) {
        if (type.match(obj)) return type.tag;
    }
};

if (Buffer) {
    const {from, isBuffer: match} = Buffer;
    if (from && match) {
        const type: Type = {tag: ST.kBuffer, from: from, size: 1, match: match};
        typeList.unshift(type); // insert at the top of the list
        tagIndex[ST.kBuffer] = type;
    }
}

/**
 * TypedArray
 */

export const hArrayBufferView: Handler<ArrayBufferView> = {
    tag: Tag.kArrayBufferView,

    read: (buf) => {
        const subtag = buf.getUint8(2);
        const type = tagIndex[subtag] || defaultType;
        const {from, size} = type;

        return buf.getU8Array((array, offset, length) => {
            const {buffer, byteOffset} = array;
            return from(buffer, byteOffset + offset, length / size);
        });
    },

    match: value => ArrayBuffer.isView(value),

    ignoreToJSON: true,

    write: (buf, value) => {
        const {buffer, byteLength, byteOffset} = value;

        buf = buf.prepare(8 + byteLength);
        buf.setUint8(0, Tag.kArrayBufferView);
        buf.setUint8(2, pickSubTag(value));

        const data = new Uint8Array(buffer, byteOffset, byteLength);
        buf.insertPayload(data);
    }
};
