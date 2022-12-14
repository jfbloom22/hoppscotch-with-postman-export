import { execTestScript } from "../../.."

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

describe("toBeLevel2xx", () => {
  test("assertion passes for 200 series with no negation", async () => {
    for (let i = 200; i < 300; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel2xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel2xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion fails for non 200 series with no negation", async () => {
    for (let i = 300; i < 500; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel2xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel2xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with no negation", async () => {
    await expect(
      func(`hopp.expect("foo").toBeLevel2xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: false,
                testType: "toBeLevel2xx",
              },
            ],
          },
        ],
      },
    })
  })

  test("assertion fails for 200 series with negation", async () => {
    for (let i = 200; i < 300; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel2xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel2xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion passes for non 200 series with negation", async () => {
    for (let i = 300; i < 500; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel2xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel2xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with negation", async () => {
    await expect(
      func(`hopp.expect("foo").not.toBeLevel2xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: true,
                testType: "toBeLevel2xx",
              },
            ],
          },
        ],
      },
    })
  })
})

describe("toBeLevel3xx", () => {
  test("assertion passes for 300 series with no negation", async () => {
    for (let i = 300; i < 400; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel3xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel3xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion fails for non 300 series with no negation", async () => {
    for (let i = 400; i < 600; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel3xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel3xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with no negation", async () => {
    await expect(
      func(`hopp.expect("foo").toBeLevel3xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: false,
                testType: "toBeLevel3xx",
              },
            ],
          },
        ],
      },
    })
  })

  test("assertion fails for 300 series with negation", async () => {
    for (let i = 300; i < 400; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel3xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel3xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion passes for non 300 series with negation", async () => {
    for (let i = 400; i < 600; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel3xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel3xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with negation", async () => {
    await expect(
      func(`hopp.expect("foo").not.toBeLevel3xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: true,
                testType: "toBeLevel3xx",
              },
            ],
          },
        ],
      },
    })
  })
})

describe("toBeLevel4xx", () => {
  test("assertion passes for 400 series with no negation", async () => {
    for (let i = 400; i < 500; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel4xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel4xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion fails for non 400 series with no negation", async () => {
    for (let i = 200; i < 400; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel4xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel4xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with no negation", async () => {
    await expect(
      func(`hopp.expect("foo").toBeLevel4xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: false,
                testType: "toBeLevel4xx",
              },
            ],
          },
        ],
      },
    })
  })

  test("assertion fails for 400 series with negation", async () => {
    for (let i = 400; i < 500; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel4xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel4xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion passes for non 400 series with negation", async () => {
    for (let i = 200; i < 400; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel4xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel4xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with negation", async () => {
    await expect(
      func(`hopp.expect("foo").not.toBeLevel4xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: true,
                testType: "toBeLevel4xx",
              },
            ],
          },
        ],
      },
    })
  })
})

describe("toBeLevel5xx", () => {
  test("assertion passes for 500 series with no negation", async () => {
    for (let i = 500; i < 600; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel5xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel5xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion fails for non 500 series with no negation", async () => {
    for (let i = 300; i < 500; i++) {
      await expect(
        func(`hopp.expect(${i}).toBeLevel5xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: false,
                  testType: "toBeLevel5xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with no negation", async () => {
    await expect(
      func(`hopp.expect("foo").toBeLevel5xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: false,
                testType: "toBeLevel5xx",
              },
            ],
          },
        ],
      },
    })
  })

  test("assertion fails for 500 series with negation", async () => {
    for (let i = 500; i < 600; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel5xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: "COMPARISON",
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel5xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("assertion passes for non 500 series with negation", async () => {
    for (let i = 300; i < 500; i++) {
      await expect(
        func(`hopp.expect(${i}).not.toBeLevel5xx()`)
      ).resolves.toMatchObject({
        result: {
          tests: [
            {
              name: null,
              expectations: [
                {
                  failure: null,
                  lhs: i,
                  line: 1,
                  negation: true,
                  testType: "toBeLevel5xx",
                },
              ],
            },
          ],
        },
      })
    }
  })

  test("give error if the expect value was not a number with negation", async () => {
    await expect(
      func(`hopp.expect("foo").not.toBeLevel5xx()`)
    ).resolves.toMatchObject({
      result: {
        tests: [
          {
            name: null,
            expectations: [
              {
                failure: "TYPE_MISMATCH",
                lhs: "foo",
                line: 1,
                negation: true,
                testType: "toBeLevel5xx",
              },
            ],
          },
        ],
      },
    })
  })
})
