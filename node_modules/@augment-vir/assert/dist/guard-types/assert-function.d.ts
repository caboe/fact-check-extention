/** C8 fails in type-only files. */
export type AssertFunction<Output> = (input: any, ...extraInputs: any[]) => asserts input is Output;
