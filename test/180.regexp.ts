#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("RegExp", () => {
        const re = /re/;

        // compatible behavior per default
        assert.deepEqual(JSON.parse(JSON.stringify(re)), {});
        assert.deepEqual(epack.decode(epack.encode(re)), {});
    });

    test("R", /reg/);
    test("R", /regex/i);

    function test(tag: string, value: any): void {
        it(`${value}`, () => {
            const buf = epack.encode(value, {handler: handlers.RegExp});
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
            assert.equal(rev instanceof RegExp, true);
        });
    }
});
