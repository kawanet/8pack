#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    test("o", {});
    test("o", {null: null});
    test("o", {bool: false});
    test("o", {number: 123});
    test("o", {string: "ABC"});
    test("o", {"": ""});
    test("o", {bool: true, number: 123, string: "ABC"});

    it(`{"undef": undefined,"null": null}`, () => {
        assert.deepEqual(epack.decode(epack.encode({"undef": undefined, "null": null})), {null: null});
    });

    function test(tag: string, value: any): void {
        it(JSON.stringify(value), () => {
            const buf = epack.encode(value);
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
        });
    }
});
