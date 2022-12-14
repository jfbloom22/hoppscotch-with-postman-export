import { getQuickJS, QuickJSContext } from "quickjs-emscripten"
import { readFileSync } from "fs"
import { Environment, parseTemplateStringE } from "@hoppscotch/data"
import { isLeft } from "fp-ts/Either"

class VmWrapper {
  // @ts-expect-error error TS2564: Property 'vm' has no initializer and is not definitely assigned in the constructor.
  vm: QuickJSContext

  async init() {
    if (this.vm) {
      return
    }

    const QuickJS = await getQuickJS()
    this.vm = QuickJS.newContext()

    const handle = this.vm.newFunction(
      "hostResolve",
      (strHandle, envsHandle) => {
        const str = this.vm.dump(strHandle)
        const envs = this.vm.dump(envsHandle)

        const x = parseTemplateStringE(str, envs)
        return this.vm.newString(isLeft(x) ? str : x.right)
      }
    )
    this.vm.setProp(this.vm.global, "hostResolve", handle)
    handle.dispose()

    const handle2 = this.vm.newFunction("hostLog", (valueHandle) => {
      const value = this.vm.dump(valueHandle)
      if (Array.isArray(value)) {
        console.log("Log from vm", ...value)
      } else {
        console.log("Log from vm", value)
      }
    })
    this.vm.setProp(this.vm.global, "hostLog", handle2)
    handle2.dispose()

    const result = await this.vm.evalCode(
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
    const result = this.vm.evalCode(code, filename)
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
    const result = await this.vm.evalCode(code)
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
    console: ConsoleOutput
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
