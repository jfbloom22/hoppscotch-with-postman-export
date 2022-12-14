import { execTestScript, TestScriptContext } from "../../../.."

function func(script: string, envs: TestScriptContext["envs"]) {
  return execTestScript(script, {
    envs,
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

describe("env.resolve", () => {
  test("value should be a string", () => {
    return expect(
      func(
        `
          hopp.env.active.resolve(5)
        `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      error: { message: "key is not string" },
    })
  })

  test("resolves global variables correctly", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.global.resolve("<<hello>>")).toBe("there")
        `,
        {
          global: [
            {
              key: "hello",
              value: "there",
            },
          ],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: "there",
                line: 2,
                negation: false,
                rhs: "there",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })

  test("resolves selected env variables correctly", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.active.resolve("<<hello>>")).toBe("there")
        `,
        {
          global: [],
          selected: [
            {
              key: "hello",
              value: "there",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: "there",
                line: 2,
                negation: false,
                rhs: "there",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })

  test("chooses selected env variable over global variables when both have same variable", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.active.resolve("<<hello>>")).toBe("there")
          hopp.expect(hopp.env.global.resolve("<<hello>>")).toBe("yo")
        `,
        {
          global: [
            {
              key: "hello",
              value: "yo",
            },
          ],
          selected: [
            {
              key: "hello",
              value: "there",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: "there",
                line: 2,
                negation: false,
                rhs: "there",
                testType: "toBe",
              },
              {
                failure: null,
                lhs: "yo",
                line: 3,
                negation: false,
                rhs: "yo",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })

  test("if infinite loop in resolution, abandons resolutions altogether", () => {
    return expect(
      func(
        `
          const data = hopp.env.active.resolve("<<hello>>")
          hopp.expect(data).toBe("<<hello>>")
        `,
        {
          global: [],
          selected: [
            {
              key: "hello",
              value: "<<there>>",
            },
            {
              key: "there",
              value: "<<hello>>",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: "<<hello>>",
                line: 3,
                negation: false,
                rhs: "<<hello>>",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })
})
