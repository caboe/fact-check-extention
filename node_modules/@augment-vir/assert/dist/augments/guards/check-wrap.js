import { guardOverrides } from '../../assertions/extendable-assertions.js';
const checkWrapMethods = Object.assign({}, ...guardOverrides.map((entry) => {
    return entry.checkWrap;
}));
/**
 * A group of guard methods that do the following:
 *
 * 1. Run the method's assertion on the given inputs.
 * 2. If the assertion fails, return `undefined`.
 * 3. If the assertion succeeds, the first input is returned and (when possible) type guarded.
 *
 * This can also be called as a standalone check function which checks that its input is truthy and
 * returns it if so, else `undefined`.
 *
 * @category Assert
 * @category Package : @augment-vir/assert
 * @example
 *
 * ```ts
 * import {checkWrap} from '@augment-vir/assert';
 *
 * // `result1` will be `['a']`
 * const result1 = checkWrap.deepEquals(['a'], ['a']);
 *
 * const value: unknown = 'some value' as unknown;
 * // `result2` will be `'some value'` and it will have the type of `string`
 * const result2 = checkWrap.isString(value);
 *
 * const value2: unknown = 'some value' as unknown;
 * // `result` will be `undefined`
 * const result3 = checkWrap.isNumber(value2);
 * ```
 *
 * @returns The original given value (type guarded when possible) or, if the expectation fails,
 *   `undefined`.
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export const checkWrap = Object.assign(function checkWrap(input) {
    if (!input) {
        return undefined;
    }
    return input;
}, checkWrapMethods);
