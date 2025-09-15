import { ref, computed, type Ref } from 'vue'

interface ParseResult {
  data: any
  hasFunctions: boolean
  functionPaths: string[]
}

interface ParseError {
  message: string
  line?: number
  column?: number
}

export function useJSONWithFunctions() {
  // Reactive state
  const parsedData = ref<any>(null)
  const hasFunctions = ref(false)
  const functionPaths = ref<string[]>([])
  const parseError = ref<ParseError | null>(null)
  const isValid = ref(false)

  // Computed properties
  const functionCount = computed(() => functionPaths.value.length)
  const hasError = computed(() => parseError.value !== null)

  /**
   * Parse JSON string that may contain JavaScript functions
   */
  function parseJSON(jsonString: string): ParseResult | null {
    // Reset state
    parseError.value = null
    isValid.value = false
    parsedData.value = null
    hasFunctions.value = false
    functionPaths.value = []

    if (!jsonString.trim()) {
      return null
    }

    try {
      const result = parseJSONWithFunctions(jsonString)

      // Update reactive state
      parsedData.value = result.data
      hasFunctions.value = result.hasFunctions
      functionPaths.value = result.functionPaths
      isValid.value = true

      return result
    } catch (error: any) {
      const errorMessage = error.message
      const lineMatch = errorMessage.match(/line (\d+)/)
      const columnMatch = errorMessage.match(/column (\d+)/)

      parseError.value = {
        message: errorMessage,
        line: lineMatch ? parseInt(lineMatch[1]) : undefined,
        column: columnMatch ? parseInt(columnMatch[1]) : undefined
      }

      return null
    }
  }

  /**
   * Validate JSON string without parsing
   */
  function validateJSON(jsonString: string): boolean {
    try {
      parseJSONWithFunctions(jsonString)
      return true
    } catch {
      return false
    }
  }

  /**
   * Convert object with functions back to JSON string
   */
  function stringifyJSON(obj: any, space?: number): string {
    return stringifyWithFunctions(obj, space)
  }

  /**
   * Format JSON string with proper indentation while preserving functions
   */
  function formatJSON(jsonString: string, space: number = 2): string | null {
    try {
      const result = parseJSONWithFunctions(jsonString)
      return stringifyWithFunctions(result.data, space)
    } catch {
      return null
    }
  }

  /**
   * Clear all state
   */
  function clear() {
    parsedData.value = null
    hasFunctions.value = false
    functionPaths.value = []
    parseError.value = null
    isValid.value = false
  }

  // Core parsing logic (can be used standalone without Vue)
  function parseJSONWithFunctions(jsonString: string): ParseResult {
    const paths: string[] = []
    let hasFunc = false

    const placeholderPrefix = '__FUNC_PLACEHOLDER_'
    const functionMap = new Map<string, string>()
    let functionIndex = 0

    // Helper function to extract functions with proper brace matching
    function extractFunctions(str: string): string {
      let result = str
      let lastResult = ''

      // Keep processing until no more functions are found
      while (result !== lastResult) {
        lastResult = result

        // Find function declarations with balanced braces
        const functionRegex = /function\s*\([^)]*\)\s*{/g
        let match

        while ((match = functionRegex.exec(result)) !== null) {
          const start = match.index + match[0].length
          let braceCount = 1
          let i = start

          // Count braces to find the end of the function
          while (i < result.length && braceCount > 0) {
            if (result[i] === '{') braceCount++
            else if (result[i] === '}') braceCount--
            i++
          }

          if (braceCount === 0) {
            const fullFunction = result.substring(match.index, i)
            const placeholder = `"${placeholderPrefix}${functionIndex++}"`
            functionMap.set(placeholder, fullFunction)
            hasFunc = true

            // Replace the function with placeholder
            result = result.substring(0, match.index) + placeholder + result.substring(i)
            break // Start over to find more functions
          }
        }

        // Find arrow functions with balanced braces
        const arrowRegex = /\([^)]*\)\s*=>\s*{/g

        while ((match = arrowRegex.exec(result)) !== null) {
          const start = match.index + match[0].length
          let braceCount = 1
          let i = start

          // Count braces to find the end of the function
          while (i < result.length && braceCount > 0) {
            if (result[i] === '{') braceCount++
            else if (result[i] === '}') braceCount--
            i++
          }

          if (braceCount === 0) {
            const fullFunction = result.substring(match.index, i)
            const placeholder = `"${placeholderPrefix}${functionIndex++}"`
            functionMap.set(placeholder, fullFunction)
            hasFunc = true

            // Replace the function with placeholder
            result = result.substring(0, match.index) + placeholder + result.substring(i)
            break // Start over to find more functions
          }
        }

        // Find simple arrow functions without braces
        const simpleArrowRegex = /\([^)]*\)\s*=>\s*[^,}\]]+(?=[,}\]])/g

        while ((match = simpleArrowRegex.exec(result)) !== null) {
          const placeholder = `"${placeholderPrefix}${functionIndex++}"`
          functionMap.set(placeholder, match[0])
          hasFunc = true

          // Replace the function with placeholder
          result = result.substring(0, match.index) + placeholder + result.substring(match.index + match[0].length)
          break // Start over to find more functions
        }
      }

      return result
    }

    let processedString = extractFunctions(jsonString)

    let parsedData: any
    try {
      parsedData = JSON.parse(processedString)
    } catch (error: any) {
      throw new Error(`Invalid JSON structure: ${error.message}`)
    }

    // Restore functions from placeholders
    function restoreFunctions(obj: any, path: string = ''): any {
      if (typeof obj === 'string' && obj.startsWith(placeholderPrefix)) {
        const placeholder = `"${obj}"`
        const functionString = functionMap.get(placeholder)
        if (functionString) {
          try {
            const func = new Function('return ' + functionString)()
            if (path) {
              paths.push(path)
            }
            return func
          } catch (error: any) {
            console.warn(`Failed to parse function at ${path}: ${error.message}`)
            return functionString
          }
        }
      }

      if (Array.isArray(obj)) {
        return obj.map((item, index) => restoreFunctions(item, path ? `${path}[${index}]` : `[${index}]`))
      }

      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const newPath = path ? `${path}.${key}` : key
            result[key] = restoreFunctions(obj[key], newPath)
          }
        }
        return result
      }

      return obj
    }

    const restoredData = restoreFunctions(parsedData)

    return {
      data: restoredData,
      hasFunctions: hasFunc,
      functionPaths: paths
    }
  }

  // Stringify with functions preserved
  function stringifyWithFunctions(obj: any, space?: number): string {
    const functionMap = new Map<string, Function>()
    let functionIndex = 0

    function replaceFunctions(obj: any): any {
      if (typeof obj === 'function') {
        const placeholder = `__FUNCTION_${functionIndex++}__`
        functionMap.set(placeholder, obj)
        return placeholder
      }

      if (Array.isArray(obj)) {
        return obj.map(replaceFunctions)
      }

      if (obj && typeof obj === 'object') {
        const result: any = {}
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            result[key] = replaceFunctions(obj[key])
          }
        }
        return result
      }

      return obj
    }

    const processedObj = replaceFunctions(obj)
    let jsonString = JSON.stringify(processedObj, null, space)

    functionMap.forEach((func, placeholder) => {
      const funcString = func.toString()
      jsonString = jsonString.replace(`"${placeholder}"`, funcString)
    })

    return jsonString
  }

  return {
    // Reactive state
    parsedData: parsedData as Readonly<Ref<any>>,
    hasFunctions: hasFunctions as Readonly<Ref<boolean>>,
    functionPaths: functionPaths as Readonly<Ref<string[]>>,
    parseError: parseError as Readonly<Ref<ParseError | null>>,
    isValid: isValid as Readonly<Ref<boolean>>,

    // Computed
    functionCount,
    hasError,

    // Methods
    parseJSON,
    validateJSON,
    stringifyJSON,
    formatJSON,
    clear,

    // Export core functions for non-Vue usage
    parseJSONWithFunctions,
    stringifyWithFunctions
  }
}