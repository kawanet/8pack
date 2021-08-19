/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {BaseBuf} from "./b-basebuf";
import {PayloadLayout} from "./enum";

export class ReadBuf extends BaseBuf implements eightpack.ReadBuf {

    getUint8(offset: number): number {
        const buf = this;
        return buf._u8[buf.cursor + offset];
    }

    getInt32(offset: number): number {
        const buf = this;
        const dv = buf._dv || buf.dv();
        return dv.getInt32(buf.cursor + offset, true);
    }

    getFloat64(offset: number): number {
        const buf = this;
        const dv = buf._dv || buf.dv();
        return dv.getFloat64(buf.cursor + offset, true);
    }

    getU8Array<T>(fn: (array: Uint8Array, offset: number, length: number) => T): T {
        const buf = this;
        const layout = buf.getUint8(1);
        const offset = (layout & PayloadLayout.external) ? 8 : 2;
        const size = getSize(buf, layout);
        const result = fn(buf.u8(), buf.cursor + offset, size);
        buf.skip(offset + size);
        return result;
    }

    getU16Array<T>(fn: (array: Uint16Array, offset: number, length: number) => T): T {
        const buf = this;
        const layout = buf.getUint8(1);
        const offset = (layout & PayloadLayout.external) ? 8 : 2;
        const size = getSize(buf, layout);
        const result = fn(buf.u16(), (buf.cursor + offset) >> 1, size >> 1);
        buf.skip(offset + size);
        return result;
    }
}

/**
 * @private
 * @param layout - PayloadLayout
 */

const getSize = (buf: ReadBuf, layout: number): number => {
    let size: number;
    if (layout === PayloadLayout.external) {
        size = buf.getInt32(4);
    } else {
        size = layout & PayloadLayout.sizeMask;
    }
    return size;
}