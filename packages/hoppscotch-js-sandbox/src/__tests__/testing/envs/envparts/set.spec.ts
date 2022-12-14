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

describe("env.set", () => {
  test("updates the selected environment variable correctly", () => {
    return expect(
      func(
        `
          hopp.env.active.set("a", "c")
        `,
        {
          global: [],
          selected: [
            {
              key: "a",
              value: "b",
            },
          ],
        }
      )
    ).resolves.toMatchObject({
      result: {
        envs: {
          global: [],
          selected: [
            {
              key: "a",
              value: "c",
            },
          ],
        },
      },
    })
  })

  test("updates the global environment variable correctly", () => {
    return expect(
      func(
        `
          hopp.env.global.set("a", "c")
        `,
        {
          global: [
            {
              key: "a",
              value: "b",
            },
          ],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      result: {
        envs: {
          global: [
            {
              key: "a",
              value: "c",
            },
          ],
          selected: [],
        },
      },
    })
  })

  // test("updates the selected environment if env present in both", () => {
  //   return expect(
  //     func(
  //       `
  //         hopp.env.set("a", "c")
  //       `,
  //       {
  //         global: [
  //           {
  //             key: "a",
  //             value: "b",
  //           },
  //         ],
  //         selected: [
  //           {
  //             key: "a",
  //             value: "d",
  //           },
  //         ],
  //       }
  //     )
  //   ).resolves.toMatchObject({result:
  //     {
  //         envs: {
  //             global: [{
  //               "key": "a",
  //               "value": "b",
  //           }],
  //             selected: [{
  //               "key": "a",
  //               "value": "c",
  //           }],
  //         }
  //     }
  // })
  // })

  // test("non existent keys are created in the selected environment", () => {
  //   return expect(
  //     func(
  //       `
  //         hopp.env.set("a", "c")
  //       `,
  //       {
  //         global: [],
  //         selected: [],
  //       }
  //     )
  //   ).resolves.toMatchObject({result:
  //     {
  //         envs: {
  //             global: [],
  //             selected: [{
  //               "key": "a",
  //               "value": "c",
  //           }],
  //         }
  //     }
  // })
  // })

  test("keys should be a string", () => {
    return expect(
      func(
        `
          hopp.env.active.set(5, "c")
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

  test("values should be a string", () => {
    return expect(
      func(
        `
          hopp.env.active.set("a", 5)
        `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      error: { message: "value is not string" },
    })
  })

  test("set environment values are reflected in the script execution", () => {
    return expect(
      func(
        `
          hopp.env.active.set("a", "b")
          hopp.expect(hopp.env.active.get("a")).toBe("b")
        `,
        {
          global: [],
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
                lhs: "b",
                line: 3,
                negation: false,
                rhs: "b",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })
})
