/**
 * A Function with no inputs and a return type of `Return` (which defaults to `any`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type NoInputsFunction<Return = any> = () => Return;
/**
 * A Function with any inputs and a return type of `Return` (which defaults to `any`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type AnyFunction<Return = any> = (...args: any[]) => Return;
