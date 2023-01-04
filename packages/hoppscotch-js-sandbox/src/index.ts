import {
  getQuickJS,
  newAsyncContext,
  QuickJSAsyncContext,
  QuickJSContext,
  QuickJSHandle,
} from "quickjs-emscripten"
import { readFileSync } from "fs"
import { Environment, parseTemplateStringE } from "@hoppscotch/data"
import { isLeft } from "fp-ts/Either"
import * as crypto from "crypto"

const { subtle } = crypto.webcrypto

class VmWrapper {
  // @ts-expect-error error TS2564: Property 'vm' has no initializer and is not definitely assigned in the constructor.
  vm: QuickJSAsyncContext

  async init() {
    if (this.vm) {
      return
    }

    // todo keep
    this.vm = await newAsyncContext()

    const addFunctionHandle = (name: string, callback: any) => {
      const handle = this.vm.newFunction(name, callback)
      this.vm.setProp(this.vm.global, name, handle)
      handle.dispose()
    }

    addFunctionHandle(
      "hostResolve",
      (strHandle: QuickJSHandle, envsHandle: QuickJSHandle) => {
        const str = this.vm.dump(strHandle)
        const envs = this.vm.dump(envsHandle)
        const x = parseTemplateStringE(str, envs)
        return this.vm.newString(isLeft(x) ? str : x.right)
      }
    )

    addFunctionHandle("hostLog", (valueHandle: QuickJSHandle) => {
      const value = this.vm.dump(valueHandle)
      if (Array.isArray(value)) {
        console.log("Log from vm", ...value)
      } else {
        console.log("Log from vm", value, typeof value)
      }
    })

    addFunctionHandle("hostCryptoRandomUUID", () =>
      this.vm.newString(crypto.randomUUID())
    )

    const readFileHandle = this.vm.newFunction("newDigest", (algorithmHandle: QuickJSHandle, messageHandle: QuickJSHandle) =>
      {
        console.log('new host crypto')
        const algorithm: string = this.vm.dump(algorithmHandle)
        const message: string = this.vm.dump(messageHandle)
        const promise = this.vm.newPromise()

        subtle.digest(
          algorithm,
          new TextEncoder().encode(message)
        ).then(
          (hashBuffer) => {
            console.log('starting then', hashBuffer)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
            promise.resolve(this.vm.newString(hashHex))
          },
          (error) => {
            console.log('reject by', error)
            promise.reject(error)} 
        )
        promise.settled.then(this.vm.runtime.executePendingJobs)
        return promise.handle
      }
    )
    readFileHandle.consume((handle) => this.vm.setProp(this.vm.global, "newDigest", handle))

    // const hostCryptoDigestHandle = this.vm.newAsyncifiedFunction(
    //   "hostCryptoDigest",
    //   async (algorithmHandle: QuickJSHandle, messageHandle: QuickJSHandle) => {
    //     console.log('host crypto')
    //     const algorithm: string = this.vm.dump(algorithmHandle)
    //     const message: string = this.vm.dump(messageHandle)
    //     // const a = new TextEncoder().encode(message)
    //     const hashBuffer = await subtle.digest(
    //       algorithm,
    //       new TextEncoder().encode(message)
    //     )
    //     const hashArray = Array.from(new Uint8Array(hashBuffer))
    //     const hashHex = hashArray
    //       .map((b) => b.toString(16).padStart(2, "0"))
    //       .join("")
    //     return this.vm.newString(hashHex)
    //   }
    // )
    // hostCryptoDigestHandle.consume((fn) =>
    //   this.vm.setProp(this.vm.global, "hostCryptoDigest", fn)
    // )

    // const hostCryptoSignHandle = this.vm.newAsyncifiedFunction(
    //   "hostCryptoSign",
    //   async (
    //     algorithmHandle: QuickJSHandle,
    //     privateKeyHandle: QuickJSHandle,
    //     messageHandle: QuickJSHandle
    //   ) => {
    //     const algorithm: string = this.vm.dump(algorithmHandle)
    //     const privateKey: string = this.vm.dump(privateKeyHandle)
    //     const message: string = this.vm.dump(messageHandle)
    //     // const a = new TextEncoder().encode(message)
    //     const hashBuffer = await subtle.digest(
    //       algorithm,
    //       new TextEncoder().encode(message)
    //     )
    //     const hashArray = Array.from(new Uint8Array(hashBuffer))
    //     const hashHex = hashArray
    //       .map((b) => b.toString(16).padStart(2, "0"))
    //       .join("")
    //     return this.vm.newString(hashHex)
    //   }
    // )
    // hostCryptoSignHandle.consume((fn) =>
    //   this.vm.setProp(this.vm.global, "hostCryptoSign", fn)
    // )

    const result = await this.vm.evalCodeAsync(
      readFileSync("./src/lib.js", "utf8"),
      "lib.js"
    )
    if (result.error) {
      // todo use some way to consume this in
      const out = this.vm.dump(result.error)
      result.error.dispose()
      console.log("VM reports error", out)
      throw out
    }
  }

