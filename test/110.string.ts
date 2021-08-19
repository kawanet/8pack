#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    test("");

    // U+0031
    test("1");
    test("12");
    test("123");
    test("1234");
    test("12345");
    test("123456");
    test("1234567");
    test("12345678");
    test("123456789");
    test("1234567890");
    test("12345678901");
    test("123456789012");
    test("1234567890123");
    test("12345678901234");
    test("123456789012345");
    test("1234567890123456"); // 16 or 32 byte payload

    // U+03B1
    test("α");
    test("αβ");
    test("αβγ");
    test("αβγδ"); // 8 byte payload

    // U+FF11
    test("１");
    test("１２");
    test("１２３");
    test("１２３４");
    test("１２３４５");
    test("１２３４５６");
    test("１２３４５６７");
    test("１２３４５６７８"); // 16 or 24 byte payload

    // U+1F600
    test("😀");
    test("😀😀");
    test("😀😀😀");
    test("😀😀😀😀"); // 16 byte payload

    function test(value: any): void {
        it(JSON.stringify(value), () => {
            const buf = epack.encode(value);
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
        });
    }
});
