/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {SerializationTag as Tag} from "./enum";

import * as A from "./h-array";
import * as M from "./h-misc";
import * as O from "./h-object";
import * as P from "./h-primitive";
import * as S from "./h-string";
import * as U from "./h-utf8";
import * as T from "./h-typedarray";

type ReadHandler<T> = eightpack.ReadHandler<T>;
type WriteHandler<T> = eightpack.WriteHandler<T>;
type Handler<T> = eightpack.Handler<T>;
type WriteRouter<T> = (value: T) => eightpack.WriteHandler<T>;

const {hArray} = A;
const {hDate, hNull, hRegExp} = M;
const {hObject} = O;
const {hBigInt, hDouble, hFalse, hInt32, hTrue, hUndefined} = P;
const {hOneByteString, hTwoByteString} = S;
const {hArrayBufferView} = T;
const {hUtf8String} = U;

const hPadding: Handler<unknown> = {
    tag: Tag.kPadding,

    read: (buf, nest) => {
        buf.skip(8);
        return nest();
    },

    write: (buf) => {
        // buf.setUint8(0, Tag.kPadding);
        buf.skip(8);
    },
}

const rBoolean: WriteRouter<boolean> = value => value ? hTrue : hFalse;

const hBooleanObject: WriteHandler<boolean | Boolean> = {
    write: (buf, value, nest) => {
        const bool = Boolean(+value);
        return rBoolean(bool).write(buf, bool, nest);
    },
};

const rNumber: WriteRouter<number> = value => ((value | 0) == value) ? hInt32 : isFinite(value) ? hDouble : hNull;

const hNumberObject: WriteHandler<number | Number> = {
    write: (buf, value, nest) => {
        const num = Number(value);
        return rNumber(num).write(buf, num, nest);
    },
};

/**
 * hUtf8String has better performance on short string.
 * hTwoByteString has better performance on long string.
 */

const rString: WriteRouter<string> = value => ((value.length <= 10) ? hUtf8String : hTwoByteString);

const hStringObject: WriteHandler<string | String> = {
    write: (buf, value, nest) => {
        const str = String(value);
        return rString(str).write(buf, str, nest)
    },
};

export const handlers: eightpack.Handlers = {
    Date: hDate,
    RegExp: hRegExp,
    UTF8: hUtf8String,
    UTF16: hTwoByteString,
    Undefined: hUndefined,
};

/**
 * default router for `decode()`.
 */

export function initReadRouter(): (tag: number) => ReadHandler<any> {
    const readers: Handler<any>[] = [];

    [
        hArray,
        hArrayBufferView,
        hBigInt,
        hDate,
        hDouble,
        hFalse,
        hInt32,
        hNull,
        hObject,
        hOneByteString,
        hPadding,
        hRegExp,
        hTrue,
        hTwoByteString,
        hUndefined,
        hUtf8String,
    ].forEach(h => readers[h.tag] = h);

    return tag => readers[tag];
}

/**
 * default router for `encode()`.
 * add missing handlers via `handler` option.
 */

export function initWriteRouter(): (value: any) => WriteHandler<any> {
    return value => {
        switch (typeof value) {
            case "number":
                return rNumber(value);
            case "string":
                return rString(value);
            case "boolean":
                return rBoolean(value);
            case "bigint":
                return hBigInt;
            case "object":
                break; // go below
            default:
                return; // unsupported
        }

        let handler: WriteHandler<any>;
        if (value === null) {
            handler = hNull;
        } else if (Array.isArray(value)) {
            handler = hArray;
        } else if (value instanceof Boolean) {
            handler = hBooleanObject;
        } else if (value instanceof Number) {
            handler = hNumberObject;
        } else if (value instanceof String) {
            handler = hStringObject;
        } else if (isArrayBufferView(value)) {
            handler = hArrayBufferView;
        } else {
            handler = hObject;
        }

        return handler;
    }
}

const isArrayBufferView = hArrayBufferView.match;
