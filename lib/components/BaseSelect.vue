<template>
  <div class="base-select">
    <label v-if="label" class="select-label" :for="selectId">{{ label }}</label>
    <div class="select-wrapper">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        @change="handleChange"
        class="select-field"
        :class="selectClass"
        v-bind="$attrs"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      <div class="select-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div v-if="helpText" class="select-help">{{ helpText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

type OptionType = string | number | { label: string; value: string | number }

interface BaseSelectProps {
  modelValue?: string | number
  options: OptionType[]
  label?: string
  placeholder?: string
  disabled?: boolean
  helpText?: string
  selectClass?: string | string[] | Record<string, boolean>
  id?: string
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  disabled: false
})

// Generate unique ID if not provided
const selectId = computed(() => props.id || `select-${Math.random().toString(36).substring(2, 9)}`)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'change': [event: Event]
}>()

const getOptionValue = (option: OptionType): string | number => {
  if (typeof option === 'object' && option !== null) {
    return option.value
  }
  return option
}

const getOptionLabel = (option: OptionType): string => {
  if (typeof option === 'object' && option !== null) {
    return option.label
  }
  return String(option)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', event)
}
</script>

<style scoped>
.base-select {
  width: 100%;
}

.select-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  letter-spacing: 0.025em;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-field {
  width: 100%;
  height: 3rem;
  padding: 0 3rem 0 1rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: var(--text-primary, #1e293b);
  background-color: var(--bg-primary, #ffffff);
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 0.5rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-field:hover:not(:disabled) {
  border-color: var(--border-hover, #cbd5e1);
}

.select-field:focus {
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--bg-disabled, #f8fafc);
}

.select-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-secondary, #64748b);
}

.select-help {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-tertiary, #94a3b8);
  line-height: 1.5;
}

/* Dark mode support */
:global(.dark) .select-field {
  background-color: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #334155);
  color: var(--text-primary, #f1f5f9);
}

:global(.dark) .select-field:hover:not(:disabled) {
  border-color: var(--border-hover, #475569);
}

:global(.dark) .select-field:focus {
  border-color: var(--primary, #3b82f6);
}

:global(.dark) .select-field:disabled {
  background-color: var(--bg-disabled, #0f172a);
}
</style>