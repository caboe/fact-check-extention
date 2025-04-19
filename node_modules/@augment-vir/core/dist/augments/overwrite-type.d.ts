/**
 * Replace properties in T with properties in U.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
