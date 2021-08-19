/**
 * @see https://github.com/kawanet/8pack
 */

import type {eightpack} from "../types/8pack";
import {initReadRouter, initWriteRouter} from "./handler";

let defaultReadRouter = initReadRouter();
let defaultWriteRouter = initWriteRouter();

type ReadRouter = typeof defaultReadRouter;
type WriteRouter = typeof defaultWriteRouter;

export function getReadRouter(options: eightpack.DecodeOptions): ReadRouter {
    let router = defaultReadRouter;
    if (options) {
        router = addReadHandler(router, options.handler);
        if (options.handlers) {
            for (let h of options.handlers) {
                router = addReadHandler(router, h);
            }
        }
    }
    return router;
}

function addReadHandler(fn: ReadRouter, handler: eightpack.ReadHandler<any>): ReadRouter {
    let tag = handler?.tag;
    if (tag == null) return fn;
    tag &= 255;
    return (t) => (tag === t) ? handler : fn(t);
}

export function getWriteRouter(options: eightpack.EncodeOptions): WriteRouter {
    let router = defaultWriteRouter;

    if (options) {
        router = addWriteHandler(router, options.handler);
        if (options.handlers) {
            for (let h of options.handlers) {
                router = addWriteHandler(router, h);
            }
        }
    }

    return router;
}

function addWriteHandler(fn: WriteRouter, handler: eightpack.WriteHandler<any>): WriteRouter {
    if (!handler?.match) return fn;
    return (value) => handler.match(value) ? handler : fn(value);
}
