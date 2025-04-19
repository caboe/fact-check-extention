import { type MaybePromise } from '@augment-vir/core';
/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export declare function checkCustomDeepQuality(a: unknown, b: unknown, customChecker: (a: unknown, b: unknown) => boolean): boolean;
/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export declare function checkCustomDeepQuality(a: unknown, b: unknown, customChecker: (a: unknown, b: unknown) => Promise<boolean>): Promise<boolean>;
/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export declare function checkCustomDeepQuality(a: unknown, b: unknown, customChecker: (a: unknown, b: unknown) => MaybePromise<boolean>): MaybePromise<boolean>;
