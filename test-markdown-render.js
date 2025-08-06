import { parseMarkdown } from './src/utils/markdown.js'

const testMarkdown = `
# Getting Started

## Installation

\`\`\`bash
npm install @abernardobr/mynd-echarts echarts
\`\`\`

## Basic Usage

\`\`\`vue
<template>
  <MyndEcharts :options="chartOptions" />
</template>

<script setup>
import { MyndEcharts } from '@abernardobr/mynd-echarts'

const chartOptions = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }]
}
<\/script>
\`\`\`

### TypeScript Support

\`\`\`typescript
import type { EChartsOption } from '@abernardobr/mynd-echarts'

const options: EChartsOption = {
  title: { text: 'Sales Data' }
}
\`\`\`
`;

console.log('Testing markdown parser...\n');
const result = parseMarkdown(testMarkdown);
console.log('Parsed HTML:\n');
console.log(result);
console.log('\n\nLooking for code block mount points:');
const mountPoints = result.match(/code-block-mount-\d+/g);
console.log('Found mount points:', mountPoints);