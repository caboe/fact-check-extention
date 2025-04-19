/**
 * Gets all keys of an object. This is similar to
 * [`Object.keys`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
 * except that it also grabs symbol keys and has better TypeScript typing.
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function getObjectTypedKeys(input) {
    let reflectKeys;
    try {
        reflectKeys = Reflect.ownKeys(input);
    }
    catch {
        // do nothing
    }
    return (reflectKeys ??
        [
            ...Object.keys(input),
            ...Object.getOwnPropertySymbols(input),
        ]);
}
