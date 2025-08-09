#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Components that need updating
const components = [
  'ConfigDialog.vue',
  'DataViewDialog.vue',
  'BaseInput.vue',
  'BaseSelect.vue',
  'BaseCheckbox.vue'
];

// Update each component
components.forEach(filename => {
  const filePath = path.join(__dirname, 'lib/components', filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add isDarkMode prop to template root element
  const templateMatch = content.match(/<template>\s*\n\s*<(\w+)([^>]*?)>/);
  if (templateMatch) {
    const tag = templateMatch[1];
    const attrs = templateMatch[2];
    
    // Check if main element has a class that starts with mynd-echarts
    if (!attrs.includes(':data-theme=')) {
      // Add data-theme attribute
      const newTag = `<template>\n  <${tag}${attrs} :data-theme="isDarkMode ? 'dark' : 'light'">`;
      content = content.replace(/<template>\s*\n\s*<(\w+)([^>]*?)>/, newTag);
    }
  }
  
  // Add isDarkMode prop to props interface or defineProps
  if (content.includes('interface') && content.includes('Props')) {
    // TypeScript style
    const propsMatch = content.match(/interface\s+\w*Props\s*{([^}]*)}/);
    if (propsMatch && !propsMatch[1].includes('isDarkMode')) {
      const newProps = propsMatch[0].replace('}', '  isDarkMode?: boolean\n}');
      content = content.replace(propsMatch[0], newProps);
    }
  } else if (content.includes('defineProps')) {
    // Look for defineProps
    const definePropsMatch = content.match(/defineProps<{([^}]*)}>|defineProps\({([^}]*)}\)/);
    if (definePropsMatch && !content.includes('isDarkMode')) {
      // Add isDarkMode to props
      if (content.includes('defineProps<{')) {
        content = content.replace(/defineProps<{/, 'defineProps<{\n  isDarkMode?: boolean,');
      } else if (content.includes('defineProps({')) {
        content = content.replace(/defineProps\({/, 'defineProps({\n  isDarkMode: { type: Boolean, default: false },');
      }
    }
  }
  
  // Replace :global(.dark) with data-theme selectors
  content = content.replace(/:global\(\.dark\)\s+\./g, '.[data-theme="dark"] .');
  content = content.replace(/:global\(\.dark\)\s+/g, '[data-theme="dark"] ');
  
  // Write back
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filename}`);
});

console.log('Done!');