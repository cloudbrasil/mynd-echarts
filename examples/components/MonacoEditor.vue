<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import loader from '@monaco-editor/loader'
import type { editor } from 'monaco-editor'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: string
  theme?: string
  options?: editor.IStandaloneEditorConstructionOptions
  height?: string
  readOnly?: boolean
}>(), {
  language: 'json',
  theme: 'vs',
  height: '100%',
  readOnly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'validate': [markers: any[]]
}>()

const editorContainer = ref<HTMLElement>()
let monacoEditor: editor.IStandaloneCodeEditor | null = null

const initEditor = async () => {
  const monaco = await loader.init()
  
  if (!editorContainer.value) return
  
  // Configure JSON validation
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [{
      uri: 'http://myserver/echarts-schema.json',
      fileMatch: ['*'],
      schema: {
        type: 'object',
        properties: {
          title: { type: 'object' },
          legend: { type: 'object' },
          tooltip: { type: 'object' },
          xAxis: { type: ['object', 'array'] },
          yAxis: { type: ['object', 'array'] },
          series: { type: 'array' },
          grid: { type: ['object', 'array'] },
          dataZoom: { type: ['object', 'array'] }
        }
      }
    }]
  })
  
  monacoEditor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    renderWhitespace: 'selection',
    scrollBeyondLastLine: false,
    readOnly: props.readOnly,
    ...props.options
  })
  
  // Listen for content changes
  monacoEditor.onDidChangeModelContent(() => {
    const value = monacoEditor!.getValue()
    emit('update:modelValue', value)
    emit('change', value)
  })
  
  // Listen for validation markers
  monaco.editor.onDidChangeMarkers(() => {
    const model = monacoEditor!.getModel()
    if (model) {
      const markers = monaco.editor.getModelMarkers({ resource: model.uri })
      emit('validate', markers)
    }
  })
}

const updateValue = (newValue: string) => {
  if (monacoEditor && monacoEditor.getValue() !== newValue) {
    monacoEditor.setValue(newValue)
  }
}

const formatDocument = () => {
  if (monacoEditor) {
    monacoEditor.getAction('editor.action.formatDocument')?.run()
  }
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  updateValue(newValue)
})

// Watch for theme changes
watch(() => props.theme, (newTheme) => {
  if (monacoEditor) {
    loader.init().then(monaco => {
      monaco.editor.setTheme(newTheme)
    })
  }
})

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  if (monacoEditor) {
    monacoEditor.dispose()
  }
})

defineExpose({
  formatDocument,
  getEditor: () => monacoEditor
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: v-bind(height);
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
</style>