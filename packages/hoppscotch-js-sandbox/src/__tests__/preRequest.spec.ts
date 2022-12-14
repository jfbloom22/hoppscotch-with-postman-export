import { execPreRequestScript } from ".."

const fakeRequest = {
  headers: {},
  params: { a: "123", b: "foo" },
}

describe("pw.* apis", () => {
  test("pw.env api works", () => {
    return expect(
      execPreRequestScript(`pw.env.set('foo', 'bar')`, {
        envs: { global: [], selected: [] },
        artifact: {},
        request: fakeRequest,
      })
    ).resolves.toMatchObject({
      result: {
        envs: {
          global: [],
          selected: [
            {
              key: "foo",
              value: "bar",
            },
          ],
        },
      },
    })
  })
})

describe("hopp.* apis", () => {
  test("hopp.console is available", () => {
    return expect(
      execPreRequestScript(`console.log(1)`, {
        envs: { global: [], selected: [] },
        artifact: {},
        request: fakeRequest,
      })
    ).resolves.toMatchObject({
      result: {
        console: [{ level: "log", line: 1, args: [1] }],
      },
    })
  })

  test("hopp.request is available", () => {
    return expect(
      execPreRequestScript(`console.log(hopp.request)`, {
        envs: { global: [], selected: [] },
        artifact: {},
        request: fakeRequest,
      })
    ).resolves.toMatchObject({
      result: {
        console: [{ level: "log", line: 1, args: [fakeRequest] }],
      },
    })
  })

  // todo env part is not available
  test("hopp.env is available", () => {
    return expect(
      execPreRequestScript(`hopp.env.set('foo', 'bar')`, {
        envs: { global: [], selected: [] },
        artifact: {},
        request: fakeRequest,
      })
    ).resolves.toMatchObject({
      result: {
        envs: {
          global: [],
          selected: [
            {
              key: "foo",
              value: "bar",
            },
          ],
        },
      },
    })
  })

  test("hopp.shared and hopp.artifact is available", () => {
    return expect(
      execPreRequestScript(
        `hopp.shared.create('foo', {someKey: [1,2,3]})
            hopp.artifact.create('foo_artifact', {key: "val"})`,
        {
          envs: { global: [], selected: [] },
          artifact: {},
          request: fakeRequest,
        }
      )
    ).resolves.toMatchObject({
      result: {
        artifact: { foo_artifact: { key: "val" } },
        shared: { foo: { someKey: [1, 2, 3] } },
      },
    })
  })
})
