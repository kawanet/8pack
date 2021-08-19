/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {SerializationTag as Tag} from "./enum";
import * as P from "./h-primitive";
import * as S from "./h-string";

type Handler<T> = eightpack.Handler<T>;

const {hUndefined} = P;
const {hOneByteString} = S;

/**
 * Object
 */

export const hObject: Handler<object> = {
    tag: Tag.kBeginJSObject,

    read: (buf, nest) => {
        const length = buf.getInt32(4);
        buf.skip(8);
        const object: { [key: string]: any } = {};
        for (let i = 0; i < length; i++) {
            const key = nest();
            const val = nest();
            if (val !== undefined) object[key] = val;
        }
        return object;
    },

    write: (buf, value: { [key: string]: any }, nest) => {
        buf.setUint8(0, Tag.kBeginJSObject);
        const keys = Object.keys(value).filter(key => (value[key] !== undefined));
        const {length} = keys;
        buf.setInt32(4, length);
        buf.skip(8);
        for (let key of keys) {
            nest(key, key) || hOneByteString.write(buf, "", nest);
            nest(value[key], key) || hUndefined.write(buf, undefined, nest);
        }
    }
};
