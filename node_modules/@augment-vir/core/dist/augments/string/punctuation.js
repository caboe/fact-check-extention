/**
 * All characters that are considered punctuation.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const punctuationLetters = [
    '.',
    ':',
    ';',
    ',',
    '?',
    '!',
];
/**
 * A RegExp matching all letters that are considered punctuation.
 *
 * @category String
 * @category RegExp
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const punctuationRegExp = new RegExp(`[${punctuationLetters.join('')}]+`);
/**
 * A RegExp matching that matches any punctuation at the end of a string.
 *
 * @category String
 * @category RegExp
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const endsWithPunctuationRegExp = new RegExp(`[${punctuationLetters.join('')}]+$`);
/**
 * Removes any punctuation at the end of the given string.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function removeEndingPunctuation(value) {
    return value.replace(endsWithPunctuationRegExp, '');
}
