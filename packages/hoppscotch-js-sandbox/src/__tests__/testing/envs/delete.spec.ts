import { execTestScript, TestScriptContext } from "../../.."

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

describe("env.delete", () => {
  test("deletes environment variable from both selected and global", () => {
    return expect(
      func(
        `
          hopp.env.delete("a")
          const data = hopp.env.get("a")
          hopp.expect(data).toBe(undefined)
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
                // lhs: undefined,
                line: 4,
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

  // test("deletes highest precedence version of the variable from both selected and global", () => {
  //   return expect(
  //     func(
  //       `
  //         let dataGlobal = env.global.get("a")
  //         let dataActive = env.active.get("a")

  //         expect(dataGlobal).toBe("b1")
  //         expect(dataActive).toBe("b1")

  //         env.delete("a")

  //         dataGlobal = env.global.get("a")
  //         dataActive = env.active.get("a")

  //         expect(dataGlobal).toBe("b2")
  //         expect(dataActive).toBe("b2")
  //     `,
  //       {
  //         global: [
  //           {
  //             key: "a",
  //             value: "b1",
  //           },
  //           {
  //             key: "a",
  //             value: "b2",
  //           },
  //         ],
  //         selected: [
  //           {
  //             key: "a",
  //             value: "b1",
  //           },
  //           {
  //             key: "a",
  //             value: "b2",
  //           },
  //         ],
  //       }
  //     )()
  //   ).resolves.toEqualRight([
  //     expect.objectContaining({
  //       expectResults: [
  //         {
  //           status: "pass",
  //           message: "Expected 'b1' to be 'b1'",
  //         },
  //         {
  //           status: "pass",
  //           message: "Expected 'b1' to be 'b1'",
  //         },
  //         {
  //           status: "pass",
  //           message: "Expected 'b2' to be 'b2'",
  //         },
  //         {
  //           status: "pass",
  //           message: "Expected 'b2' to be 'b2'",
  //         },
  //       ],
  //     }),
  //   ])
  // })

  test("error if the key is not a string", () => {
    return expect(
      func(
        `
          hopp.env.delete(5)
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

  test("no error if key isn't in both global and selected environments", () => {
    return expect(
      func(
        `
          hopp.env.delete("a")
      `,
        {
          global: [],
          selected: [],
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [],
      },
    })
  })
})
