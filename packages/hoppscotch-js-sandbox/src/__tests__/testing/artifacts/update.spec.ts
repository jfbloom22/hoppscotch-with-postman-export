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

describe("artifact.update", () => {
  test("updates artifact for existing key", () => {
    return expect(
      func(
        `
          hopp.artifact.update("a", "updated_c")
        `,
        { a: "c" }
      )
    ).resolves.toMatchObject({
      result: {
        artifact: {
          a: "updated_c",
        },
      },
    })
  })

  test("error if artifact key doesn't exist", () => {
    return expect(
      func(
        `
          hopp.artifact.update("a", "b")
        `,
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key does not exist" },
    })
  })

  test("error if the key is not string", () => {
    return expect(
      func(
        `
          hopp.artifact.update(1, "b")
        `,
        {}
      )
    ).resolves.toMatchObject({
      error: { message: "Key is not string" },
    })
  })

  // test("error if the value is not string", () => {
  //   return expect(
  //     func(
  //       `
  //         artifact.update("a", 2)
  //       `,
  //       {},
  //       {}
  //     )
  //   ).resolves.toMatchObject({
  //     error: { message: "Key is not string" }
  //   })
  // })
})
