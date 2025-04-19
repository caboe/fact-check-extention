import { stringify } from '@augment-vir/core';
import { AssertionError } from '../augments/assertion.error.js';
import { createWaitUntil } from '../guard-types/wait-until-function.js';
const assertions = {
    /**
     * Asserts that a value is defined (not `null` and not `undefined`).
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isDefined(0); // passes
     * assert.isDefined(''); // passes
     * assert.isDefined(null); // fails
     * assert.isDefined(undefined); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNullish} : the opposite assertion.
     */
    isDefined(
    /** The value to check. */
    input, 
    /** Message to include in error message if this assertion fails. */
    failureMessage) {
        if (input == undefined) {
            throw new AssertionError(`'${stringify(input)}' is not defined.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is nullish (`null` or `undefined`).
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNullish(0); // fails
     * assert.isNullish(''); // fails
     * assert.isNullish(null); // passes
     * assert.isNullish(undefined); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isDefined} : the opposite assertion.
     */
    isNullish(
    /** The value to check. */
    input, 
    /** Message to include in error message if this assertion fails. */
    failureMessage) {
        if (input != undefined) {
            throw new AssertionError(`'${stringify(input)}' is not a nullish.`, failureMessage);
        }
    },
};
export const nullishGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is defined (not `null` and not `undefined`).
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isDefined(0); // returns `true`
         * check.isDefined(''); // returns `true`
         * check.isDefined(null); // returns `false`
         * check.isDefined(undefined); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNullish} : the opposite check.
         */
        isDefined(input) {
            return input != undefined;
        },
        /**
         * Checks that a value is nullish (`null` or `undefined`).
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNullish(0); // returns `false`
         * check.isNullish(''); // returns `false`
         * check.isNullish(null); // returns `true`
         * check.isNullish(undefined); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isDefined} : the opposite check.
         */
        isNullish(
        /** The value to check. */
        input) {
            return input == undefined;
        },
    },
    assertWrap: {
        /**
         * Asserts that a value is defined (not `null` and not `undefined`). Returns the value if
         * the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isDefined(0); // returns `0`
         * assertWrap.isDefined(''); // returns `''`
         * assertWrap.isDefined(null); // fails
         * assertWrap.isDefined(undefined); // fails
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNullish} : the opposite assertion.
         */
        isDefined(input, failureMessage) {
            if (input == undefined) {
                throw new AssertionError(`'${stringify(input)}' is not defined.`, failureMessage);
            }
            else {
                return input;
            }
        },
        /**
         * Asserts that a value is nullish (`null` or `undefined`). Returns the value if the
         * assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNullish(0); // fails
         * assertWrap.isNullish(''); // fails
         * assertWrap.isNullish(null); // returns `null`
         * assertWrap.isNullish(undefined); // returns `undefined`
         * ```
         *
         * @returns The value if the assertion passes.
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isDefined} : the opposite assertion.
         */
        isNullish(input, failureMessage) {
            if (input == undefined) {
                return input;
            }
            else {
                throw new AssertionError(`'${stringify(input)}' is not nullish.`, failureMessage);
            }
        },
    },
    /** Nullish checks don't make any sense on `checkWrap`. */
    checkWrap: {
        isDefined: undefined,
        isNullish: undefined,
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a value that is defined (not `null` and
         * not `undefined`). Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isDefined(() => 0); // returns `0`
         * await waitUntil.isDefined(() => ''); // returns `''`
         * await waitUntil.isDefined(() => null); // throws an error
         * await waitUntil.isDefined(() => undefined); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNullish} : the opposite assertion.
         */
        isDefined: createWaitUntil(assertions.isDefined),
        /**
         * Repeatedly calls a callback until its output is a value that is nullish (`null` or
         * `undefined`). Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isNullish(() => 0); // throws an error
         * await waitUntil.isNullish(() => ''); // throws an error
         * await waitUntil.isNullish(() => null); // returns `null`
         * await waitUntil.isNullish(() => undefined); // returns `undefined`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isDefined} : the opposite assertion.
         */
        isNullish: createWaitUntil(assertions.isNullish),
    },
};
