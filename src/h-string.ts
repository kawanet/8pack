/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {SerializationTag as Tag} from "./enum";

/**
 * Latin-1
 */

export const hOneByteString: eightpack.Handler<string> = {
    tag: Tag.kOneByteString,

    read: (buf) => {
        return buf.getU8Array(readString);
    },

    write: (buf, value) => {
        const {length} = value;
        buf = buf.prepare(8 + length);
        buf.setUint8(0, Tag.kOneByteString);
        if (!length) return buf.skip(8);
        buf.setU8Array(length, (array, offset) => writeString(array, offset, value));
    },
};

/**
 * UTF-16
 */

export const hTwoByteString: eightpack.Handler<string> = {
    tag: Tag.kTwoByteString,

    read: (buf) => {
        return buf.getU16Array(readString);
    },

    match: (value) => ("string" === typeof value),

    write: (buf, value) => {
        const {length} = value;
        buf = buf.prepare(8 + (length << 1));
        buf.setUint8(0, Tag.kTwoByteString);
        if (!length) return buf.skip(8);
        buf.setU16Array(length, (array, offset) => writeString(array, offset, value));
    },
};

/**
 * UTF-16 contains 3 characters in a 8 byte packet.
 */

export const readString = (buffer: Uint8Array | Uint16Array, offset: number, length: number): string => {
    if (!length) {
        return "";
    } else if (length === 1) {
        return String.fromCharCode(buffer[offset]);
    } else if (length === 2) {
        return String.fromCharCode(buffer[offset], buffer[offset + 1]);
    } else if (length === 3) {
        return String.fromCharCode(buffer[offset], buffer[offset + 1], buffer[offset + 2]);
    } else {
        let string = "";
        let size = 256;
        let work: number[];
        while (length > 0) {
            if (size > length) {
                size = length;
                work = new Array(size);
            } else if (!work) {
                work = new Array(size);
            }
            for (let i = 0; i < size; i++) work[i] = buffer[offset + i];
            string += String.fromCharCode.apply(String, work);
            offset += size;
            length -= size;
        }
        return string;
    }
}

export const writeString = (buffer: Uint8Array | Uint16Array, start: number, string: string): void => {
    let index = start;
    const length = string.length;
    let idx = 0;
    while (idx < length) {
        buffer[index++] = string.charCodeAt(idx++);
    }
};