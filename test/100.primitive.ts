#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    test("0", 8, null);
    test("T", 8, true);
    test("F", 8, false);
    test("I", 8, 0);
    test("I", 8, 1);
    test("N", 16, 0.5);

    function test(tag: string, size: number, value: any): void {
        it(`[${tag}] ` + JSON.stringify(value), () => {
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
