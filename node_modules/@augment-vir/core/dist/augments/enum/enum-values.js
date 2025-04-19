import { getObjectTypedKeys } from '../object/object-keys.js';
/** Don't export this because it's useless except for being used in {@link getEnumValues}. */
function getEnumKeys(input) {
    // enum keys are always strings
    return getObjectTypedKeys(input).filter((key) => isNaN(Number(key)));
}
/**
 * Gets all values within an enum as an array.
 *
 * @category Enum
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getEnumValues(input) {
    const keys = getEnumKeys(input);
    return keys.map((key) => input[key]);
}
