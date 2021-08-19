#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    it("kPadding", () => {
        const data = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0x54, 0, 0, 0, 0, 0, 0, 0]);
        assert.equal(epack.decode(data), true);
    });
});