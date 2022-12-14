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

describe("toBeType", () => {
  test("asserts true for valid type expectations with no negation", () => {
    return expect(
      func(
        `
            hopp.expect(2).toBeType("number")
            hopp.expect("2").toBeType("string")
            hopp.expect(true).toBeType("boolean")
            hopp.expect({}).toBeType("object")
            hopp.expect(undefined).toBeType("undefined")
          `
      )
      // todo all types
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: 2,
                line: 2,
                negation: false,
                rhs: "number",
                testType: "toBeType",
              },
              {
                failure: null,
                lhs: "2",
                line: 3,
                negation: false,
                rhs: "string",
                testType: "toBeType",
              },
              {
                failure: null,
                lhs: true,
                line: 4,
                negation: false,
                rhs: "boolean",
                testType: "toBeType",
              },
              {
                failure: null,
                lhs: {},
                line: 5,
                negation: false,
                rhs: "object",
                testType: "toBeType",
              },
              {
                failure: null,
                // Since value is undefined, key is lost on serialization
                // lhs: undefined,
                line: 6,
                negation: false,
                rhs: "undefined",
                testType: "toBeType",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for invalid type expectations with no negation", () => {
    return expect(
      func(
        `
            pw.expect(2).toBeType("string")
            pw.expect("2").toBeType("number")
            pw.expect(true).toBeType("string")
            pw.expect({}).toBeType("number")
            pw.expect(undefined).toBeType("number")`
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: 2,
                line: 2,
                negation: false,
                rhs: "string",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: "2",
                line: 3,
                negation: false,
                rhs: "number",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: true,
                line: 4,
                negation: false,
                rhs: "string",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: {},
                line: 5,
                negation: false,
                rhs: "number",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                // Since value is undefined, key is lost on serialization
                // lhs: undefined,
                line: 6,
                negation: false,
                rhs: "number",
                testType: "toBeType",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts false for valid type expectations with negation", () => {
    return expect(
      func(
        `
            pw.expect(2).not.toBeType("number")
            pw.expect("2").not.toBeType("string")
            pw.expect(true).not.toBeType("boolean")
            pw.expect({}).not.toBeType("object")
            pw.expect(undefined).not.toBeType("undefined")`
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: 2,
                line: 2,
                negation: true,
                rhs: "number",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: "2",
                line: 3,
                negation: true,
                rhs: "string",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: true,
                line: 4,
                negation: true,
                rhs: "boolean",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                lhs: {},
                line: 5,
                negation: true,
                rhs: "object",
                testType: "toBeType",
              },
              {
                failure: "TYPE_MISMATCH",
                // Since value is undefined, key is lost on serialization
                // lhs: undefined,
                line: 6,
                negation: true,
                rhs: "undefined",
                testType: "toBeType",
              },
            ],
          },
        ],
      },
    })
  })

  test("asserts true for invalid type expectations with negation", () => {
    return expect(
      func(
        `
            pw.expect(2).not.toBeType("string")
            pw.expect("2").not.toBeType("number")
            pw.expect(true).not.toBeType("string")
            pw.expect({}).not.toBeType("number")
            pw.expect(undefined).not.toBeType("number")`
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: 2,
                line: 2,
                negation: true,
                rhs: "string",
                testType: "toBeType",
              },
              {
                failure: null,
                lhs: "2",
                line: 3,
                negation: true,
                rhs: "number",
                testType: "toBeType",
              },
              {
                failure: null,
                lhs: true,
                line: 4,
                negation: true,
                rhs: "string",
                testType: "toBeType",
              },
              {
                failure: null,
                lhs: {},
                line: 5,
                negation: true,
                rhs: "number",
                testType: "toBeType",
              },
              {
                failure: null,
                // Since value is undefined, key is lost on serialization
                // lhs: undefined,
                line: 6,
                negation: true,
                rhs: "number",
                testType: "toBeType",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives error for invalid type names without negation", () => {
    return expect(
      func(
        `
            pw.expect(2).toBeType("foo")
            pw.expect("2").toBeType("bar")
            pw.expect(true).toBeType("baz")
            pw.expect({}).toBeType("qux")
            pw.expect(undefined).toBeType("quux")
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
                lhs: 2,
                line: 2,
                negation: false,
                rhs: "foo",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: "2",
                line: 3,
                negation: false,
                rhs: "bar",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: true,
                line: 4,
                negation: false,
                rhs: "baz",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: {},
                line: 5,
                negation: false,
                rhs: "qux",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                // Since value is undefined, key is lost on serialization
                // lhs: undefined,
                line: 6,
                negation: false,
                rhs: "quux",
                testType: "toBeType",
              },
            ],
          },
        ],
      },
    })
  })

  test("gives error for invalid type names with negation", () => {
    return expect(
      func(
        `
            pw.expect(2).not.toBeType("foo")
            pw.expect("2").not.toBeType("bar")
            pw.expect(true).not.toBeType("baz")
            pw.expect({}).not.toBeType("qux")
            pw.expect(undefined).not.toBeType("quux")`
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: 2,
                line: 2,
                negation: true,
                rhs: "foo",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: "2",
                line: 3,
                negation: true,
                rhs: "bar",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: true,
                line: 4,
                negation: true,
                rhs: "baz",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                lhs: {},
                line: 5,
                negation: true,
                rhs: "qux",
                testType: "toBeType",
              },
              {
                failure: "UNSUPPORTED_TYPE",
                // Since value is undefined, key is lost on serialization
                // lhs: undefined,
                line: 6,
                negation: true,
                rhs: "quux",
                testType: "toBeType",
              },
            ],
          },
        ],
      },
    })
  })
})
