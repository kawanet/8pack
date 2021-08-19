#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    test("Z", 8, BigInt("0"));
    test("Z", 8, BigInt("1"));
    test("Z", 8, BigInt("-1"));
    test("Z", 8, BigInt("123456"));
    test("Z", 16, BigInt("1234567"));
    test("Z", 16, BigInt("12345678"));
    test("Z", 16, BigInt("123456789"));
    test("Z", 24, BigInt("1234567890123456"));

    function test(tag: string, size: number, value: any): void {
        it(value + "n", () => {
            const buf = epack.encode(value);
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf.length, size, "byteLength");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
        });
    }
});
