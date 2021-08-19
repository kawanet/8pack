/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";

const ceil8 = (num: number) => (((num + 7) >> 3) << 3);

interface Options {
    offset?: number;
}

export abstract class BaseBuf implements eightpack.BaseBuf {
    protected ab: ArrayBuffer;
    protected start: number;
    protected length: number;
    protected cursor: number;

    // TypedArray
    protected _u8: Uint8Array;
    protected _u16: Uint16Array;
    protected _dv: DataView;

    constructor(buf: Uint8Array | number, options?: Options) {
        const u8 = (buf instanceof Uint8Array) ? buf : new Uint8Array(+buf);
        let offset = options && +options.offset || 0;
        this.ab = u8.buffer;
        this.start = u8.byteOffset + offset;
        this.length = u8.length - offset;
        this.cursor = 0;
        this._u8 = offset ? this.u8() : u8;
    }

    protected u8(): Uint8Array {
        const {ab, start, length} = this;
        return this._u8 || (this._u8 = new Uint8Array(ab, start, length));
    }

    protected u16(): Uint16Array {
        const {ab, start, length} = this;
        return this._u16 || (this._u16 = new Uint16Array(ab, start, length >> 1));
    }

    protected dv(): DataView {
        const {ab, start, length} = this;
        return this._dv || (this._dv = new DataView(ab, start, length));
    }

    skip(size: number): void {
        this.cursor += ceil8(size);
    }
}
