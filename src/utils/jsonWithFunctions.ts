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

export function parseJSONWithFunctions(jsonString: string): ParseResult {
  const functionPaths: string[] = []
  let hasFunctions = false

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
          hasFunctions = true

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
          hasFunctions = true

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
        hasFunctions = true

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

  function restoreFunctions(obj: any, path: string = ''): any {
    if (typeof obj === 'string' && obj.startsWith(placeholderPrefix)) {
      const placeholder = `"${obj}"`
      const functionString = functionMap.get(placeholder)
      if (functionString) {
        try {
          const func = new Function('return ' + functionString)()
          if (path) {
            functionPaths.push(path)
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
    hasFunctions,
    functionPaths
  }
}

export function validateJSONWithFunctions(jsonString: string): ParseError | null {
  try {
    parseJSONWithFunctions(jsonString)
    return null
  } catch (error: any) {
    const errorMessage = error.message

    const lineMatch = errorMessage.match(/line (\d+)/)
    const columnMatch = errorMessage.match(/column (\d+)/)

    return {
      message: errorMessage,
      line: lineMatch ? parseInt(lineMatch[1]) : undefined,
      column: columnMatch ? parseInt(columnMatch[1]) : undefined
    }
  }
}

export function stringifyWithFunctions(obj: any, space?: number): string {
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