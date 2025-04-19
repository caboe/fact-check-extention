/**
 * Creates a promise that can be resolved or rejected at any later time. It also includes indication
 * on whether its been settled yet or not.
 *
 * @category Promise
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {DeferredPromise} from '@augment-vir/common';
 *
 * function waitForInput() {
 *     const deferred = new DeferredPromise<string>();
 *
 *     window.addEventListener('keydown', (event) => {
 *         deferred.resolve(event.code);
 *     });
 *     return deferred.promise;
 * }
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export declare class DeferredPromise<T = void> {
    /** The deferred promise which can be awaited. */
    promise: Promise<T>;
    /** Call this to resolve the deferred promise with the given value. */
    resolve: (value: T | PromiseLike<T>) => void;
    /** Call this to reject the deferred promise with the given reason. */
    reject: (reason?: any) => void;
    /** Indicates whether the promise has been settled (resolved or rejected) yet. */
    readonly isSettled: boolean;
    constructor();
}
