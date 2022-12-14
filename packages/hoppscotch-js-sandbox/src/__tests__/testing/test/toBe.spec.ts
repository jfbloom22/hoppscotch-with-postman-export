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

describe("toBe", () => {
  describe("general assertion (no negation)", () => {
    test("expect equals expected passes assertion", () => {
      return expect(
        func(
          `
                  hopp.expect(2).toBe(2)
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
                  lhs: 2,
                  line: 2,
                  negation: false,
                  rhs: 2,
                  testType: "toBe",
                },
              ],
            },
          ],
        },
      })
    })

    test("expect not equals expected fails assertion", () => {
      return expect(
        func(
          `
                  hopp.expect(2).toBe(4)
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
                  lhs: 2,
                  line: 2,
                  negation: false,
                  rhs: 4,
                  testType: "toBe",
                },
              ],
            },
          ],
        },
      })
    })
  })

  describe("general assertion (with negation)", () => {
    test("expect equals expected fails assertion", () => {
      return expect(
        func(
          `
                hopp.expect(2).not.toBe(2)
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
                  lhs: 2,
                  line: 2,
                  negation: true,
                  rhs: 2,
                  testType: "toBe",
                },
              ],
            },
          ],
        },
      })
    })

    test("expect not equals expected passes assertion", () => {
      return expect(
        func(
          `
                hopp.expect(2).not.toBe(4)
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
                  lhs: 2,
                  line: 2,
                  negation: true,
                  rhs: 4,
                  testType: "toBe",
                },
              ],
            },
          ],
        },
      })
    })
  })
})

describe("strict checks types", () => {
  test("strict checks types (without negation)", () => {
    return expect(
      func(
        `
            hopp.expect(2).toBe("2")
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
                lhs: 2,
                line: 2,
                negation: false,
                rhs: "2",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })
  test("strict checks types (with negation)", () => {
    return expect(
      func(
        `
            hopp.expect(2).not.toBe("2")
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
                lhs: 2,
                line: 2,
                negation: true,
                rhs: "2",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })
})
