import { guardOverrides } from '../../assertions/extendable-assertions.js';
import { executeWaitUntil } from '../../guard-types/wait-until-function.js';
import { AssertionError } from '../assertion.error.js';
const waitUntilMethods = Object.assign({}, ...guardOverrides.map((entry) => {
    return entry.waitUntil;
}));
/**
 * A group of guard methods that run the given callback multiple times until its return value
 * matches expectations. Callback interval and timeout can be customized with
 * {@link WaitUntilOptions}.
 *
 * This can also be called as a standalone wait until function which waits until the callback's
 * returned value is truthy.
 *
 * @category Assert
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import {waitUntil} from '@augment-vir/assert';
 *
 * // `result` will eventually be `'123'`
 * const result = await waitUntil.isString(
 *     () => {
 *         if (Math.random() < 0.5) {
 *             return 123;
 *         } else {
 *             return '123';
 *         }
 *     },
 *     {
 *         interval: {milliseconds: 100},
 *         timeout: {seconds: 10},
 *     },
 * );
 * ```
 *
 * @returns The successful callback return value.
 * @throws {@link AssertionError} When the assertion fails.
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export const waitUntil = Object.assign(function waitUntil(input, failureMessage) {
    return executeWaitUntil((input, failureMessage) => {
        if (!input) {
            throw new AssertionError('Assertion failed.', failureMessage);
        }
    }, [
        input,
        failureMessage,
    ], false);
}, waitUntilMethods);
