/**
 * Narrows the given `Actual` type to the given `Expected` type as much as possible, or falls back
 * to just `Expected` itself.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see
 *  - {@link NarrowToActual}: narrowing in the other direction.
 */
export type NarrowToExpected<Actual, Expected> = Extract<Expected, Actual> extends never ? Extract<Actual, Expected> extends never ? Expected extends Actual ? Expected : never : Extract<Actual, Expected> : Extract<Expected, Actual>;
/**
 * Narrows the given `Expected` type to the given `Actual` type as much as possible, or falls back
 * to just `Expected` itself.
 *
 * @category Type
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 * @see
 *  - {@link NarrowToExpected}: narrowing in the other direction.
 */
export type NarrowToActual<Actual, Expected> = Extract<Actual, Expected> extends never ? Extract<Expected, Actual> extends never ? Expected extends Actual ? Expected : never : Extract<Expected, Actual> : Extract<Actual, Expected>;
