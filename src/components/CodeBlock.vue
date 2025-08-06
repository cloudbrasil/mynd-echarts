<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-language">{{ language }}</span>
      <button class="copy-button" @click="copyCode" :class="{ copied: isCopied }">
        <span v-if="!isCopied" class="material-icons">content_copy</span>
        <span v-else class="material-icons">check</span>
        {{ isCopied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <pre class="code-content"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code: string
  language?: string
}>()

const isCopied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.code-block {
  margin: 1.5rem 0;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-primary, #ffffff);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary, #f5f6fa);
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

.code-language {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #718096);
  text-transform: uppercase;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 6px;
  color: var(--text-secondary, #718096);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.copy-button:hover {
  background: var(--bg-secondary, #f8f9fa);
  border-color: var(--border-color, #e2e8f0);
  color: var(--text-primary, #2c3e50);
}

.copy-button.copied {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.copy-button .material-icons {
  font-size: 1rem;
}

.code-content {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
  background: var(--bg-secondary, #f8f9fa);
}

.code-content code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-primary, #2c3e50);
}

/* Dark mode support */
:global(.dark) .code-block {
  background: var(--bg-primary);
}

:global(.dark) .code-content {
  background: var(--bg-secondary);
}

:global(.dark) .code-content code {
  color: var(--text-primary);
}
</style>