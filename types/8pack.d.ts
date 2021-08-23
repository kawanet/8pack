import {bpack} from "../src";

/**
 * @see https://github.com/kawanet/8pack
 */

export const {bpack, epack, handlers} = eightpack;

export declare module eightpack {
    const bpack: Ipack<Buffer>;

    const epack: Ipack<Uint8Array>;

    const handlers: Handlers;

    interface Ipack<D = Uint8Array> {
        decode: <V = any>(data: D, options?: DecodeOptions) => V;

        encode: (value: any, options?: EncodeOptions) => D;
    }

    interface DecodeOptions {
        offset?: number;
        handler?: ReadHandler<any>;
        handlers?: ReadHandler<any>[];
    }

    interface EncodeOptions {
        handler?: WriteHandler<any>;
        handlers?: WriteHandler<any>[];
    }

    interface Handlers {
        Date: Handler<Date>;
        RegExp: Handler<RegExp>;
        Undefined: Handler<undefined>;
        UTF8: Handler<string>;
        UTF16: Handler<string>;
    }

    /**
     * interfaces below are needed extension developers but not for library users.
     */

    type Handler<T> = ReadHandler<T> & WriteHandler<T>;

    interface ReadHandler<T> {
        tag?: number;

        read: (buf: ReadBuf, nest: () => any) => T;
    }

    interface WriteHandler<T> {
        match?: (value: any) => boolean;

        write: (buf: WriteBuf, value: T, nest: (value: any, key: number | string) => boolean) => void;

        ignoreToJSON?: boolean;
    }

    abstract class BaseBuf {
        skip(size: number): void;
    }

    class ReadBuf extends BaseBuf {
        getUint8(offset: number): number;

        getInt32(offset: number): number;

        getFloat64(offset: number): number;

        getU8Array<T>(fn: (array: Uint8Array, offset: number, length: number) => T): T;

        getU16Array<T>(fn: (array: Uint16Array, offset: number, length: number) => T): T;
    }

    class WriteBuf extends BaseBuf {
        prepare(size: number): WriteBuf;

        setUint8(offset: number, value: number): void;

        setInt32(offset: number, value: number): void;

        setFloat64(offset: number, value: number): void;

        setU8Array(size: number, fn: (array: Uint8Array, offset: number, length: number) => void): void;

        setU16Array(size: number, fn: (array: Uint16Array, offset: number, length: number) => void): void;

        setFlexU8Array(size: number, fn: (array: Uint8Array, offset: number, length: number) => number): void;

        insertPayload(array: Uint8Array): void;
    }
}
