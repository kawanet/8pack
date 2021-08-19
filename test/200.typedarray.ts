#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

type Filter = (num: number) => any;

interface Fn {
    new(length: number): ArrayBufferView;
}

describe(TITLE, () => {
    test("Int8Array", Int8Array);
    test("Uint8Array", Uint8Array);
    test("Uint8ClampedArray", Uint8ClampedArray);
    test("Int16Array", Int16Array);
    test("Uint16Array", Uint16Array);
    test("Int32Array", Int32Array);
    test("Uint32Array", Uint32Array);
    test("Float32Array", Float32Array);
    test("Float64Array", Float64Array);

    const toBigInt = ("undefined" !== typeof BigInt) ? BigInt : null;
    test("BigInt64Array", ("undefined" !== typeof BigInt64Array) ? BigInt64Array : null, toBigInt);
    test("BigUint64Array", ("undefined" !== typeof BigUint64Array) ? BigUint64Array : null, toBigInt);

    it("TypedArray[]", () => {
        const data = [
            new Int8Array([1]),
            new Uint8Array([2]),
            new Uint8ClampedArray([3]),
            new Int16Array([4]),
            new Uint16Array([5]),
            new Int32Array([6]),
            new Uint32Array([7]),
            new Float32Array([8]),
            new Float64Array([9]),
        ];

        const encoded = epack.encode(data);
        const decoded = epack.decode(encoded);

        assert.equal(decoded.length, data.length);
        assert.deepEqual(decoded, data);
    });

    it("DataView", () => {
        [0, 10, 100, 1000].forEach(size => {
            const u8 = new Uint8Array(size);
            for (let i = 0; i < size; i++) u8[i] = i;
            const data = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);

            const decoded = epack.decode(epack.encode(data));
            assert.equal(decoded?.constructor?.name, data.constructor.name);
            assert.deepEqual(decoded, data);
        });
    })

    // test("DataView", DataView);

    function test(title: string, fn: Fn, filter?: Filter) {
        const IT = fn ? it : it.skip;
        if (!filter) filter = (v => v);

        IT(title, () => {
            [0, 10, 100, 1000].forEach(size => {
                const data = new fn(size) as any as number[];
                for (let i = 0; i < size; i++) data[i] = filter(i);

                const decoded = epack.decode(epack.encode(data));
                assert.equal(decoded?.constructor?.name, data.constructor.name);
                assert.deepEqual(decoded, data);
            });
        })
    }
});