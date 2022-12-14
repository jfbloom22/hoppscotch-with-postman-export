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

describe("artifact.delete", () => {
  test("deletes from artifact for given key", () => {
    return expect(
      func(
        `
          hopp.artifact.delete("a")
        `,
        { a: "c", b: "d" }
      )
    ).resolves.toMatchObject({
      result: {
        artifact: {
          b: "d",
        },
      },
    })
  })

  test("error if artifact key is not string", () => {
    return expect(
      func(
        `
          hopp.artifact.delete(5)
        `,
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key is not string" },
    })
  })

  test("error if artifact key doesn't exists", () => {
    return expect(
      func(
        `
          hopp.artifact.delete("a")
        `,
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key does not exist" },
    })
  })
})
