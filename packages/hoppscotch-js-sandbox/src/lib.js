/* 
todo Include this as test case for finding line no 35
    at lineNumber (lib.js:32)
    at toBeLevelxxx (lib.js:111)
    at toBeLevel2xx (lib.js:116)
    at <anonymous> (ours.js:35)
    at test (lib.js:15)
    at <eval> (ours.js:37)
*/

function lineNumber() {
  const stacktrace = new Error().stack
  const match = stacktrace.match(/\(ours\.js:(\d+)\)/)
  if (match) {
    return parseInt(stacktrace.match(/\(ours\.js:(\d+)\)/)[1])
  } else {
    /*
        todo why does sole line 
        at lineNumber (lib.js:12)
        at log (lib.js:26)
        at <eval> (ours.js)
        */
    return 1
  }
}

class Console {
  consoleOutput

  constructor() {
    this.consoleOutput = []
  }

  log(...args) {
    this.consoleOutput.push({ level: "log", args: args, line: lineNumber() })
  }

  warn(...args) {
    this.consoleOutput.push({ level: "warn", args: args, line: lineNumber() })
  }

  debug(...args) {
    this.consoleOutput.push({ level: "debug", args: args, line: lineNumber() })
  }

  error(...args) {
    this.consoleOutput.push({ level: "error", args: args, line: lineNumber() })
  }
}

class TestSuite {
  tests
  activeTest

  constructor() {
    this.tests = []
    this.activeTest = null
  }

  executeTest(name, func) {
    this.activeTest = { name: name, expectations: [] }
    this.tests.push(this.activeTest)
    func()
    this.activeTest = null
  }

  createExpect(lhs) {
    return new Expect(this, lhs)
  }

  pushExpectResults(obj) {
    if (!this.activeTest) {
      this.activeTest = { name: null, expectations: [] }
      this.tests.push(this.activeTest)
    }
    this.activeTest.expectations.push(obj)
  }
}

class Expect {
  testSuite
  lhs
  not

  constructor(testSuite, lhs, generateNot = true) {
    this.testSuite = testSuite
    this.lhs = lhs
    if (generateNot) {
      this.not = new Expect(this.testSuite, lhs, false)
    }
  }

  compare(comparison) {
    /*
        Xor expresses this truth table
        this.not === undefined   comparison   result
                             F            F        F
                             F            T        T
                             T            F        T
                             T            T        F
        */
    return Boolean((this.not === undefined) ^ comparison)
  }

  toBe(rhs) {
    // IIFE to flatten a nested if
    const failure = (() => {
      if (typeof this.lhs !== typeof rhs) {
        return "TYPE_MISMATCH"
      }
      if (!this.compare(this.lhs === rhs)) {
        return "COMPARISON"
      }
      return null
    })()
    this.testSuite.pushExpectResults({
      lhs: this.lhs,
      rhs,
      failure,
      testType: "toBe",
      negation: this.not === undefined,
      line: lineNumber(),
    })
  }

  toBeLevelxxx(min, max, name) {
    // IIFE to flatten a nested if
    const failure = (() => {
      if (!Number.isFinite(this.lhs)) {
        return "TYPE_MISMATCH"
      }
      if (this.compare(this.lhs < min || this.lhs > max)) {
        return "COMPARISON"
      }
      return null
    })()
    this.testSuite.pushExpectResults({
      lhs: this.lhs,
      failure,
      testType: name,
      negation: this.not === undefined,
      line: lineNumber(),
    })
  }

  toBeLevel2xx() {
    this.toBeLevelxxx(200, 299, "toBeLevel2xx")
  }

  toBeLevel3xx() {
    this.toBeLevelxxx(300, 399, "toBeLevel3xx")
  }

  toBeLevel4xx() {
    this.toBeLevelxxx(400, 499, "toBeLevel4xx")
  }

  toBeLevel5xx() {
    this.toBeLevelxxx(500, 599, "toBeLevel5xx")
  }

