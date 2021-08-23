/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {Epack} from "./epack";

/**
 * Node.js Buffer version of Epack
 */

class Bpack extends Epack implements eightpack.Ipack<Buffer> {

    encode(value: any, options?: eightpack.EncodeOptions): Buffer {
        const u8 = super.encode(value, options);
        return Buffer.from(u8, u8.byteOffset, u8.byteLength);
    }
}

/**
 * Node.js Buffer version of epack
 */

export const bpack = new Bpack();
