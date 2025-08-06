<template>
  <label class="base-checkbox" :class="{ disabled }" :for="checkboxId">
    <input
      :id="checkboxId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="checkbox-input"
      v-bind="$attrs"
    />
    <div class="checkbox-box">
      <svg v-if="modelValue" class="checkbox-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
    <span v-if="label" class="checkbox-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

interface BaseCheckboxProps {
  modelValue: boolean
  label?: string
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<BaseCheckboxProps>(), {
  label: '',
  disabled: false
})

// Generate unique ID if not provided
const checkboxId = computed(() => props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [event: Event]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', event)
}
</script>

<style scoped>
.base-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.base-checkbox.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-box {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 0.375rem;
  background-color: var(--bg-primary, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-box {
  background-color: var(--primary, #3b82f6);
  border-color: var(--primary, #3b82f6);
}

.checkbox-input:focus + .checkbox-box {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.base-checkbox:hover:not(.disabled) .checkbox-box {
  border-color: var(--primary, #3b82f6);
}

.checkbox-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: white;
}

.checkbox-label {
  font-size: 0.9375rem;
  color: var(--text-primary, #1e293b);
  line-height: 1.5;
}

/* Dark mode support */
:global(.dark) .checkbox-box {
  background-color: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #334155);
}

:global(.dark) .checkbox-label {
  color: var(--text-primary, #f1f5f9);
}
</style>