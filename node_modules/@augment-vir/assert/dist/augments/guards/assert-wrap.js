import { guardOverrides } from '../../assertions/extendable-assertions.js';
import { AssertionError } from '../assertion.error.js';
const assertWrapMethods = Object.assign({}, ...guardOverrides.map((entry) => {
    return entry.assertWrap;
}));
/**
 * A group of guard methods that do the following:
 *
 * 1. Run the method's assertion on the given inputs.
 * 2. If the assertion fails, throws an error.
 * 3. If the assertion succeeds, the first input is returned and (when possible) type guarded.
 *
 * This can also be called as a standalone assertion function which asserts that its input is truthy
 * and returns it if so.
 *
 * @category Assert
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import {assertWrap} from '@augment-vir/assert';
 *
 * // `result1` will be `['a']`
 * const result1 = assertWrap.deepEquals(['a'], ['a']);
 *
 * const value: unknown = 'some value' as unknown;
 * // `result2` will be `'some value'` and it will have the type of `string`
 * const result2 = assertWrap.isString(value);
 *
 * const value2: unknown = 'some value' as unknown;
 * // this will throw an error
 * const result3 = assertWrap.isNumber(value2);
 * ```
 *
 * @returns The original value if expectations are met.
 * @throws {@link AssertionError} When the assertion fails.
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export const assertWrap = Object.assign(function assertWrap(input, failureMessage) {
    if (!input) {
        throw new AssertionError('Assertion failed.', failureMessage);
    }
    return input;
}, assertWrapMethods);
