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

describe("toHaveProperty", () => {
  test("asserts true for objects with present keys", () => {
    return expect(
      func(
        `
          hopp.expect({a:1}).toHaveProperty("a")
          hopp.expect({1:123}).toHaveProperty(1)
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
                lhs: { a: 1 },
                line: 2,
                negation: false,
                rhs: "a",
                testType: "toHaveProperty",
              },
              {
                failure: null,
                lhs: { 1: 123 },
                line: 3,
                negation: false,
                rhs: 1,
                testType: "toHaveProperty",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for collections without matching keys", () => {
    return expect(
      func(
        `
          hopp.expect({3:1}).toHaveProperty(1)
          hopp.expect({}).toHaveProperty(1)
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
                lhs: { 3: 1 },
                line: 2,
                negation: false,
                rhs: 1,
                testType: "toHaveProperty",
              },
              {
                failure: "COMPARISON",
                lhs: {},
                line: 3,
                negation: false,
                rhs: 1,
                testType: "toHaveProperty",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts true for negation with an absent property", () => {
    return expect(
      func(
        `
          hopp.expect({a:1}).not.toHaveProperty("absent")
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
                lhs: { a: 1 },
                line: 2,
                negation: true,
                rhs: "absent",
                testType: "toHaveProperty",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for negation with an present property", () => {
    return expect(
      func(
        `
          hopp.expect({present:1}).not.toHaveProperty("present")
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
                lhs: { present: 1 },
                line: 2,
                negation: true,
                rhs: "present",
                testType: "toHaveProperty",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives error if used on null or undefined", () => {
    return expect(
      func(
        `
          hopp.expect(null).toHaveProperty(1)
          hopp.expect(undefined).toHaveProperty(1)
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
                lhs: null,
                line: 2,
                negation: false,
                rhs: 1,
                testType: "toHaveProperty",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                // lhs: undefined,
                line: 3,
                negation: false,
                rhs: 1,
                testType: "toHaveProperty",
              },
            ],
          },
        ],
      },
    })
  })
})
