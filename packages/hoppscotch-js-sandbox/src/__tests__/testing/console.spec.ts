import { execTestScript } from "../.."

function func(script: string) {
  return execTestScript(script, {
    envs: { global: [], selected: [] },
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

describe("Console stuff", () => {
  test("String, number, object, arrays are correctly tracked", async () => {
    return expect(
      func(
        `const x = {a:1, b:2}
            console.log('foo', 1, x, [1,2,3])`
      )
    ).resolves.toMatchObject({
      result: {
        console: [
          {
            level: "log",
            line: 2,
            args: ["foo", 1, { a: 1, b: 2 }, [1, 2, 3]],
          },
        ],
      },
    })
  })

  test("Functions and class logs as null", async () => {
    return expect(
      func(
        `class A {

            }
            console.log('logs:',A, () => {1}, function(){})`
      )
    ).resolves.toMatchObject({
      result: {
        console: [{ level: "log", line: 4, args: ["logs:", null, null, null] }],
      },
    })
  })

  // todo put this somewhere else
  // todo do that x = too
  test("cyclic object causes poof", async () => {
    return expect(
      func(
        `
            const a = {}
            a.b = a`
      )
    ).rejects.toThrow("Assertion failed: list_empty(&rt->gc_obj_list)")
  })

  test("Correct line number is tracked", async () => {
    return expect(
      func(
        `console.log(1)
            if(true){
                console.log(2)
            }

            console.log(3)
            `
      )
    ).resolves.toMatchObject({
      result: {
        console: [
          { level: "log", line: 1, args: [1] },
          { level: "log", line: 3, args: [2] },
          { level: "log", line: 6, args: [3] },
        ],
      },
    })
  })

  test("log, debug, warn and error levels work", async () => {
    return expect(
      func(
        `console.log(1)
            console.debug(2)
            console.warn(3)
            console.error(4)`
      )
    ).resolves.toMatchObject({
      result: {
        console: [
          { level: "log", line: 1, args: [1] },
          { level: "debug", line: 2, args: [2] },
          { level: "warn", line: 3, args: [3] },
          { level: "error", line: 4, args: [4] },
        ],
      },
    })
  })
})
