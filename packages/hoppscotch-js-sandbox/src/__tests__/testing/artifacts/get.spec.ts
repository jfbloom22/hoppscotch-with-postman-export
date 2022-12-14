import { execTestScript, Artifacts } from "../../.."

function func(script: string, artifact: Artifacts) {
  return execTestScript(script, {
    envs: { global: [], selected: [] },
    artifact,
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

describe("artifact.get", () => {
  test("returns the correct value for an existing artifact", () => {
    return expect(
      func(
        `
          const data = hopp.artifact.get("a")
          hopp.expect(data).toBe("b")
      `,
        { a: "b" }
      )
    ).resolves.toMatchObject({
      result: {
        artifact: {
          a: "b",
        },
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

  test("returns undefined for an key that is not present in existing artifacts", () => {
    return expect(
      func(
        `
          const data = hopp.artifact.get("a")

          if(data === undefined) {
            hopp.artifact.create("a", "undefined")
          }
      `,
        {}
      )
    ).resolves.toMatchObject({
      result: {
        artifact: {
          a: "undefined",
        },
      },
    })
  })

  test("error if the key is not a string", () => {
    return expect(
      func(
        `
          const data = hopp.artifact.get(5)
      `,
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key is not string" },
    })
  })
})
