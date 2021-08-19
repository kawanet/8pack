/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {PayloadLayout as Layout, SerializationTag as Tag} from "./enum";

type Handler<T> = eightpack.Handler<T>;

/**
 * Date
 */

export const hDate: Handler<Date> = {
    tag: Tag.kDate,

    read: (buf) => {
        const value = buf.getFloat64(8);
        buf.skip(16);
        return new Date(value);
    },

    match: (value) => (value instanceof Date),

    write: (buf, value) => {
        buf.setUint8(0, Tag.kDate);
        buf.setUint8(1, Layout.offset8size8);
        buf.setFloat64(8, +value);
        buf.skip(16);
    },

    ignoreToJSON: true,
};

/**
 * null
 */

export const hNull: Handler<null> = {
    tag: Tag.kNull,

    read: (buf) => {
        buf.skip(8);
        return null;
    },

    match: (value) => (value === null),

    write: (buf) => {
        buf.setUint8(0, Tag.kNull);
        buf.skip(8);
    },
}

/**
 * RegExp
 */

export const hRegExp: Handler<RegExp> = {
    tag: Tag.kRegExp,

    read: (buf, nest) => {
        buf.skip(8);
        const source = nest();
        const flags = nest();
        return new RegExp(source, flags);
    },

    match: (value) => (value instanceof RegExp),

    write: (buf, value, nest) => {
        const {flags, source} = value;
        buf.setUint8(0, Tag.kRegExp);
        buf.skip(8);
        nest(source || "", "0");
        nest(flags || "", "1");
    },
}
