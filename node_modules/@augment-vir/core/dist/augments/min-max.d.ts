/**
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type MinMax = {
    min: number;
    max: number;
};
/**
 * Given a min and max, ensures that they are in correct order. Meaning, min is less than max. If
 * that is not the case, values are swapped.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export declare function ensureMinMax({ min, max }: MinMax): MinMax;
