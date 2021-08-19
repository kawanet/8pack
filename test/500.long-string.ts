#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {eightpack, epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    let onebyte = "123456789."; // 10 bytes
    onebyte = onebyte + onebyte + onebyte + onebyte + onebyte + onebyte + onebyte + onebyte + onebyte + onebyte; // 100 bytes

    let twobyte = "１２３４５６７８９．"; // 20 bytes
    twobyte = twobyte + twobyte + twobyte + twobyte + twobyte; // 100 bytes

    // auto
    test(null, onebyte, 1, 100);
    test(null, onebyte, 1, 1000);
    test(null, onebyte, 1, 10000);
    test(null, onebyte, 1, 100000);
    test(null, onebyte, 1, 1000000);

    test(null, twobyte, 1, 100);
    test(null, twobyte, 1, 1000);
    test(null, twobyte, 1, 10000);
    test(null, twobyte, 1, 100000);
    test(null, twobyte, 1, 1000000);

    // UTF16 kTwoByteString

    test(`c`, twobyte, 2, 100, {handler: handlers.UTF16});
    test(`c`, twobyte, 2, 1000, {handler: handlers.UTF16});
    test(`c`, twobyte, 2, 10000, {handler: handlers.UTF16});
    test(`c`, twobyte, 2, 100000, {handler: handlers.UTF16});
    test(`c`, twobyte, 2, 1000000, {handler: handlers.UTF16});

    // UTF8 kUtf8String

    test(`S`, twobyte, 3, 100, {handler: handlers.UTF8});
    test(`S`, twobyte, 3, 1000, {handler: handlers.UTF8});
    test(`S`, twobyte, 3, 10000, {handler: handlers.UTF8});
    test(`S`, twobyte, 3, 100000, {handler: handlers.UTF8});
    test(`S`, twobyte, 3, 1000000, {handler: handlers.UTF8});

    function test(tag: string, src: string, byte: number, repeat: number, options?: eightpack.EncodeOptions): void {
        let value = "";
        while (value.length < repeat) value += src;
        const size = value.length * byte;

        it(`${byte} x ${repeat} bytes`, () => {
            const buf = epack.encode(value, options);
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf.length > size, true, "byteLength");
            if (tag) assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.equal(rev, value);
        });
    }
});
