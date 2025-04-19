import { type ExpectTypeOf } from 'expect-type';
type AssertTypeOf<TestingType> = {
    equals: ExpectTypeOf<TestingType, {
        positive: true;
    }>['toEqualTypeOf'];
    notEquals: ExpectTypeOf<TestingType, {
        positive: false;
    }>['toEqualTypeOf'];
    slowEquals: ExpectTypeOf<TestingType, {
        positive: true;
    }>['branded']['toEqualTypeOf'];
    matches: ExpectTypeOf<TestingType, {
        positive: true;
    }>['toExtend'];
    notMatches: ExpectTypeOf<TestingType, {
        positive: false;
    }>['toExtend'];
};
declare function tsType<Actual>(
/** Run-time value to type check. */
input: Actual): AssertTypeOf<Actual>;
/** Uses the expect-type package to assert type matching. */
declare function tsType<Actual>(): AssertTypeOf<Actual>;
export declare const tsTypeGuards: {
    assert: {
        /**
         * Asserts within the TypeScript type system that a given type or value matches type
         * expectations (using the [`expect-type`](https://www.npmjs.com/package/expect-type) package.
         * Make sure to call a method on the first call to actually assert anything.
         *
         * Use this to write type tests. Don't use this in production code. It won't cause issues, but
         * it's a useless no-op at run-time (it's not even a type guard).
         *
         * Performs no type guarding.
         *
         * @example
         *
         * ```ts
         * import {assert} from '@augment-vir/assert';
         *
         * assert.tsType('hello').equals<string>();
         * assert.tsType<'hello>().equals<'hello'>();
         * assert.tsType<'hello>().notEquals<string>();
         * assert.tsType('hello').notEquals<number>();
         * ```
         *
         * @returns Never returns anything.
         * @throws Never throws anything.
         */
        tsType: typeof tsType;
    };
    assertWrap: {
        tsType: undefined;
    };
    check: {
        tsType: undefined;
    };
    checkWrap: {
        tsType: undefined;
    };
    waitUntil: {
        tsType: undefined;
    };
};
export {};
