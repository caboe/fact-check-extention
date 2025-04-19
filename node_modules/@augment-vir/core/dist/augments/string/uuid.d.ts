/**
 * Any of the UUID versions.
 *
 * @category String
 * @category UUID
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type Uuid = `${string}-${string}-${string}-${string}-${string}`;
/**
 * Creates a cryptographically secure random v4 UUID using
 * [`crypto.randomUUID`](https://developer.mozilla.org/docs/Web/API/Crypto/randomUUID).
 *
 * @category String
 * @category UUID
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export declare function createUuidV4(): `${string}-${string}-${string}-${string}-${string}`;
