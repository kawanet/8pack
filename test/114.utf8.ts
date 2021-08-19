#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    // empty
    test("S", 8, "");

    // U+0031
    test("S", 8, "123");
    test("S", 8, "1234");
    test("S", 16, "12345");
    test("S", 16, "123456");
    test("S", 16, "1234567");
    test("S", 16, "12345678");
    test("S", 24, "123456789");

    // U+03B1
    test("S", 8, "α");
    test("S", 8, "αβ");
    test("S", 8, "αβγ");
    test("S", 16, "αβγδ");

    // U+FF11
    test("S", 8, "１２");
    test("S", 16, "１２３");
    test("S", 16, "１２３４");
    test("S", 24, "１２３４５");

    // U+1F600
    test("S", 8, "😀");
    test("S", 16, "😀😀");
    test("S", 24, "😀😀😀");

    function test(tag: string, size: number, value: any): void {
        it(JSON.stringify(value), () => {
            const buf = epack.encode(value, {handler: handlers.UTF8});
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf.length, size, "byteLength");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
        });
    }
});
