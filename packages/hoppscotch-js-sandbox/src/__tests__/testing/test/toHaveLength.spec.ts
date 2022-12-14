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

describe("toHaveLength", () => {
  // todo change valid to correct
  test("asserts true for valid lengths with no negation", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3, 4]).toHaveLength(4)
          hopp.expect([]).toHaveLength(0)
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
                lhs: [1, 2, 3, 4],
                line: 2,
                negation: false,
                rhs: 4,
                testType: "toHaveLength",
              },
              {
                failure: null,
                lhs: [],
                line: 3,
                negation: false,
                rhs: 0,
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for invalid lengths with no negation", () => {
    return expect(
      func(
        `
          hopp.expect([]).toHaveLength(4)
          hopp.expect([1, 2, 3, 4]).toHaveLength(0)
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
                lhs: [],
                line: 2,
                negation: false,
                rhs: 4,
                testType: "toHaveLength",
              },
              {
                failure: "COMPARISON",
                lhs: [1, 2, 3, 4],
                line: 3,
                negation: false,
                rhs: 0,
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for valid lengths with negation", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3, 4]).not.toHaveLength(4)
          hopp.expect([]).not.toHaveLength(0)
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
                lhs: [1, 2, 3, 4],
                line: 2,
                negation: true,
                rhs: 4,
                testType: "toHaveLength",
              },
              {
                failure: "COMPARISON",
                lhs: [],
                line: 3,
                negation: true,
                rhs: 0,
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts true for invalid lengths with negation", () => {
    return expect(
      func(
        `
          hopp.expect([]).not.toHaveLength(4)
          hopp.expect([1, 2, 3, 4]).not.toHaveLength(0)
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
                rhs: 4,
                testType: "toHaveLength",
              },
              {
                failure: null,
                lhs: [1, 2, 3, 4],
                line: 3,
                negation: true,
                rhs: 0,
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives error if not called on an array or a string with no negation", () => {
    return expect(
      func(
        `
          hopp.expect(5).toHaveLength(0)
          hopp.expect(true).toHaveLength(0)
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
                negation: false,
                rhs: 0,
                testType: "toHaveLength",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: true,
                line: 3,
                negation: false,
                rhs: 0,
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives error if not called on an array or a string with negation", () => {
    return expect(
      func(
        `
          hopp.expect(5).not.toHaveLength(0)
          hopp.expect(true).not.toHaveLength(0)
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
                testType: "toHaveLength",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: true,
                line: 3,
                negation: true,
                rhs: 0,
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives an error if toHaveLength parameter is not a number without negation", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3, 4]).toHaveLength("a")
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
                lhs: [1, 2, 3, 4],
                line: 2,
                negation: false,
                rhs: "a",
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives an error if toHaveLength parameter is not a number with negation", () => {
    return expect(
      func(
        `
          hopp.expect([1, 2, 3, 4]).not.toHaveLength("a")
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
                lhs: [1, 2, 3, 4],
                line: 2,
                negation: true,
                rhs: "a",
                testType: "toHaveLength",
              },
            ],
          },
        ],
      },
    })
  })
})
