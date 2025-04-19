import { type WaitUntilOptions } from '../guard-types/wait-until-function.js';
export declare const promiseGuards: {
    assert: {
        /**
         * Asserts that a value is a `PromiseLike`.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like a
         * promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assert} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(onFulfilled ? onFulfilled(this.value) : this.value);
         *     }
         * }
         *
         * assert.isPromiseLike(Promise.resolve(5)); // passes
         * assert.isPromiseLike(new CustomThenable(5)); // passes
         * assert.isPromiseLike(5); // fails
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assert.isNotPromiseLike} : the opposite assertion.
         * - {@link assert.isPromise} : the more precise assertion.
         */
        isPromiseLike(this: void, actual: unknown, failureMessage?: string | undefined): asserts actual is PromiseLike<any>;
        /**
         * Asserts that a value is _not_ a `PromiseLike`.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like a
         * promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assert} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(onFulfilled ? onFulfilled(this.value) : this.value);
         *     }
         * }
         *
         * assert.isNotPromiseLike(Promise.resolve(5)); // fails
         * assert.isNotPromiseLike(new CustomThenable(5)); // fails
         * assert.isNotPromiseLike(5); // passes
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assert.isPromiseLike} : the opposite assertion.
         * - {@link assert.isNotPromise} : the more precise assertion.
         */
        isNotPromiseLike<const Actual>(this: void, actual: Actual, failureMessage?: string | undefined): asserts actual is Exclude<Actual, PromiseLike<any>>;
        /**
         * Asserts that a value is a `Promise` instance.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assert} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(onFulfilled ? onFulfilled(this.value) : this.value);
         *     }
         * }
         *
         * assert.isPromise(Promise.resolve(5)); // passes
         * assert.isPromise(new CustomThenable(5)); // fails
         * assert.isPromise(5); // fails
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assert.isNotPromise} : the opposite assertion.
         * - {@link assert.isPromiseLike} : the more lenient assertion.
         */
        isPromise(this: void, actual: unknown, failureMessage?: string | undefined): asserts actual is Promise<any>;
        /**
         * Asserts that a value is a _not_ `Promise` instance.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assert} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(onFulfilled ? onFulfilled(this.value) : this.value);
         *     }
         * }
         *
         * assert.isNotPromise(Promise.resolve(5)); // fails
         * assert.isNotPromise(new CustomThenable(5)); // passes
         * assert.isNotPromise(5); // passes
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assert.isPromise} : the opposite assertion.
         * - {@link assert.isNotPromiseLike} : the more lenient assertion.
         */
        isNotPromise<const Actual>(this: void, actual: Actual, failureMessage?: string | undefined): asserts actual is Exclude<Actual, Promise<any>>;
    };
    check: {
        /**
         * Checks that a value is a `PromiseLike`.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * check.isPromiseLike(Promise.resolve(5)); // returns `true`
         * check.isPromiseLike(new CustomThenable(5)); // returns `true`
         * check.isPromiseLike(5); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotPromiseLike} : the opposite check.
         * - {@link check.isPromise} : the more precise check.
         */
        isPromiseLike<Actual>(this: void, actual: Actual): actual is Extract<Actual, PromiseLike<any>>;
        /**
         * Checks that a value is _not_ a `PromiseLike`.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * check.isNotPromiseLike(Promise.resolve(5)); // returns `false`
         * check.isNotPromiseLike(new CustomThenable(5)); // returns `false`
         * check.isNotPromiseLike(5); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isPromiseLike} : the opposite check.
         * - {@link check.isNotPromise} : the more precise check.
         */
        isNotPromiseLike<const Actual>(this: void, actual: Actual): actual is Exclude<Actual, PromiseLike<any>>;
        /**
         * Checks that a value is a `Promise` instance.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * check.isPromise(Promise.resolve(5)); // returns `true`
         * check.isPromise(new CustomThenable(5)); // returns `false`
         * check.isPromise(5); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotPromise} : the opposite check.
         * - {@link check.isPromiseLike} : the more lenient check.
         */
        isPromise<Actual>(this: void, actual: Actual): actual is Extract<Actual, Promise<any>>;
        /**
         * Checks that a value is a _not_ `Promise` instance.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * check.isNotPromise(Promise.resolve(5)); // returns `false`
         * check.isNotPromise(new CustomThenable(5)); // returns `true`
         * check.isNotPromise(5); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isPromise} : the opposite check.
         * - {@link check.isNotPromiseLike} : the more lenient check.
         */
        isNotPromise<Actual>(this: void, actual: Actual): actual is Exclude<Actual, Promise<any>>;
    };
    assertWrap: {
        /**
         * Asserts that a value is a `PromiseLike`. Returns the value if the assertion passes.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * assertWrap.isPromiseLike(Promise.resolve(5)); // returns the `Promise` instance
         * assertWrap.isPromiseLike(new CustomThenable(5)); // returns the `CustomThenable` instance
         * assertWrap.isPromiseLike(5); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotPromiseLike} : the opposite assertion.
         * - {@link assertWrap.isPromise} : the more precise assertion.
         */
        isPromiseLike<Actual>(this: void, actual: Actual, failureMessage?: string | undefined): Extract<Actual, PromiseLike<any>>;
        /**
         * Asserts that a value is _not_ a `PromiseLike`. Returns the value if the assertion passes.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * assertWrap.isNotPromiseLike(Promise.resolve(5)); // throws an error
         * assertWrap.isNotPromiseLike(new CustomThenable(5)); // throws an error
         * assertWrap.isNotPromiseLike(5); // returns `5`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isPromiseLike} : the opposite assertion.
         * - {@link assertWrap.isNotPromise} : the more precise assertion.
         */
        isNotPromiseLike<Actual>(this: void, actual: Actual, failureMessage?: string | undefined): Exclude<Actual, PromiseLike<any>>;
        /**
         * Asserts that a value is a `Promise` instance. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * assertWrap.isPromise(Promise.resolve(5)); // returns the `Promise` instance
         * assertWrap.isPromise(new CustomThenable(5)); // throws an error
         * assertWrap.isPromise(5); // throws an error
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotPromise} : the opposite assertion.
         * - {@link assertWrap.isPromiseLike} : the more lenient assertion.
         */
        isPromise<Actual>(this: void, actual: Actual, failureMessage?: string | undefined): Extract<Actual, Promise<any>>;
        /**
         * Asserts that a value is a _not_ `Promise` instance. Returns the value if the assertion
         * passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * assertWrap.isNotPromise(Promise.resolve(5)); // throws an error
         * assertWrap.isNotPromise(new CustomThenable(5)); // returns the `CustomThenable` promise
         * assertWrap.isNotPromise(5); // returns `5`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isPromise} : the opposite assertion.
         * - {@link assertWrap.isNotPromiseLike} : the more lenient assertion.
         */
        isNotPromise<Actual>(this: void, actual: Actual, failureMessage?: string | undefined): Exclude<Actual, Promise<any>>;
    };
    checkWrap: {
        /**
         * Checks that a value is a `PromiseLike`. Returns the value if the check passes, otherwise
         * `undefined`.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * checkWrap.isPromiseLike(Promise.resolve(5)); // returns `true`
         * checkWrap.isPromiseLike(new CustomThenable(5)); // returns `true`
         * checkWrap.isPromiseLike(5); // returns `false`
         * ```
         *
         * @see
         * - {@link checkWrap.isNotPromiseLike} : the opposite check.
         * - {@link checkWrap.isPromise} : the more precise check.
         */
        isPromiseLike<Actual>(this: void, actual: Actual): Extract<Actual, PromiseLike<any>> | undefined;
        /**
         * Checks that a value is _not_ a `PromiseLike`. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * checkWrap.isNotPromiseLike(Promise.resolve(5)); // returns `false`
         * checkWrap.isNotPromiseLike(new CustomThenable(5)); // returns `false`
         * checkWrap.isNotPromiseLike(5); // returns `true`
         * ```
         *
         * @see
         * - {@link checkWrap.isPromiseLike} : the opposite check.
         * - {@link checkWrap.isNotPromise} : the more precise check.
         */
        isNotPromiseLike<Actual>(this: void, actual: Actual): Exclude<Actual, PromiseLike<any>> | undefined;
        /**
         * Checks that a value is a `Promise` instance. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * checkWrap.isPromise(Promise.resolve(5)); // returns `true`
         * checkWrap.isPromise(new CustomThenable(5)); // returns `false`
         * checkWrap.isPromise(5); // returns `false`
         * ```
         *
         * @see
         * - {@link checkWrap.isNotPromise} : the opposite check.
         * - {@link checkWrap.isPromiseLike} : the more lenient check.
         */
        isPromise<Actual>(this: void, actual: Actual): Extract<Actual, Promise<any>> | undefined;
        /**
         * Checks that a value is a _not_ `Promise` instance. Returns the value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * checkWrap.isNotPromise(Promise.resolve(5)); // returns `false`
         * checkWrap.isNotPromise(new CustomThenable(5)); // returns `true`
         * checkWrap.isNotPromise(5); // returns `true`
         * ```
         *
         * @see
         * - {@link checkWrap.isPromise} : the opposite check.
         * - {@link checkWrap.isNotPromiseLike} : the more lenient check.
         */
        isNotPromise<Actual>(this: void, actual: Actual): Exclude<Actual, Promise<any>> | undefined;
    };
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a `PromiseLike`. Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * await waitUntil.isPromiseLike(() => Promise.resolve(5)); // returns the resolved `5`
         * await waitUntil.isPromiseLike(() => new CustomThenable(5)); // returns the resolved `5`
         * await waitUntil.isPromiseLike(() => 5); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNotPromiseLike} : the opposite assertion.
         * - {@link waitUntil.isPromise} : the more precise assertion.
         */
        isPromiseLike: <const Actual>(this: void, callback: () => Actual, options?: WaitUntilOptions | undefined, failureMessage?: string | undefined) => Promise<Extract<Actual, PromiseLike<any>>>;
        /**
         * Repeatedly calls a callback until its output is _not_ a `PromiseLike`. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * `PromiseLike` is TypeScript built-in type that has a `.then` method and thus behaves like
         * a promise. This is also referred to as a "thenable". This enables the use of third-party
         * promise implementations that aren't instances of the built-in `Promise` class.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * await waitUntil.isNotPromiseLike(() => Promise.resolve(5)); // throws an error
         * await waitUntil.isNotPromiseLike(() => new CustomThenable(5)); // throws an error
         * await waitUntil.isNotPromiseLike(() => 5); // returns `5`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isPromiseLike} : the opposite assertion.
         * - {@link waitUntil.isNotPromise} : the more precise assertion.
         */
        isNotPromiseLike: <const Actual>(this: void, callback: () => Actual, options?: WaitUntilOptions | undefined, failureMessage?: string | undefined) => Promise<Exclude<Actual, PromiseLike<any>>>;
        /**
         * Repeatedly calls a callback until its output is a `Promise` instance. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * await waitUntil.isPromise(() => Promise.resolve(5)); // returns the resolved `5`
         * await waitUntil.isPromise(() => new CustomThenable(5)); // throws an error
         * await waitUntil.isPromise(() => 5); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isNotPromise} : the opposite assertion.
         * - {@link waitUntil.isPromiseLike} : the more lenient assertion.
         */
        isPromise: <const Actual>(this: void, callback: () => Actual, options?: WaitUntilOptions | undefined, failureMessage?: string | undefined) => Promise<Extract<Actual, Promise<any>>>;
        /**
         * Repeatedly calls a callback until its output is a _not_ `Promise` instance. Once the
         * callback output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * class CustomThenable {
         *     constructor(public value: any) {}
         *
         *     then(onFulfilled?: AnyFunction, onRejected?: AnyFunction) {
         *         return new CustomThenable(
         *             onFulfilled ? onFulfilled(this.value) : this.value,
         *         );
         *     }
         * }
         *
         * await waitUntil.isNotPromise(() => Promise.resolve(5)); // throws an error
         * await waitUntil.isNotPromise(() => new CustomThenable(5)); // returns the resolved `5`
         * await waitUntil.isNotPromise(() => 5); // returns the resolved `5`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link waitUntil.isPromise} : the opposite assertion.
         * - {@link waitUntil.isNotPromiseLike} : the more lenient assertion.
         */
        isNotPromise: <const Actual>(this: void, callback: () => Actual, options?: WaitUntilOptions | undefined, failureMessage?: string | undefined) => Promise<Exclude<Actual, Promise<any>>>;
    };
};
