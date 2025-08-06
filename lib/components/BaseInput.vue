<template>
  <div class="base-input" :class="{ 'has-icon': $slots.icon }">
    <label v-if="label" class="input-label" :for="inputId">{{ label }}</label>
    <div class="input-wrapper">
      <div v-if="$slots.icon" class="input-icon">
        <slot name="icon"></slot>
      </div>
      <input
        v-if="type !== 'textarea'"
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        @input="handleInput"
        @change="$emit('change', $event)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        class="input-field"
        :class="inputClass"
      />
      <textarea
        v-else
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        @input="handleInput"
        @change="$emit('change', $event)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        class="input-field textarea-field"
        :class="inputClass"
      ></textarea>
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix"></slot>
      </div>
    </div>
    <div v-if="helpText" class="input-help">{{ helpText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BaseInputProps {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  helpText?: string
  min?: number | string
  max?: number | string
  step?: number | string
  rows?: number
  inputClass?: string | string[] | Record<string, boolean>
  id?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  rows: 3
})

// Generate unique ID if not provided
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'input': [event: Event]
  'change': [event: Event]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
  emit('input', event)
}
</script>

<style scoped>
.base-input {
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  letter-spacing: 0.025em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-field {
  flex: 1;
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: var(--text-primary, #1e293b);
  background-color: var(--bg-primary, #ffffff);
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s ease;
}

.textarea-field {
  min-height: 5rem;
  padding: 0.75rem 1rem;
  resize: vertical;
}

.has-icon .input-field {
  padding-left: 3rem;
}

.input-icon {
  position: absolute;
  left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #64748b);
  pointer-events: none;
  z-index: 1;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
  color: var(--text-secondary, #64748b);
}

.input-field:hover:not(:disabled) {
  border-color: var(--border-hover, #cbd5e1);
}

.input-field:focus {
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--bg-disabled, #f8fafc);
}

.input-field::placeholder {
  color: var(--text-placeholder, #94a3b8);
}

.input-help {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-tertiary, #94a3b8);
  line-height: 1.5;
}

/* Dark mode support */
:global(.dark) .input-field {
  background-color: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #334155);
  color: var(--text-primary, #f1f5f9);
}

:global(.dark) .input-field:hover:not(:disabled) {
  border-color: var(--border-hover, #475569);
}

:global(.dark) .input-field:focus {
  border-color: var(--primary, #3b82f6);
}

:global(.dark) .input-field:disabled {
  background-color: var(--bg-disabled, #0f172a);
}

/* Special styling for color inputs */
.input-field[type="color"] {
  width: 3rem;
  height: 3rem;
  padding: 0.25rem;
  cursor: pointer;
}

.input-field[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.input-field[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 0.375rem;
}

/* Number input */
.input-field[type="number"] {
  -moz-appearance: textfield;
}

.input-field[type="number"]::-webkit-inner-spin-button,
.input-field[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>