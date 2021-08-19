#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("Date", () => {
        const date = "2021-08-20T00:00:00.000Z";

        // compatible behavior per default
        assert.equal(JSON.parse(JSON.stringify(new Date(date))), date);
        assert.equal(epack.decode(epack.encode(new Date(date))), date);

        // decoding
        const raw = new Date(0);
        const data = new Uint8Array([0x44, 0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        const decoded = epack.decode(data);
        assert.equal(decoded instanceof Date, true);
        assert.deepEqual(decoded, raw);
    });

    test("D", 16, new Date("2021-08-20T00:00:00.000Z"));
    test("D", 16, new Date("1969-12-31T23:59:59.999Z"));
    test("D", 16, new Date("1970-01-01T00:00:00.000Z"));
    test("D", 16, new Date("1970-01-01T00:00:00.001Z"));

    function test(tag: string, size: number, value: any): void {
        it(JSON.stringify(value), () => {
            const buf = epack.encode(value, {handler: handlers.Date});
            assert.equal(ArrayBuffer.isView(buf), true, "ArrayBuffer.isView");
            assert.equal(buf.length, size, "byteLength");
            assert.equal(buf[0]?.toString(16), tag.charCodeAt(0).toString(16), "tag");

            const rev = epack.decode(buf);
            assert.equal(typeof rev, typeof value);
            assert.deepEqual(rev, value);
            assert.equal(rev instanceof Date, true);
        });
    }
});
