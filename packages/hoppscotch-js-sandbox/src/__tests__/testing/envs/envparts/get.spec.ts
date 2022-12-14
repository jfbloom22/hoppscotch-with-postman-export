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

describe("env.get", () => {
  test("returns the correct value for an existing selected environment value", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.active.get("a")).toBe("b")
      `,
        {
          global: [
            {
              key: "a",
              value: "c",
            },
          ],
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
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: null,
                lhs: "b",
                line: 2,
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

  test("returns the correct value for an existing global environment value", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.global.get("a")).toBe("b")
      `,
        {
          global: [
            {
              key: "a",
              value: "b",
            },
          ],
          selected: [
            {
              key: "a",
              value: "c",
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
                lhs: "b",
                line: 2,
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

  test("returns undefined for a key that is not present in both selected or environment", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.active.get("a")).toBe(undefined)
          hopp.expect(hopp.env.global.get("a")).toBe(undefined)
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
                // lhs: undefined,
                line: 2,
                negation: false,
                // rhs: undefined,
                testType: "toBe",
              },
              {
                failure: null,
                // lhs: undefined,
                line: 3,
                negation: false,
                // rhs: undefined,
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })

  // test("returns the value defined in selected environment if it is also present in global", () => {
  //   return expect(
  //     func(
  //       `
  //         const data = hopp.env.get("a")
  //         hopp.expect(data).toBe("selected val")
  //     `,
  //       {
  //         global: [
  //           {
  //             key: "a",
  //             value: "global val",
  //           },
  //         ],
  //         selected: [
  //           {
  //             key: "a",
  //             value: "selected val",
  //           },
  //         ],
  //       }
  //     )
  //   ).resolves.toMatchObject({
  //     result:
  //     {
  //       tests: [
  //         {
  //           name: null,
  //           expectations: [
  //             {
  //               failure: null,
  //               lhs: 'selected val',
  //               line: 3,
  //               negation: false,
  //               rhs: 'selected val',
  //               testType: 'toBe'
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   })
  // })

  test("resolve environment values", () => {
    return expect(
      func(
        `
          hopp.expect(hopp.env.active.get("a")).toBe("a3")
          hopp.expect(hopp.env.global.get("a")).toBe("a5")
      `,
        {
          global: [
            {
              key: "a",
              value: "<<a4>>",
            },
            {
              key: "a4",
              value: "a5",
            },
          ],
          selected: [
            {
              key: "a",
              value: "<<a2>>",
            },
            {
              key: "a2",
              value: "a3",
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
                lhs: "a3",
                line: 2,
                negation: false,
                rhs: "a3",
                testType: "toBe",
              },
              {
                failure: null,
                lhs: "a5",
                line: 3,
                negation: false,
                rhs: "a5",
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })

  test("returns unresolved value on infinite loop in resolution", () => {
    return expect(
      func(
        `
          const data = hopp.env.active.get("a")
          hopp.expect(data).toBe("<<hello>>")
      `,
        {
          global: [],
          selected: [
            {
              key: "a",
              value: "<<hello>>",
            },
            {
              key: "hello",
              value: "<<a>>",
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

  test("errors if the key is not a string", () => {
    return expect(
      func(
        `
          const data = hopp.env.active.get(5)
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
})
