/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {BaseBuf} from "./b-basebuf";
import {PayloadLayout} from "./enum";

const ceil8 = (num: number) => (((num + 7) >> 3) << 3);
const ceil1K = (num: number) => (((num + 1023) >> 10) << 10);

export class WriteBuf extends BaseBuf implements eightpack.WriteBuf {
    next?: WriteBuf;

    prepare(size: number): WriteBuf {
        let buf: WriteBuf = this;

        // write() may request more longer buffer
        while (buf.next) buf = buf.next;

        const {length, cursor} = buf;
        if (size + cursor < length) return buf;
        size = ceil1K(Math.max(size, length << 1));
        return buf.next = new WriteBuf(new Uint8Array(size));
    }

    publish(): Uint8Array {
        let buf: WriteBuf = this;

        while (!buf.cursor) {
            buf = buf.next;
            if (!buf) return; // empty
        }

        // single fragment only
        if (!buf.next) {
            const {start, cursor} = buf;
            return new Uint8Array(buf.ab, start, cursor);
        }

        let total = 0;
        const a = [] as WriteBuf[];
        for (let f = buf; f; f = f.next) {
            total += f.cursor;
            a.push(f);
        }
        if (!total) return; // empty

        // multiple fragments
        const combined = new Uint8Array(total);
        let idx = 0;
        for (let f = buf; f; f = f.next) {
            const {cursor} = f;
            if (!cursor) continue;
            const item = f.u8().subarray(0, cursor);
            combined.set(item, idx);
            idx += ceil8(item.length);
        }

        return combined;
    }

    setUint8(offset: number, value: number): void {
        const buf = this;
        buf._u8[buf.cursor + offset] = value;
    }

    setInt32(offset: number, value: number): void {
        const buf = this;
        const c = value & 255;
        if (c === value) {
            buf._u8[buf.cursor + offset] = c;
            return;
        }
        const dv = buf._dv || buf.dv();
        dv.setInt32(buf.cursor + offset, value, true);
    }

    setFloat64(offset: number, value: number): void {
        const buf = this;
        const dv = buf._dv || buf.dv();
        dv.setFloat64(buf.cursor + offset, value, true);
    }

    setU8Array(size: number, fn: (array: Uint8Array, offset: number, length: number) => void): void {
        const buf = this;
        const offset = setSize(buf, size);
        fn(buf.u8(), buf.cursor + offset, size);
        buf.skip(offset + size);
    }

    setFlexU8Array(size: number, fn: (array: Uint8Array, offset: number, length: number) => number): void {
        let buf: WriteBuf = this;
        const external = (size > 14);
        let offset = external ? 8 : 2;
        size = fn(buf.u8(), buf.cursor + offset, size);
        offset = setSize(buf, size, external);
        buf.skip(offset + size);
    }

    setU16Array(size: number, fn: (array: Uint16Array, offset: number, length: number) => void): void {
        const buf = this;
        const byteLength = size << 1;
        const offset = setSize(buf, byteLength);
        fn(buf.u16(), (buf.cursor + offset) >> 1, size);
        buf.skip(offset + byteLength);
    }

    insertPayload(array: Uint8Array): void {
        let buf: WriteBuf = this;
        const {length} = array;
        setSize(buf, length, true);
        buf.skip(8);

        if (buf.cursor + length < buf.length) {
            // copy into
            buf.u8().set(array, buf.cursor);
            buf.skip(length);
        } else {
            // insert a chunk
            const chunk = buf.next = new WriteBuf(array);
            chunk.skip(length);
            chunk.next = new WriteBuf(buf.u8().subarray(buf.cursor));
        }
    }
}

/**
 * @private
 * @param buf - WriteBuf
 * @param offset - preferred offset which may changed
 * @param size - byte length
 */

const setSize = (buf: WriteBuf, size: number, external?: boolean): number => {
    let offset: number;
    let layout: number;

    if (external) {
        layout = PayloadLayout.external;
    } else {
        if (size <= 6) {
            layout = PayloadLayout.offset2 | size;
        } else if (size <= 14) {
            layout = PayloadLayout.offset2wide | size;
        } else {
            layout = PayloadLayout.external;
        }
    }

    if (layout === PayloadLayout.external) {
        offset = 8;
        if (size) buf.setInt32(4, size);
    } else {
        offset = 2;
    }

    if (layout) {
        buf.setUint8(1, layout);
    }

    return offset;
}
