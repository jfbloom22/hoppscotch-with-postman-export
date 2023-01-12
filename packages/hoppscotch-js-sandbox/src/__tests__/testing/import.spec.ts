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

describe("import", () => {
  test("importing lodash works", async () => {
    return expect(
      func(
        `
        import 'https://cdn.jsdelivr.net/npm/lodash';
        console.log(_.compact([1,null,2,null,3]))
        `
      )
    ).resolves.toMatchObject({
      result: {
        console: [
          {
            level: "log",
            line: 3,
            args: [[1, 2, 3]],
          },
        ],
      },
    })
  })
})
