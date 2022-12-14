import { execTestScript } from ".."

const fakeResponse = {
  headers: {},
  status: 200,
  body: "Some body",
}

const fakeRequest = {
  headers: {},
  params: { a: "123", b: "foo" },
}

describe("pw.* apis", () => {
  test("pw.console is available", () => {
    return expect(
      execTestScript(`pw.console.log(1)`, {
        envs: { global: [], selected: [] },
        artifact: {},
        shared: {},
        request: fakeRequest,
        response: fakeResponse,
      })
    ).resolves.toMatchObject({
      result: {
        console: [{ level: "log", line: 1, args: [1] }],
      },
    })
  })

  test("pw.response is available", () => {
    return expect(
      execTestScript(`pw.console.log(pw.response)`, {
        envs: { global: [], selected: [] },
        artifact: {},
        shared: {},
        request: fakeRequest,
        response: fakeResponse,
      })
    ).resolves.toMatchObject({
      result: {
        console: [{ level: "log", line: 1, args: [fakeResponse] }],
      },
    })
  })

  test("pw.env is available", () => {
    return expect(
      execTestScript(`pw.env.set('foo', 'bar')`, {
        envs: { global: [], selected: [] },
        artifact: {},
        shared: {},
        request: fakeRequest,
        response: fakeResponse,
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

  test("pw.expect and pw.test is available", () => {
    return expect(
      execTestScript(
        `pw.test("testname", () => {
                pw.expect(2).toBe(2)
            })`,
        {
          envs: { global: [], selected: [] },
          artifact: {},
          shared: {},
          request: fakeRequest,
          response: fakeResponse,
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: "testname",
            expectations: [
              {
                failure: null,
                lhs: 2,
                line: 2,
                negation: false,
                rhs: 2,
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })
})

describe("hopp.* apis", () => {
  test("hopp.console is available", () => {
    return expect(
      execTestScript(`console.log(1)`, {
        envs: { global: [], selected: [] },
        artifact: {},
        shared: {},
        request: fakeRequest,
        response: fakeResponse,
      })
    ).resolves.toMatchObject({
      result: {
        console: [{ level: "log", line: 1, args: [1] }],
      },
    })
  })

  test("hopp.response and hopp.request is available", () => {
    return expect(
      execTestScript(
        `console.log(hopp.response)
            console.log(hopp.request)`,
        {
          envs: { global: [], selected: [] },
          artifact: {},
          shared: {},
          request: fakeRequest,
          response: fakeResponse,
        }
      )
    ).resolves.toMatchObject({
      result: {
        console: [
          { level: "log", line: 1, args: [fakeResponse] },
          { level: "log", line: 2, args: [fakeRequest] },
        ],
      },
    })
  })

  test("hopp.env is available", () => {
    return expect(
      execTestScript(`hopp.env.set('foo', 'bar')`, {
        envs: { global: [], selected: [] },
        artifact: {},
        shared: {},
        request: fakeRequest,
        response: fakeResponse,
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

  test("hopp.expect and hopp.test is available", () => {
    return expect(
      execTestScript(
        `hopp.test("testname", () => {
                hopp.expect(2).toBe(2)
            })`,
        {
          envs: { global: [], selected: [] },
          artifact: {},
          shared: {},
          request: fakeRequest,
          response: fakeResponse,
        }
      )
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: "testname",
            expectations: [
              {
                failure: null,
                lhs: 2,
                line: 2,
                negation: false,
                rhs: 2,
                testType: "toBe",
              },
            ],
          },
        ],
      },
    })
  })

  test("hopp.artifact and hopp.shared is available", () => {
    return expect(
      execTestScript(
        `hopp.artifact.create('aKey', "a value")
            hopp.shared.create('foo', {someKey: [1,2,3]})`,
        {
          envs: { global: [], selected: [] },
          artifact: {},
          shared: {},
          request: fakeRequest,
          response: fakeResponse,
        }
      )
    ).resolves.toMatchObject({
      result: {
        artifact: { aKey: "a value" },
        shared: { foo: { someKey: [1, 2, 3] } },
      },
    })
  })
})
