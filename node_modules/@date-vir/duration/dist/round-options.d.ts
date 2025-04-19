/**
 * Common options for rounding.
 *
 * @category Internal
 */
export type RoundOptions = {
    /**
     * Set the numbers of decimal digits to round to.
     *
     * Set to `0` to round off all decimal digits.
     *
     * Omit or set to `undefined` to turn off all rounding.
     */
    roundToDigits?: number | undefined;
};
