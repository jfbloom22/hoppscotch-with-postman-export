import { execTestScript } from "../.."

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

describe("crypto.randomUUID()", () => {
  test("crypto.randomUUID() generates unique values", async () => {
    const foo = await func(
      `
      console.log(crypto.randomUUID())
      console.log(crypto.randomUUID())
      `
    )
    return expect(foo.result.console[0].args[0]).not.toEqual(
      foo.result.console[1].args[0]
    )
  })

  test("crypto.randomUUID() returns a UUID of correct format", async () => {
    const foo = await func(
      `
      console.log(crypto.randomUUID())
      `
    )
    return expect(foo.result.console[0].args[0]).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    )
  })
})
