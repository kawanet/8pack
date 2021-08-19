#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    test("A", 8, []);
    test("A", 16, [null]);
    test("A", 16, [true]);
    test("A", 24, [true, false]);
    test("A", 16, [0]);
    test("A", 24, [0, 123]);
    test("A", 16, [""]);
    test("A", null, ["ABC", "DEF"]);

    it("[undefined]", () => {
        assert.deepEqual(epack.decode(epack.encode([undefined])), [null]);
    });

    function test(tag: string, size: number, value: any): void {
        it(JSON.stringify(value), () => {
            const buf = epack.encode(value);
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            if (size) assert.equal(buf.length, size, "byteLength");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
        });
    }
});
