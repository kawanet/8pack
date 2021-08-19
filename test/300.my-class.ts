#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {eightpack, epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {

    class MyClass {
        val: number;

        constructor(val: number) {
            this.val = val;
        }

        toString() {
            return `[${this.val}]`;
        }
    }

    const MyTag = 255;

    const myHandler: eightpack.Handler<MyClass> = {
        tag: MyTag,

        read: (buf) => {
            const data = new MyClass(buf.getInt32(4));
            buf.skip(8);
            return data;
        },

        match: (value) => (value instanceof MyClass),

        write: (buf, value) => {
            buf.setUint8(0, MyTag);
            buf.setInt32(4, value.val);
            buf.skip(8);
        },
    };

    it("handler", () => {
        const data = {foo: new MyClass(123), bar: new MyClass(456)};

        assert.equal(data.foo.toString(), "[123]");
        assert.equal(data.bar.toString(), "[456]");

        const encoded = epack.encode(data, {handler: myHandler});
        const decoded = epack.decode<typeof data>(encoded, {handler: myHandler});

        assert.equal(decoded.foo.toString(), "[123]");
        assert.equal(decoded.bar.toString(), "[456]");

        assert.equal(decoded.foo instanceof MyClass, true);
        assert.equal(decoded.bar instanceof MyClass, true);
    });

    it("handlers", () => {
        const date = new Date("2021-08-21T00:00:00.000Z");
        const data = {foo: new MyClass(789), date: date};

        const encoded = epack.encode(data, {handlers: [myHandler, handlers.Date]});
        const decoded = epack.decode<typeof data>(encoded, {handlers: [myHandler, handlers.Date]});

        assert.equal(decoded.foo.toString(), "[789]");
        assert.deepEqual(decoded.date, date);

        assert.equal(decoded.foo instanceof MyClass, true);
        assert.equal(decoded.date instanceof Date, true);
    });
});