  toBeType(rhs) {
    // IIFE to flatten a nested if
    const failure = (() => {
      if (
        ![
          "string",
          "boolean",
          "number",
          "object",
          "undefined",
          "bigint",
          "symbol",
          "function",
        ].includes(rhs)
      ) {
        return "UNSUPPORTED_TYPE"
      }
      if (this.compare(typeof this.lhs !== rhs)) {
        return "TYPE_MISMATCH"
      }
      return null
    })()

    this.testSuite.pushExpectResults({
      lhs: this.lhs,
      rhs,
      failure,
      testType: "toBeType",
      negation: this.not === undefined,
      line: lineNumber(),
    })
  }

  toHaveLength(rhs) {
    // IIFE to flatten a nested if
    const failure = (() => {
      if (!(Array.isArray(this.lhs) || typeof this.lhs === "string")) {
        return "TYPE_MISMATCH"
      }
      if (!(typeof rhs === "number" && !Number.isNaN(rhs))) {
        return "TYPE_MISMATCH"
      }
      if (this.compare(this.lhs.length !== rhs)) {
        return "COMPARISON"
      }
      return null
    })()
    this.testSuite.pushExpectResults({
      lhs: this.lhs,
      rhs,
      failure,
      testType: "toHaveLength",
      negation: this.not === undefined,
      line: lineNumber(),
    })
  }

  toInclude(rhs) {
    // IIFE to flatten a nested if
    const failure = (() => {
      if (!(Array.isArray(this.lhs) || typeof this.lhs === "string")) {
        return "TYPE_MISMATCH"
      }
      if (rhs === null || rhs === undefined) {
        return "UNSUPPORTED_TYPE"
      }
      if (this.compare(!this.lhs.includes(rhs))) {
        return "COMPARISON" // todo use some other constant?
      }
      return null
    })()
    this.testSuite.pushExpectResults({
      lhs: this.lhs,
      rhs,
      failure,
      testType: "toInclude",
      negation: this.not === undefined,
      line: lineNumber(),
    })
  }

  toHaveProperty(rhs) {
    // IIFE to flatten a nested if
    const failure = (() => {
      if (this.lhs === null || this.lhs === undefined) {
        return "UNSUPPORTED_TYPE"
      }
      // eslint-disable-next-line no-prototype-builtins
      if (this.compare(!this.lhs.hasOwnProperty(rhs))) {
        return "COMPARISON" // todo use some other constant?
      }
      return null
    })()
    this.testSuite.pushExpectResults({
      lhs: this.lhs,
      rhs,
      failure,
      testType: "toHaveProperty",
      negation: this.not === undefined,
      line: lineNumber(),
    })
  }
}

class EnvPart {
  constructor(data) {
    this.data = data
  }

  get(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    // todo check if its not resolved
    const maybeValue = this.data.find((item) => item.key === key)
    // const maybeValue = this.getRaw(key)
    if (!maybeValue) {
      return undefined
    }
    return hostResolve(maybeValue.value, this.data)
  }

  set(key, value) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    if (typeof value !== "string") {
      throw Error("value is not string")
    }
    const maybeFound = this.data.find((item) => item.key === key)
    if (maybeFound) {
      maybeFound.value = value
    } else {
      this.data.push({ key: key, value: value })
    }
  }

  resolve(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    return hostResolve(key, this.data)
  }

  getRaw(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    const maybeValue = this.data.find((item) => item.key === key)
    if (maybeValue) {
      return maybeValue.value
    }
    return undefined
  }

  delete(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    const index = this.data.findIndex((x) => x.key === key)
    this.data.splice(index, 1)
  }
}

class BaseEnv {
  globalData = null
  selectedData = null

  constructor(data) {
    this.globalData = data.global
    this.selectedData = data.selected
    // this.global = new EnvPart(data.global)
    // this.active = new EnvPart(data.selected)
  }

