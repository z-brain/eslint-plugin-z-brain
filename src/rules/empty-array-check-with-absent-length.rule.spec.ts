import { ESLintUtils } from '@typescript-eslint/experimental-utils';
import { getFixturesRootDirectory } from '../testing/fixture-setup';
import { emptyArrayCheckWithAbsentLengthRuleProvider, rule } from './empty-array-check-with-absent-length.rule';

const tsRootDirectory = getFixturesRootDirectory();
const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    tsconfigRootDir: tsRootDirectory,
    project: './tsconfig.json',
  },
});

describe('Fuck', () => {
  ruleTester.run(Object.keys(emptyArrayCheckWithAbsentLengthRuleProvider)[0], rule, {
    valid: [
      // check support of any possible arrays
      { code: `function foo(ids: Array<number>)             { if (ids.length) return; }` },
      { code: `function foo(ids: ReadonlyArray<number>)     { if (ids.length) return; }` },
      { code: `function foo(ids: number[][])                { if (ids.length) return; }` },
      { code: `function foo(ids: number[])                  { if (ids.length) return; }` },
      { code: `function foo(ids: [number, string])          { if (ids.length) return; }` },
      { code: `function foo(ids: readonly [number, string]) { if (ids.length) return; }` },

      // check deep typings resolving
      { code: `class Foo { ids: Array<number>;             bar() { if (this.ids.length) return; } }` },
      { code: `class Foo { ids: ReadonlyArray<number>;     bar() { if (this.ids.length) return; } }` },
      { code: `class Foo { ids: number[][];                bar() { if (this.ids.length) return; } }` },
      { code: `class Foo { ids: number[];                  bar() { if (this.ids.length) return; } }` },
      { code: `class Foo { ids: [number, string];          bar() { if (this.ids.length) return; } }` },
      { code: `class Foo { ids: readonly [number, string]; bar() { if (this.ids.length) return; } }` },

      // Shouldn't emit error in case the object really can be a falsy-value
      { code: `function foo(ids?: number[])                    { if (ids) return; }` },
      { code: `function foo(ids: number[] | null)              { if (ids) return; }` },
      { code: `function foo(ids: number[] | undefined)         { if (ids) return; }` },
      { code: `function foo(ids?: number[] | null | undefined) { if (ids) return; }` },
      { code: `function foo(ids: number[] | boolean)           { if (ids) return; }` },
      { code: `function foo(ids: number[] | number)            { if (ids) return; }` },
      { code: `function foo(ids: number[] | string)            { if (ids) return; }` },

      // Single and double negation is handled
      { code: `function foo(data?: { ids?: number[]; }) { if ( !data!.ids!.length!) return; }` },
      { code: `function foo(data?: { ids?: number[]; }) { if (!!data!.ids!.length!) return; }` },
      { code: `function foo(ids: number[])              { if ( !ids.length) return; }` },
      { code: `function foo(ids: number[])              { if (!!ids.length) return; }` },

      // Ternary-condition support
      { code: `function foo(ids: number[])  { const n =  ids.length ? 1 : 2; }` },
      { code: `function foo(ids?: number[]) { const n =  ids        ? 1 : 2; }` },
      { code: `function foo(ids: number[])  { const n = !ids.length ? 1 : 2; }` },

      // Functions/Methods support
      { code: `class Foo { getIds(): number[]             { return [] }; bar() { if (this.getIds().length) return; } }` },
      { code: `class Foo { getIds(): number[] | null      { return [] }; bar() { if (this.getIds()) return; } }` },
      { code: `class Foo { getIds(): number[] | undefined { return [] }; bar() { if (this.getIds()) return; } }` },
      { code: `class Foo { getId(): number                { return [] }; bar() { if (this.getId()) return; } }` },
    ],
    invalid: [
      // check support of any possible arrays
      { code: `function foo(ids: Array<number>)             { if (ids) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: ReadonlyArray<number>)     { if (ids) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: number[][])                { if (ids) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: number[])                  { if (ids) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: [number, string])          { if (ids) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: readonly [number, string]) { if (ids) return; }`, errors: [ { messageId: 'absentLength' } ] },

      // check deep typings resolving
      { code: `class Foo { ids: Array<number>;             bar() { if (this.ids) return; } }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `class Foo { ids: ReadonlyArray<number>;     bar() { if (this.ids) return; } }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `class Foo { ids: number[][];                bar() { if (this.ids) return; } }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `class Foo { ids: number[];                  bar() { if (this.ids) return; } }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `class Foo { ids: [number, string];          bar() { if (this.ids) return; } }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `class Foo { ids: readonly [number, string]; bar() { if (this.ids) return; } }`, errors: [ { messageId: 'absentLength' } ] },

      // Non-null assertion operator
      { code: `function foo(ids?: number[] | null | undefined) { if (ids!) return; }`, errors: [ { messageId: 'absentLength' } ] },
      //                                                               ^^^

      { code: `function foo(data?: { ids?: number[]; }) { if ( !data!.ids!) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(data?: { ids?: number[]; }) { if (!!data!.ids!) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: number[]) { if ( !ids) return; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: number[]) { if (!!ids) return; }`, errors: [ { messageId: 'absentLength' } ] },

      // Ternary-condition support
      { code: `function foo(ids: number[])  { const n =  ids  ? 1 : 2; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids?: number[]) { const n =  ids! ? 1 : 2; }`, errors: [ { messageId: 'absentLength' } ] },
      { code: `function foo(ids: number[])  { const n = !ids  ? 1 : 2; }`, errors: [ { messageId: 'absentLength' } ] },

      // Functions/Methods support
      { code: `class Foo { getIds(): number[]             { return [] }; bar() { if (this.getIds()) return; } }`, errors: [ { messageId: 'absentLength' } ]  },
      { code: `class Foo { getIds(): number[] | undefined { return [] }; bar() { if (this.getIds()!) return; } }`, errors: [ { messageId: 'absentLength' } ]  },
    ],
  });
});
