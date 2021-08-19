#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    // empty
    test("c", 8, "");

    // U+0031
    test("c", 8, "123");
    test("c", 16, "1234");
    test("c", 16, "12345");
    test("c", 16, "123456");
    test("c", 16, "1234567");
    test("c", 24, "12345678");

    // U+03B1
    test("c", 8, "α");
    test("c", 8, "αβ");
    test("c", 8, "αβγ");
    test("c", 16, "αβγδ");

    // U+FF11
    test("c", 8, "１２３");
    test("c", 16, "１２３４");
    test("c", 16, "１２３４５");
    test("c", 16, "１２３４５６");
    test("c", 16, "１２３４５６７");
    test("c", 24, "１２３４５６７８");

    // U+1F600
    test("c", 8, "😀");
    test("c", 16, "😀😀");
    test("c", 16, "😀😀😀");
    test("c", 24, "😀😀😀😀");

    function test(tag: string, size: number, value: any): void {
        it(JSON.stringify(value), () => {
            const buf = epack.encode(value, {handler: handlers.UTF16});
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf.length, size, "byteLength");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
        });
    }
});
