/**
 * Either a Promise of `T` or just `T` itself.
 *
 * @category Promise
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type MaybePromise<T> = Promise<T> | T;
