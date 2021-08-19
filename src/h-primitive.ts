/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {PayloadLayout as Layout, SerializationTag as Tag} from "./enum";
import * as S from "./h-string";

type Handler<T> = eightpack.Handler<T>;

/**
 * undefined
 */

export const hUndefined: Handler<undefined> = {
    tag: Tag.kUndefined,

    read: (buf) => {
        buf.skip(8);
        return undefined;
    },

    match: (value) => (value === undefined),

    write: (buf) => {
        buf.setUint8(0, Tag.kUndefined);
        buf.skip(8);
    },
};

/**
 * true
 */

export const hTrue: Handler<boolean> = {
    tag: Tag.kTrue,

    read: (buf) => {
        buf.skip(8);
        return true;
    },

    match: (value) => (value === true),

    write: (buf) => {
        buf.setUint8(0, Tag.kTrue);
        buf.skip(8);
    },
};

/**
 * false
 */

export const hFalse: Handler<boolean> = {
    tag: Tag.kFalse,

    read: (buf) => {
        buf.skip(8);
        return false;
    },

    match: (value) => (value === false),

    write: (buf) => {
        buf.setUint8(0, Tag.kFalse);
        buf.skip(8);
    },
};

/**
 * signed integer
 */

export const hInt32: Handler<number> = {
    tag: Tag.kInt32,

    read: (buf) => {
        const value = buf.getInt32(4);
        buf.skip(8);
        return value;
    },

    write: (buf, value) => {
        buf.setUint8(0, Tag.kInt32);
        buf.setInt32(4, value);
        buf.skip(8);
    },
};

/**
 * float number
 */

export const hDouble: Handler<number> = {
    tag: Tag.kDouble,

    read: (buf) => {
        const value = buf.getFloat64(8);
        buf.skip(16);
        return value;
    },

    write: (buf, value) => {
        buf.setUint8(0, Tag.kDouble);
        buf.setUint8(1, Layout.offset8size8);
        buf.setFloat64(8, value);
        buf.skip(16);
    },
};

/**
 * big integer
 */

export const hBigInt: Handler<bigint> = {
    tag: Tag.kBigInt,

    read: buf => {
        return BigInt(buf.getU8Array(S.readString));
    },

    write: (buf, value) => {
        const string = value.toString();
        const {length} = string;
        buf = buf.prepare(8 + length);
        buf.setUint8(0, Tag.kBigInt);
        buf.setU8Array(length, (array, offset) => S.writeString(array, offset, string));
    },
};
