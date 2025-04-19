/* eslint-disable @typescript-eslint/no-unused-vars */
import { getObjectTypedKeys, } from '@augment-vir/core';
import { AssertionError } from '../augments/assertion.error.js';
import { createWaitUntil } from '../guard-types/wait-until-function.js';
function isLengthAtLeast(actual, length, failureMessage) {
    const actualLength = Array.isArray(actual) || typeof actual === 'string'
        ? actual.length
        : getObjectTypedKeys(actual).length;
    if (actualLength < length) {
        throw new AssertionError(`Length '${actual.length}' is not at least '${length}'.`, failureMessage);
    }
}
function isLengthExactly(actual, length, failureMessage) {
    const actualLength = Array.isArray(actual) || typeof actual === 'string'
        ? actual.length
        : getObjectTypedKeys(actual).length;
    if (actualLength !== length) {
        throw new AssertionError(`Length '${actual.length}' is not exactly '${length}'.`, failureMessage);
    }
}
function checkIsLengthAtLeast(actual, length) {
    return false;
}
function assertWrapIsLengthAtLeast(actual, length) {
    return false;
}
function checkWrapIsLengthAtLeast(actual, length) {
    return false;
}
function waitUntilIsLengthAtLeast(length, callback, options, failureMessage) {
    return false;
}
function checkIsLengthExactly(actual, length) {
    return false;
}
function assertWrapIsLengthExactly(actual, length) {
    return false;
}
function checkWrapIsLengthExactly(actual, length) {
    return false;
}
function waitUntilIsLengthExactly(length, callback, options, failureMessage) {
    return false;
}
/* node:coverage enable */
const assertions = {
    /**
     * Asserts that an array or string has at least the given length.
     *
     * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isLengthAtLeast(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     2,
     * ); // passes
     * assert.isLengthAtLeast(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     3,
     * ); // passes
     * assert.isLengthAtLeast(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     3,
     * ); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is less than the given length.
     * @see
     * - {@link assert.isLengthExactly} : the more exact assertion.
     */
    isLengthAtLeast,
    /**
     * Asserts that an array or string has exactly the given length.
     *
     * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isLengthExactly(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     2,
     * ); // fails
     * assert.isLengthExactly(
     *     [
     *         'a',
     *         'b',
     *         'c',
     *     ],
     *     3,
     * ); // passes
     * assert.isLengthExactly(
     *     [
     *         'a',
     *         'b',
     *     ],
     *     3,
     * ); // fails
     * ```
     *
     * @throws {@link AssertionError} If the value is not exactly the given length.
     * @see
     * - {@link assert.isLengthAtLeast} : the more flexible assertion.
     */
    isLengthExactly,
};
export const lengthGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that an array or string has at least the given length.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `true`
         * check.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `true`
         * check.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isLengthExactly} : the more exact check.
         */
        isLengthAtLeast: ((actual, length) => {
            const actualLength = Array.isArray(actual) || typeof actual === 'string'
                ? actual.length
                : getObjectTypedKeys(actual).length;
            return actualLength >= length;
        }),
        /**
         * Checks that an array or string has exactly the given length.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // fails
         * check.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // passes
         * check.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // fails
         * ```
         *
         * @see
         * - {@link check.isLengthAtLeast} : the more flexible check.
         */
        isLengthExactly: ((actual, length) => {
            const actualLength = Array.isArray(actual) || typeof actual === 'string'
                ? actual.length
                : getObjectTypedKeys(actual).length;
            return actualLength === length;
        }),
    },
    assertWrap: {
        /**
         * Asserts that an array or string has at least the given length. Returns the value if the
         * assertion passes.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `['a', 'b', 'c']`
         * assertWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * assertWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // throws an error
         * ```
         *
         * @returns The value if it has at least the given length.
         * @throws {@link AssertionError} If the value is less than the given length.
         * @see
         * - {@link assertWrap.isLengthExactly} : the more exact assertion.
         */
        isLengthAtLeast: ((actual, length, failureMessage) => {
            const actualLength = Array.isArray(actual) || typeof actual === 'string'
                ? actual.length
                : getObjectTypedKeys(actual).length;
            if (actualLength < length) {
                throw new AssertionError(`Length '${actual.length}' is not at least '${length}'.`, failureMessage);
            }
            return actual;
        }),
        /**
         * Asserts that an array or string has exactly the given length. Returns the value if the
         * assertion passes.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // throws an error
         * assertWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * assertWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // throws an error
         * ```
         *
         * @returns The value if it has exactly the given length.
         * @throws {@link AssertionError} If the value is not exactly the given length.
         * @see
         * - {@link assertWrap.isLengthAtLeast} : the more flexible assertion.
         */
        isLengthExactly: ((actual, length, failureMessage) => {
            const actualLength = Array.isArray(actual) || typeof actual === 'string'
                ? actual.length
                : getObjectTypedKeys(actual).length;
            if (actualLength !== length) {
                throw new AssertionError(`Length '${actual.length}' is not exactly '${length}'.`, failureMessage);
            }
            return actual;
        }),
    },
    checkWrap: {
        /**
         * Checks that an array or string has at least the given length. Returns the value if the
         * check passes, otherwise `undefined`.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `['a', 'b', 'c']`
         * checkWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * checkWrap.isLengthAtLeast(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isLengthExactly} : the more exact check.
         */
        isLengthAtLeast: ((actual, length) => {
            const actualLength = Array.isArray(actual) || typeof actual === 'string'
                ? actual.length
                : getObjectTypedKeys(actual).length;
            if (actualLength >= length) {
                return actual;
            }
            else {
                return undefined;
            }
        }),
        /**
         * Checks that an array or string has exactly the given length. Returns the value if the
         * check passes, otherwise `undefined`.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     2,
         * ); // returns `undefined`
         * checkWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *         'c',
         *     ],
         *     3,
         * ); // returns `['a', 'b', 'c']`
         * checkWrap.isLengthExactly(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     3,
         * ); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isLengthAtLeast} : the more flexible check.
         */
        isLengthExactly: ((actual, length) => {
            const actualLength = Array.isArray(actual) || typeof actual === 'string'
                ? actual.length
                : getObjectTypedKeys(actual).length;
            if (actualLength === length) {
                return actual;
            }
            else {
                return undefined;
            }
        }),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is an array or string that has at least the
         * given length. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards an array into an {@link AtLeastTuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isLengthAtLeast(2, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // returns `['a', 'b', 'c']`
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // returns `['a', 'b', 'c']`
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isLengthExactly} : the more exact assertion.
         */
        isLengthAtLeast: createWaitUntil(assertions.isLengthAtLeast),
        /**
         * Repeatedly calls a callback until its output is an array or string that has exactly the
         * given length. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards an array into a {@link Tuple}. Performs no type guarding on a string.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isLengthAtLeast(2, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // throws an error
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         *     'c',
         * ]); // returns `['a', 'b', 'c']`
         * await waitUntil.isLengthAtLeast(3, () => [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isLengthAtLeast} : the more flexible assertion.
         */
        isLengthExactly: createWaitUntil(assertions.isLengthExactly),
    },
};
