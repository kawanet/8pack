#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";
import * as Buffer from "../src/node-buffer";

const TITLE = __filename.split("/").pop();

const DESCRIBE = Buffer?.from ? describe : describe.skip;

DESCRIBE(TITLE, () => {

    it("Buffer", () => {
        const source = Buffer.from([65, 66, 67, 68]);
        const decoded = epack.decode(epack.encode(source));
        assert.equal(Buffer.isBuffer(decoded), true);
        assert.equal(decoded instanceof Uint8Array, true);
        assert.equal(`${decoded}`, `${source}`);
    });

    it("Uint8Array", () => {
        const source = new Uint8Array([65, 66, 67, 68]);
        const decoded = epack.decode(epack.encode(source));
        assert.equal(Buffer.isBuffer(decoded), false);
        assert.equal(decoded instanceof Uint8Array, true);
        assert.equal(`${decoded}`, `${source}`);
    });
});