  getRaw(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    const maybeFromSelected = this.selectedData.find((item) => item.key === key)
    if (maybeFromSelected) {
      return maybeFromSelected.value
    }
    const maybeFromGlobal = this.globalData.find((item) => item.key === key)
    if (maybeFromGlobal) {
      return maybeFromGlobal.value
    }
    return undefined
  }

  getResolve(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    const maybeValue = this.getRaw(key)
    if (!maybeValue) {
      return undefined
    }
    return hostResolve(maybeValue, [...this.selectedData, ...this.globalData])
  }

  set(key, value) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    if (typeof value !== "string") {
      throw Error("value is not string")
    }
    const maybeFromSelected = this.selectedData.find((item) => item.key === key)
    if (maybeFromSelected) {
      maybeFromSelected.value = value
      return
    }
    const maybeFromGlobal = this.globalData.find((item) => item.key === key)
    if (maybeFromGlobal) {
      maybeFromGlobal.value = value
      return
    }
    this.selectedData.push({ key: key, value: value })
  }

  resolve(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    return hostResolve(key, [...this.selectedData, ...this.globalData])
  }

  delete(key) {
    if (typeof key !== "string") {
      throw Error("key is not string")
    }
    const indexInGlobal = this.globalData.findIndex((x) => x.key === key)
    const indexInSelected = this.selectedData.findIndex((x) => x.key === key)
    this.globalData.splice(indexInGlobal, 1)
    this.selectedData.splice(indexInSelected, 1)
  }
}

class LegacyEnv extends BaseEnv {
  get(key) {
    return this.getRaw(key)
  }
}

class Env extends BaseEnv {
  constructor(data) {
    super(data)
    this.global = new EnvPart(data.global)
    this.active = new EnvPart(data.selected)
  }

  get(key) {
    return this.getResolve(key)
  }
}

class Shared {
  constructor(state) {
    this.state = state
  }

  get(key) {
    if (typeof key !== "string") {
      throw Error("Key is not string")
    }
    return this.state[key]
  }

  create(key, value) {
    if (typeof key !== "string") {
      throw Error("Key is not string")
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!this.state.hasOwnProperty(key)) {
      this.state[key] = value
    }
  }

  update(key, value) {
    if (typeof key !== "string") {
      throw Error("Key is not string")
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!this.state.hasOwnProperty(key)) {
      throw Error("Key does not exist")
    }
    // todo check value if serializable
    this.state[key] = value
  }

  delete(key) {
    if (typeof key !== "string") {
      throw Error("Key is not string")
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!this.state.hasOwnProperty(key)) {
      throw Error("Key does not exist")
    }
    delete this.state[key]
  }
}

let out
let console
let pw
let hopp

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setPreRequestContext(context) {
  const legacyEnv = new LegacyEnv(context.envs)
  const env = new Env(context.envs)
  console = new Console()
  const artifact = new Shared(context.artifact)
  const shared = new Shared({})
  pw = {
    env: legacyEnv,
  }
  hopp = {
    env,
    request: context.request,
    artifact,
    shared,
  }
  out = {
    console: console.consoleOutput,
    envs: { global: env.globalData, selected: env.selectedData },
    artifact: artifact.state,
    shared: shared.state,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setPostRequestContext(context) {
  console = new Console()
  const testSuite = new TestSuite()
  const legacyEnv = new LegacyEnv(context.envs)
  const env = new Env(context.envs)
  const artifact = new Shared(context.artifact)
  const shared = new Shared(context.shared)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pw = {
    env: legacyEnv,
    response: context.response,
    console: console,
    test: (name, func) => testSuite.executeTest(name, func),
    expect: (lhs) => testSuite.createExpect(lhs),
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hopp = {
    env,
    request: context.request,
    response: context.response,
    artifact,
    shared,
    test: (name, func) => testSuite.executeTest(name, func),
    expect: (lhs) => testSuite.createExpect(lhs),
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  out = {
    console: console.consoleOutput,
    envs: { global: env.globalData, selected: env.selectedData },
    artifact: artifact.state,
    shared: shared.state,
    tests: testSuite.tests,
  }
}
