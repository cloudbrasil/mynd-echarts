# JSON with Functions Parser

A utility for parsing JSON strings that contain JavaScript functions, perfect for working with ECharts configurations and other libraries that use functions in their configuration objects.

## Features

- ✅ Parse JSON strings containing JavaScript functions
- ✅ Support for regular functions: `function(params) { ... }`
- ✅ Support for arrow functions: `(params) => { ... }`
- ✅ Support for nested functions in deep object structures
- ✅ Proper handling of balanced braces
- ✅ Available as Vue 3 composable or standalone utility
- ✅ TypeScript support

## Installation

Copy one of the following files to your project:

### For Vue 3 projects:
```typescript
// Copy src/composables/useJSONWithFunctions.ts to your project
```

### For any JavaScript/TypeScript project:
```typescript
// Copy src/utils/jsonWithFunctions.standalone.ts to your project
```

## Usage

### Vue 3 Composable

```vue
<template>
  <div>
    <textarea v-model="jsonInput" @input="handleParse" />

    <div v-if="isValid">
      ✅ Valid JSON
      <span v-if="hasFunctions">
        Functions detected: {{ functionCount }}
      </span>
    </div>

    <div v-if="hasError">
      ❌ {{ parseError?.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJSONWithFunctions } from '@/composables/useJSONWithFunctions'

const jsonInput = ref('')

const {
  parsedData,
  hasFunctions,
  functionCount,
  isValid,
  hasError,
  parseError,
  parseJSON,
  formatJSON
} = useJSONWithFunctions()

function handleParse() {
  parseJSON(jsonInput.value)
}

function handleFormat() {
  const formatted = formatJSON(jsonInput.value)
  if (formatted) {
    jsonInput.value = formatted
  }
}
</script>
```

### Standalone Usage (No Vue Required)

```typescript
import { JSONWithFunctions } from './jsonWithFunctions.standalone'

// Parse JSON with functions
const jsonString = `{
  "tooltip": {
    "formatter": function(params) {
      return params[0].name + ': ' + params[0].value;
    }
  },
  "yAxis": {
    "axisLabel": {
      "formatter": function(value) {
        return '$' + value + 'k';
      }
    }
  }
}`

// Parse the JSON
const result = JSONWithFunctions.parse(jsonString)

console.log(result.hasFunctions) // true
console.log(result.functionPaths) // ['tooltip.formatter', 'yAxis.axisLabel.formatter']

// Use the parsed data
const tooltip = result.data.tooltip.formatter({ name: 'Test', value: 100 })
console.log(tooltip) // "Test: 100"

// Stringify back to JSON with functions
const stringified = JSONWithFunctions.stringify(result.data, 2)
console.log(stringified) // Original JSON with functions preserved

// Format JSON (parse and re-stringify with indentation)
const formatted = JSONWithFunctions.format(jsonString, 2)

// Validate JSON
const error = JSONWithFunctions.validate(jsonString)
if (error) {
  console.error(`Invalid JSON at line ${error.line}: ${error.message}`)
}
```

### ECharts Example

```typescript
import { JSONWithFunctions } from './jsonWithFunctions.standalone'
import * as echarts from 'echarts'

// ECharts config with functions as string
const configString = `{
  "title": {
    "text": "Sales Dashboard"
  },
  "tooltip": {
    "trigger": "axis",
    "formatter": function(params) {
      const value = params[0].value;
      return \`<div>
        <strong>\${params[0].name}</strong><br/>
        Sales: $\${(value * 1000).toLocaleString()}<br/>
        Status: \${value > 500 ? '🎯 Target Met' : '📈 Below Target'}
      </div>\`;
    }
  },
  "series": [{
    "type": "bar",
    "data": [320, 430, 380, 520],
    "itemStyle": {
      "color": function(params) {
        return params.value > 400 ? '#67C23A' : '#F56C6C';
      }
    }
  }]
}`

// Parse and use with ECharts
const parsed = JSONWithFunctions.parse(configString)
const chart = echarts.init(document.getElementById('chart'))
chart.setOption(parsed.data)
```

## API Reference

### Vue Composable: `useJSONWithFunctions()`

#### Reactive State
- `parsedData`: The parsed JavaScript object
- `hasFunctions`: Boolean indicating if functions were found
- `functionPaths`: Array of paths where functions were found
- `parseError`: Error object if parsing failed
- `isValid`: Boolean indicating if the JSON is valid
- `functionCount`: Computed count of functions
- `hasError`: Computed boolean for error state

#### Methods
- `parseJSON(jsonString)`: Parse JSON string with functions
- `validateJSON(jsonString)`: Validate without throwing errors
- `stringifyJSON(obj, space?)`: Convert object back to JSON string
- `formatJSON(jsonString, space?)`: Format JSON with indentation
- `clear()`: Clear all state

### Standalone Class: `JSONWithFunctions`

#### Static Methods
- `parse(jsonString)`: Parse JSON and return ParseResult
- `stringify(obj, space?)`: Convert object to JSON string
- `validate(jsonString)`: Validate and return error or null
- `format(jsonString, space?)`: Format with proper indentation

## Use Cases

- 📊 **ECharts Configurations**: Parse chart configs with formatter functions
- 🎨 **Dynamic Styling**: Parse style configs with computed functions
- 📝 **Template Systems**: Parse templates with embedded logic
- 🔧 **Configuration Files**: Support functions in JSON configs
- 🚀 **API Responses**: Handle JSON responses that include functions

## Security Notes

⚠️ This parser uses the `Function` constructor to evaluate function strings. While safer than `eval()`, you should:

- Only parse JSON from trusted sources
- Validate and sanitize input when accepting user-provided JSON
- Be aware that parsed functions run in the global scope
- Consider using a sandbox environment for untrusted input

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript features
- Function constructor
- Template literals (for template string functions)

## License

MIT