#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    function fn() {
        //
    }

    it("fn", () => {
        assert.deepEqual(JSON.stringify(fn), undefined);
        assert.deepEqual(epack.encode(fn), undefined);
    });

    it("{fn: fn}", () => {
        assert.deepEqual(JSON.parse(JSON.stringify({fn: fn})), {});
        assert.deepEqual(epack.decode(epack.encode({fn: fn})), {});
    });

    it("[fn]", () => {
        assert.deepEqual(JSON.parse(JSON.stringify([fn])), [null]);
        assert.deepEqual(epack.decode(epack.encode([fn])), [null]);
    });
});