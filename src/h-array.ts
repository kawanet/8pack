/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {SerializationTag as Tag} from "./enum";
import * as M from "./h-misc";

type Handler<T> = eightpack.Handler<T>;

const {hNull} = M;

/**
 * Array
 */

export const hArray: Handler<any[]> = {
    tag: Tag.kBeginDenseJSArray,

    read: (buf, nest) => {
        const length = buf.getInt32(4);
        buf.skip(8);
        const array = new Array(length);
        for (let i = 0; i < length; i++) {
            array[i] = nest();
        }
        return array;
    },

    write: (buf, value, nest) => {
        const {length} = value;
        buf.setUint8(0, Tag.kBeginDenseJSArray);
        buf.setInt32(4, length);
        buf.skip(8);
        for (let i = 0; i < length; i++) {
            nest(value[i], i) || hNull.write(buf, null, nest);
        }
    }
};
