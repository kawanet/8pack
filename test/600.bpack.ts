#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {bpack} from "../";
import * as Buffer from "../src/node-buffer";

const TITLE = __filename.split("/").pop();

const DESCRIBE = Buffer?.from ? describe : describe.skip;

DESCRIBE(TITLE, () => {

    it("bpack", () => {
        const source = {foo: 1, bar: 1.5, buz: [true, false, null]};

        const encoded = bpack.encode(source);
        assert.equal(Buffer.isBuffer(encoded), true);

        const decoded = bpack.decode(encoded);
        assert.equal(Buffer.isBuffer(decoded), false);

        assert.deepEqual(decoded, source);
    });
});
