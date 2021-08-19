/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {defaults} from "./enum";
import {ReadBuf} from "./b-readbuf";
import {WriteBuf} from "./b-writebuf";
import {getReadRouter, getWriteRouter} from "./router";

const ceil1K = (num: number) => (((num + 1023) >> 10) << 10);

class Epack implements eightpack.Ipack<Uint8Array> {
    bufSize = defaults.initialBufferSize;

    decode<T = any>(data: Uint8Array, options?: eightpack.DecodeOptions): T {
        const buf = new ReadBuf(data, options);
        const router = getReadRouter(options);

        const nest = (): any => {
            const tag = buf.getUint8(0);
            const handler = router(tag);
            if (handler) return handler.read(buf, nest);
        };

        return nest();
    }

    encode(value: any, options?: eightpack.EncodeOptions): Uint8Array {
        let buf = new WriteBuf(this.bufSize);

        const router = getWriteRouter(options);
        const start = buf;
        const stack: object[] = [];

        const nest = (value: any, key: string): boolean => {
            // pickup a valid handler for the value
            const handler = router(value);
            if (!handler) return false; // fail

            // request 16 byte buffer available at least
            buf = buf.prepare(16);

            const isObject = value && ("object" === typeof value);
            if (isObject) {
                // circular structure
                for (let v of stack) {
                    if (v === value) throw new TypeError("Converting circular structure to 8pack");
                }

                // toJSON
                if (!handler.ignoreToJSON && "function" === typeof value.toJSON) {
                    value = value.toJSON.call(value, String(key));
                    return nest(value, key);
                }

                stack.push(value);
            }

            // perform encoding
            handler.write(buf, value, nest);

            // release
            if (isObject) stack.pop();

            // success
            return true;
        };

        nest(value, "");
        const out = start.publish();
        if (out) this.bufSize = ceil1K(out.length);
        return out;
    }
}

export const epack = new Epack();
