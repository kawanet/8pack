/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {SerializationTag as Tag, ArrayBufferViewTag as ST} from "./enum";

type Handler<T> = eightpack.Handler<T>;

const nameToSubtag: { [name: string]: ST } = {
    Int8Array: ST.kInt8Array,
    Uint8Array: ST.kUint8Array,
    Uint8ClampedArray: ST.kUint8ClampedArray,
    Int16Array: ST.kInt16Array,
    Uint16Array: ST.kUint16Array,
    Int32Array: ST.kInt32Array,
    Uint32Array: ST.kUint32Array,
    Float32Array: ST.kFloat32Array,
    Float64Array: ST.kFloat64Array,
    BigInt64Array: ST.kBigInt64Array,
    BigUint64Array: ST.kBigUint64Array,
    DataView: ST.kDataView,
};

interface Fn {
    new(buffer: ArrayBuffer, byteOffset?: number, length?: number): ArrayBufferView;

    BYTES_PER_ELEMENT?: number;
}

const subtagToFn: Fn[] = [];
subtagToFn[ST.kInt8Array] = Int8Array;
subtagToFn[ST.kUint8Array] = Uint8Array;
subtagToFn[ST.kUint8ClampedArray] = Uint8ClampedArray;
subtagToFn[ST.kInt16Array] = Int16Array;
subtagToFn[ST.kUint16Array] = Uint16Array;
subtagToFn[ST.kInt32Array] = Int32Array;
subtagToFn[ST.kUint32Array] = Uint32Array;
subtagToFn[ST.kFloat32Array] = Float32Array;
subtagToFn[ST.kFloat64Array] = Float64Array;
subtagToFn[ST.kBigInt64Array] = ("undefined" !== typeof BigInt64Array) ? BigInt64Array : null;
subtagToFn[ST.kBigUint64Array] = ("undefined" !== typeof BigUint64Array) ? BigUint64Array : null;
subtagToFn[ST.kDataView] = DataView;

const defaultFn = Uint8Array;

const pickSubTag = (obj: ArrayBufferView): ST => nameToSubtag[obj?.constructor?.name];

/**
 * TypedArray
 */

export const hArrayBufferView: Handler<ArrayBufferView> = {
    tag: Tag.kArrayBufferView,

    read: (buf) => {
        const subtag = buf.getUint8(2);
        const fn = subtagToFn[subtag] || defaultFn;

        return buf.getU8Array((array, offset, length) => {
            const {buffer, byteOffset} = array;
            const bytes = fn.BYTES_PER_ELEMENT || 1;
            return new fn(buffer, byteOffset + offset, length / bytes);
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
