#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {epack, handlers} from "../";

const TITLE = __filename.split("/").pop();

describe(TITLE, () => {
    const options = {handler: handlers.Undefined};

    it("undefined", () => {
        // root undefined is not encoded per default
        assert.deepEqual(JSON.stringify(undefined), undefined);
        assert.deepEqual(epack.encode(undefined), undefined);

        // with Undefined handler, it's encoded
        const encoded = epack.encode(undefined, options)
        assert.deepEqual(encoded?.length, 8);
        assert.deepEqual(encoded[0], 0x5f);
        assert.deepEqual(epack.decode(encoded), undefined);
    });

    it("[undefined]", () => {
        // array's undefined element is converted to null per default
        assert.deepEqual(JSON.stringify([undefined]), "[null]");
        assert.deepEqual(epack.decode(epack.encode([undefined])), [null]);

        // with Undefined handler, it's encoded
        assert.deepEqual(epack.decode(epack.encode([undefined], options)), [undefined]);
    });

    it("{foo: undefined}", () => {
        // object's undefined value is removed per default
        assert.deepEqual(JSON.stringify({foo: undefined}), "{}");
        assert.deepEqual(epack.decode(epack.encode({foo: undefined})), {});

        // it's removed even with Undefined handler for performance reasons
        assert.deepEqual(epack.decode(epack.encode({foo: undefined}, options)), {});
    });
});