  async evalCode(code: string, filename = "ours.js"): Promise<VMError | null> {
    await this.init()
    const result = await this.vm.evalCodeAsync(code, filename)
    
    if (result.error) {
      const out = this.vm.dump(result.error)
      result.error.dispose()
      console.log("VM reports error", out)
      return out
    } else {
      return null
    }
  }

  async getOutput(code = "out") {
    // await this.vm
    const result = await this.vm.evalCodeAsync(code)
    // await this.vm.runtime.executePendingJobs()
    // @ts-expect-error Property 'value' does not exist on type 'VmCallResult<QuickJSHandle>
    const out = this.vm.dump(result.value)
    // @ts-expect-error Property 'value' does not exist on type 'VmCallResult<QuickJSHandle>
    result.value.dispose()
    return out
  }

  dispose() {
    this.vm.dispose()
  }
}

export type VMError = {
  name: string
  message: string
  stack: string
}

// todo allow any?
export type Artifacts = Record<string, any>
export type Headers = Record<string, string>
export type Params = Record<string, string>

export type PreRequestContext = {
  envs: {
    global: Environment["variables"]
    selected: Environment["variables"]
  }
  artifact: Artifacts
  request: Request
}

export type TestScriptContext = {
  envs: {
    global: Environment["variables"]
    selected: Environment["variables"]
  }
  artifact: Artifacts
  shared: Artifacts
  request: Request
  response: Response
}

export type Request = {
  headers: Headers
  params: Params
}

export type Response = {
  status: number
  headers: Headers
  body: string | object
}

export type TestOutput = {
  name: string | null
  expectations: {
    testType:
      | "toBe"
      | "toBeLevel2xx"
      | "toBeLevel3xx"
      | "toBeLevel4xx"
      | "toBeLevel5xx"
      | "toBeType"
      | "toHaveLength"
      | "toInclude"
      | "toHaveProperty"
    failure: "TYPE_MISMATCH" | "COMPARISON" | "UNSUPPORTED_TYPE"
    lhs: any
    rhs: any
    negation: boolean
    line: number
  }[]
}

export type ConsoleOutput = {
  level: "log" | "warn" | "debug" | "error"
  line: number
  args: any[] // todo check for json serializable type
}

export type PreRequestScriptReport = {
  error: VMError | null
  result: {
    console: ConsoleOutput
    envs: {
      global: Environment["variables"]
      selected: Environment["variables"]
    }
    artifact: Artifacts
    shared: Artifacts
  }
}

export type TestScriptReport = {
  error: VMError | null
  result: {
    console: ConsoleOutput[]
    envs: {
      global: Environment["variables"]
      selected: Environment["variables"]
    }
    artifact: Artifacts
    shared: Artifacts
  }
}

export async function execTestScript(
  script: string,
  context: TestScriptContext
): Promise<TestScriptReport> {
  const vm = new VmWrapper()
  await vm.evalCode(`setPostRequestContext(${JSON.stringify(context)})`)
  const maybeError = await vm.evalCode(script, "ours.js")
  console.log("pending jobs thing", vm.vm.runtime.executePendingJobs(-1))
  const out = {
    error: maybeError,
    result: <TestScriptReport["result"]>await vm.getOutput(),
  }
  vm.dispose()
  return out
}

export async function execPreRequestScript(
  script: string,
  context: PreRequestContext
): Promise<PreRequestScriptReport> {
  const vm = new VmWrapper()
  await vm.evalCode(`setPreRequestContext(${JSON.stringify(context)})`)
  const maybeError = await vm.evalCode(script, "ours.js")
  const out = {
    error: maybeError,
    result: <PreRequestScriptReport["result"]>await vm.getOutput(),
  }
  vm.dispose()
  return out
}
