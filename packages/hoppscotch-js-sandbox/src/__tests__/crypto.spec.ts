import { execTestScript } from ".."

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

// describe("crypto.randomUUID()", () => {
//   test("crypto.randomUUID() generates unique values", async () => {
//     const foo = await func(
//       `
//       console.log(crypto.randomUUID())
//       console.log(crypto.randomUUID())
//       `
//     )
//     return expect(foo.result.console[0].args[0]).not.toEqual(
//       foo.result.console[1].args[0]
//     )
//   })

//   test("crypto.randomUUID() returns a UUID of correct format", async () => {
//     const foo = await func(
//       `
//       console.log(crypto.randomUUID())
//       `
//     )
//     return expect(foo.result.console[0].args[0]).toMatch(
//       /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
//     )
//   })
// })

describe("crypto digestion", () => {
  // test("crypto.hostCryptoDigest", async () => {
  //   return expect(
  //     func(
  //       `
  //       console.log(cryptoWrapper.digest('SHA-1', 'input string'));
  //       console.log(cryptoWrapper.digest('SHA-256', 'input string 😃'));
  //       console.log(cryptoWrapper.digest('SHA-384', 'input string'));
  //       console.log(cryptoWrapper.digest('SHA-512', 'input string'));
  //       `
  //     )
  //   ).resolves.toMatchObject({
  //     result: {
  //       console: [
  //         {
  //           level: "log",
  //           line: 2,
  //           args: ["b1a39a26ea62a5c075cd3cb5aa46492c8e1134b7"],
  //         },
  //         {
  //           level: "log",
  //           line: 3,
  //           args: [
  //             "ad5786128151dec11d7394c3d4345062c88892a589129302182622380eb6d546",
  //           ],
  //         },
  //         {
  //           level: "log",
  //           line: 4,
  //           args: [
  //             "9be3e778129db2f6a4b33345eb88c1f3706a6b5258f842c86888dada1840ea8a64114fe197fb5bc965027ff34ffe7c1e",
  //           ],
  //         },
  //         {
  //           level: "log",
  //           line: 5,
  //           args: [
  //             "61fdf527eb4a1a793633ea745c36ae06f197b565f07ea0e2254c15064bd8c744d8e66b73c55b409b3dbcb3c3cf4f52d3f234e3dfd7cd4a344bb8d83bbf0094db",
  //           ],
  //         },
  //       ],
  //     },
  //   })
  // })

  test("crypto.hostCryptoDigest", async () => {
    await expect(
      // func(`async () => console.log(crypto.digest('fake', 'input string'));`)
      func(`(async () => {
        try {
          console.log(123)
        console.log(123)
        const foo = crypto.digest('SHA-1', 'input string')
        console.log('foo', foo)
        console.log('await foo', await foo)

        } catch(e) {
          console.log('error is', e)
        }
        
      })()`) 
    ).resolves.toMatchObject({
      // error: { message: "Unrecognized name." },
      result: {
        console: [
          { level: "log", line: 3, args: [123] },
          { level: "log", line: 4, args: [123] },
        ],
      }
    })
  })
})
