import { execTestScript } from "../../.."

function func(script: string) {
  return execTestScript(script, {
    envs: {
      global: [],
      selected: [],
    },
    artifact: {},
    shared: {},
    request: {
      headers: {},
      params: { a: "123", b: "foo" },
    },
    response: {
      headers: {},
      status: 200,
      body: "Some body",
    },
  })
}

describe("toInclude", () => {
  test("asserts true for collections with matching values", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3]).toInclude(1)
          hopp.expect("123").toInclude(1)
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: [1, 2, 3],
                line: 2,
                negation: false,
                rhs: 1,
                testType: "toInclude",
              },
              {
                failure: null,
                lhs: "123",
                line: 3,
                negation: false,
                rhs: 1,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for collections without matching values", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3]).toInclude(4)
          hopp.expect("123").toInclude(4)
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "COMPARISON",
                lhs: [1, 2, 3],
                line: 2,
                negation: false,
                rhs: 4,
                testType: "toInclude",
              },
              {
                failure: "COMPARISON",
                lhs: "123",
                line: 3,
                negation: false,
                rhs: 4,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for empty collections", () => {
    return expect(
      func(
        `
          hopp.expect([]).not.toInclude(0)
          hopp.expect("").not.toInclude(0)
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: [],
                line: 2,
                negation: true,
                rhs: 0,
                testType: "toInclude",
              },
              {
                failure: null,
                lhs: "",
                line: 3,
                negation: true,
                rhs: 0,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for [number array].includes(string)", () => {
    return expect(
      func(
        `
          hopp.expect([1]).not.toInclude("1")
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: [1],
                line: 2,
                negation: true,
                rhs: "1",
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts true for [string].includes(number)", () => {
    // This is a Node.js quirk.
    // (`"123".includes(123)` returns `True` in Node.js v14.19.1)
    // See https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.includes
    return expect(
      func(`hopp.expect("123").toInclude(123)`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: "123",
                line: 1,
                negation: false,
                rhs: 123,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives error if not called on an array or string", () => {
    return expect(
      func(
        `
          hopp.expect(5).not.toInclude(0)
          hopp.expect(true).not.toInclude(0)
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: 5,
                line: 2,
                negation: true,
                rhs: 0,
                testType: "toInclude",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: true,
                line: 3,
                negation: true,
                rhs: 0,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives an error if toInclude parameter is null", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3, 4]).not.toInclude(null)
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: [1, 2, 3, 4],
                line: 2,
                negation: true,
                rhs: null,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives an error if toInclude parameter is undefined", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3, 4]).not.toInclude(undefined)
        `
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: [1, 2, 3, 4],
                line: 2,
                negation: true,
                // rhs: undefined,
                testType: "toInclude",
              },
            ],
          },
        ],
      },
    })
  })
})
