import { AssertionError } from '../augments/assertion.error.js';
import { createWaitUntil } from '../guard-types/wait-until-function.js';
const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const assertions = {
    /**
     * Asserts that a value is a valid UUID. Does not accept the nil or max UUIDs.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     * import {createUuidV4} from '@augment-vir/common';
     *
     * assert.isUuid(createUuidV4()); // passes
     * assert.isUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // passes
     * assert.isUuid('00000000-0000-0000-0000-000000000000'); // fails
     * assert.isUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // fails
     * assert.isUuid('not-a-uuid'); // fails
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isNotUuid} : the opposite assertion.
     */
    isUuid(actual, failureMessage) {
        if (!String(actual).match(uuidRegExp)) {
            throw new AssertionError(`'${String(actual)}' is not a UUID.`, failureMessage);
        }
    },
    /**
     * Asserts that a value is _not_ a valid UUID. The nil or max UUIDs are included as _not_ valid.
     *
     * Type guards the value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     * import {createUuidV4} from '@augment-vir/common';
     *
     * assert.isNotUuid(createUuidV4()); // fails
     * assert.isNotUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // fails
     * assert.isNotUuid('00000000-0000-0000-0000-000000000000'); // passes
     * assert.isNotUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // passes
     * assert.isNotUuid('not-a-uuid'); // passes
     * ```
     *
     * @throws {@link AssertionError} If the assertion fails.
     * @see
     * - {@link assert.isUuid} : the opposite assertion.
     */
    isNotUuid(actual, failureMessage) {
        if (String(actual).match(uuidRegExp)) {
            throw new AssertionError(`'${String(actual)}' is a UUID.`, failureMessage);
        }
    },
};
export const uuidGuards = {
    assert: assertions,
    check: {
        /**
         * Checks that a value is a valid UUID. Does not accept the nil or max UUIDs.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * check.isUuid(createUuidV4()); // returns `true`
         * check.isUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // returns `true`
         * check.isUuid('00000000-0000-0000-0000-000000000000'); // returns `false`
         * check.isUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // returns `false`
         * check.isUuid('not-a-uuid'); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotUuid} : the opposite check.
         */
        isUuid(actual) {
            return !!String(actual).match(uuidRegExp);
        },
        /**
         * Checks that a value is _not_ a valid UUID. The nil or max UUIDs are included as _not_
         * valid.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * check.isNotUuid(createUuidV4()); // returns `false`
         * check.isNotUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // returns `false`
         * check.isNotUuid('00000000-0000-0000-0000-000000000000'); // returns `true`
         * check.isNotUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // returns `true`
         * check.isNotUuid('not-a-uuid'); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isUuid} : the opposite check.
         */
        isNotUuid(actual) {
            return !String(actual).match(uuidRegExp);
        },
    },
    assertWrap: {
        /**
         * Asserts that a value is a valid UUID. Does not accept the nil or max UUIDs. Returns the
         * value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * assertWrap.isUuid(createUuidV4()); // returns the generated UUID
         * assertWrap.isUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // returns `'29e0f18e-6115-4982-8342-0afcadf5d611'`
         * assertWrap.isUuid('00000000-0000-0000-0000-000000000000'); // throws an error
         * assertWrap.isUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // throws an error
         * assertWrap.isUuid('not-a-uuid'); // throws an error
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isNotUuid} : the opposite assertion.
         */
        isUuid(actual, failureMessage) {
            if (!String(actual).match(uuidRegExp)) {
                throw new AssertionError(`'${String(actual)}' is not a UUID.`, failureMessage);
            }
            return actual;
        },
        /**
         * Asserts that a value is _not_ a valid UUID. The nil or max UUIDs are included as _not_
         * valid. Returns the value if the assertion passes.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * assertWrap.isNotUuid(createUuidV4()); // throws an error
         * assertWrap.isNotUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // throws an error
         * assertWrap.isNotUuid('00000000-0000-0000-0000-000000000000'); // returns `'00000000-0000-0000-0000-000000000000'`
         * assertWrap.isNotUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // returns `'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'`
         * assertWrap.isNotUuid('not-a-uuid'); // returns `'not-a-uuid'`
         * ```
         *
         * @throws {@link AssertionError} If the assertion fails.
         * @see
         * - {@link assertWrap.isUuid} : the opposite assertion.
         */
        isNotUuid(actual, failureMessage) {
            if (String(actual).match(uuidRegExp)) {
                throw new AssertionError(`'${String(actual)}' is a UUID.`, failureMessage);
            }
            return actual;
        },
    },
    checkWrap: {
        /**
         * Checks that a value is a valid UUID. Does not accept the nil or max UUIDs. Returns the
         * value if the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * checkWrap.isUuid(createUuidV4()); // returns the generated UUID
         * checkWrap.isUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // returns `'29e0f18e-6115-4982-8342-0afcadf5d611'`
         * checkWrap.isUuid('00000000-0000-0000-0000-000000000000'); // returns `undefined`
         * checkWrap.isUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // returns `undefined`
         * checkWrap.isUuid('not-a-uuid'); // returns `undefined`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNotUuid} : the opposite check.
         */
        isUuid(actual) {
            if (String(actual).match(uuidRegExp)) {
                return actual;
            }
            else {
                return undefined;
            }
        },
        /**
         * Checks that a value is _not_ a valid UUID. The nil or max UUIDs are included as _not_
         * valid. Returns the value if the check passes, otherwise `undefined`.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * checkWrap.isNotUuid(createUuidV4()); // returns `undefined`
         * checkWrap.isNotUuid('29e0f18e-6115-4982-8342-0afcadf5d611'); // returns `undefined`
         * checkWrap.isNotUuid('00000000-0000-0000-0000-000000000000'); // returns `'00000000-0000-0000-0000-000000000000'`
         * checkWrap.isNotUuid('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // returns `'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'`
         * checkWrap.isNotUuid('not-a-uuid'); // returns `'not-a-uuid'`
         * ```
         *
         * @returns The value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isUuid} : the opposite check.
         */
        isNotUuid(actual) {
            if (String(actual).match(uuidRegExp)) {
                return undefined;
            }
            else {
                return actual;
            }
        },
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a valid UUID. Does not accept the nil or
         * max UUIDs. Returns the value if the assertion passes. Once the callback output passes, it
         * is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * await waitUntil.isUuid(() => createUuidV4()); // returns the generated value
         * await waitUntil.isUuid(() => '29e0f18e-6115-4982-8342-0afcadf5d611'); // returns `'29e0f18e-6115-4982-8342-0afcadf5d611'`
         * await waitUntil.isUuid(() => '00000000-0000-0000-0000-000000000000'); // throws an error
         * await waitUntil.isUuid(() => 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // throws an error
         * await waitUntil.isUuid(() => 'not-a-uuid'); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNotUuid} : the opposite assertion.
         */
        isUuid: createWaitUntil(assertions.isUuid),
        /**
         * Repeatedly calls a callback until its output is _not_ a valid UUID. The nil or max UUIDs
         * are included as _not_ valid. Returns the value if the assertion passes. Once the callback
         * output passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         * import {createUuidV4} from '@augment-vir/common';
         *
         * await waitUntil.isNotUuid(() => createUuidV4()); // throws an error
         * await waitUntil.isNotUuid(() => '29e0f18e-6115-4982-8342-0afcadf5d611'); // throws an error
         * await waitUntil.isNotUuid(() => '00000000-0000-0000-0000-000000000000'); // returns `'00000000-0000-0000-0000-000000000000'`
         * await waitUntil.isNotUuid(() => 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'); // returns `'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF'`
         * await waitUntil.isNotUuid(() => 'not-a-uuid'); // returns `'not-a-uuid'`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isUuid} : the opposite assertion.
         */
        isNotUuid: createWaitUntil(assertions.isNotUuid),
    },
};
