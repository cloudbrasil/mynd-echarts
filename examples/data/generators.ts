/**
 * Data generators for all chart types
 */

// Utility functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min

// Date utilities
const generateDates = (count: number, interval: 'day' | 'month' | 'year' = 'day') => {
  const dates: string[] = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const date = new Date(now)
    if (interval === 'day') date.setDate(date.getDate() - (count - i - 1))
    else if (interval === 'month') date.setMonth(date.getMonth() - (count - i - 1))
    else date.setFullYear(date.getFullYear() - (count - i - 1))
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

// Category generators
const categories = {
  products: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
  regions: ['North', 'South', 'East', 'West', 'Central'],
  departments: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  quarters: ['Q1', 'Q2', 'Q3', 'Q4']
}

// Line Chart Data
export function generateLineData(series: number = 1, points: number = 12) {
  const xData = generateDates(points)
  const seriesData = []
  
  for (let i = 0; i < series; i++) {
    const baseValue = randomInt(20, 50)
    const data = []
    let prevValue = baseValue
    
    for (let j = 0; j < points; j++) {
      const change = randomFloat(-10, 15)
      prevValue = Math.max(0, prevValue + change)
      data.push(Math.round(prevValue * 100) / 100)
    }
    
    seriesData.push({
      name: `Series ${i + 1}`,
      type: 'line',
      data,
      smooth: Math.random() > 0.5
    })
  }
  
  return { xData, series: seriesData }
}

// Bar Chart Data
export function generateBarData(groups: number = 5, series: number = 2) {
  const xData = categories.products.slice(0, groups)
  const seriesData = []
  
  for (let i = 0; i < series; i++) {
    seriesData.push({
      name: `Series ${i + 1}`,
      type: 'bar',
      data: Array.from({ length: groups }, () => randomInt(20, 100))
    })
  }
  
  return { xData, series: seriesData }
}

// Pie Chart Data
export function generatePieData(slices: number = 5) {
  const names = categories.regions.slice(0, slices)
  const data = names.map(name => ({
    name,
    value: randomInt(100, 1000)
  }))
  
  return [{
    type: 'pie',
    radius: '50%',
    data
  }]
}

// Scatter Chart Data
export function generateScatterData(clusters: number = 3, pointsPerCluster: number = 50) {
  const seriesData = []
  
  for (let i = 0; i < clusters; i++) {
    const centerX = randomFloat(20, 80)
    const centerY = randomFloat(20, 80)
    const spread = randomFloat(5, 15)
    
    const data = Array.from({ length: pointsPerCluster }, () => [
      centerX + randomFloat(-spread, spread),
      centerY + randomFloat(-spread, spread),
      randomFloat(5, 50) // size
    ])
    
    seriesData.push({
      name: `Cluster ${i + 1}`,
      type: 'scatter',
      symbolSize: (data: number[]) => data[2],
      data
    })
  }
  
  return seriesData
}

// Radar Chart Data
export function generateRadarData() {
  const indicators = [
    { name: 'Sales', max: 100 },
    { name: 'Marketing', max: 100 },
    { name: 'Technology', max: 100 },
    { name: 'Support', max: 100 },
    { name: 'Development', max: 100 },
    { name: 'Administration', max: 100 }
  ]
  
  const data = [
    {
      name: 'Actual',
      value: indicators.map(() => randomInt(40, 90))
    },
    {
      name: 'Target',
      value: indicators.map(() => randomInt(60, 95))
    }
  ]
  
  return {
    radar: { indicator: indicators },
    series: [{
      type: 'radar',
      data
    }]
  }
}

// Heatmap Data
export function generateHeatmapData(xSize: number = 24, ySize: number = 7) {
  const hours = Array.from({ length: xSize }, (_, i) => `${i}:00`)
  const days = categories.days
  const data = []
  
  for (let i = 0; i < xSize; i++) {
    for (let j = 0; j < ySize; j++) {
      data.push([i, j, randomInt(0, 100)])
    }
  }
  
  return {
    xData: hours,
    yData: days,
    series: [{
      type: 'heatmap',
      data,
      label: { show: true }
    }]
  }
}

// Boxplot Data
export function generateBoxplotData(categories: number = 5) {
  const xData = categories.products.slice(0, categories)
  const data = []
  
  for (let i = 0; i < categories; i++) {
    const base = randomInt(20, 60)
    const values = Array.from({ length: 20 }, () => base + randomFloat(-20, 30))
    values.sort((a, b) => a - b)
    
    const min = values[0]
    const q1 = values[Math.floor(values.length * 0.25)]
    const median = values[Math.floor(values.length * 0.5)]
    const q3 = values[Math.floor(values.length * 0.75)]
    const max = values[values.length - 1]
    
    data.push([min, q1, median, q3, max])
  }
  
  return {
    xData,
    series: [{
      type: 'boxplot',
      data
    }]
  }
}

// Candlestick Data
export function generateCandlestickData(days: number = 30) {
  const dates = generateDates(days)
  const data = []
  let basePrice = 100
  
  for (let i = 0; i < days; i++) {
    const open = basePrice + randomFloat(-5, 5)
    const close = open + randomFloat(-10, 10)
    const low = Math.min(open, close) - randomFloat(0, 5)
    const high = Math.max(open, close) + randomFloat(0, 5)
    
    data.push([open, close, low, high])
    basePrice = close
  }
  
  return {
    xData: dates,
    series: [{
      type: 'candlestick',
      data
    }]
  }
}

// Funnel Chart Data
export function generateFunnelData() {
  const stages = ['Visit', 'Click', 'Inquiry', 'Order', 'Payment']
  let value = 1000
  
  const data = stages.map(name => {
    value *= randomFloat(0.6, 0.9)
    return { name, value: Math.round(value) }
  })
  
  return [{
    type: 'funnel',
    data
  }]
}

// Gauge Chart Data
export function generateGaugeData() {
  return [{
    type: 'gauge',
    detail: { formatter: '{value}%' },
    data: [{
      value: randomInt(0, 100),
      name: 'Progress'
    }]
  }]
}

// Sunburst Data
export function generateSunburstData() {
  const generateChildren = (name: string, level: number): any => {
    if (level > 2) return { name, value: randomInt(10, 100) }
    
    const childCount = randomInt(2, 4)
    const children = []
    
    for (let i = 0; i < childCount; i++) {
      children.push(generateChildren(`${name}-${i + 1}`, level + 1))
    }
    
    return { name, children }
  }
  
  return [{
    type: 'sunburst',
    data: [generateChildren('Root', 0)],
    radius: [0, '90%']
  }]
}

// Tree Data
export function generateTreeData() {
  const generateNode = (name: string, depth: number): any => {
    if (depth > 3) return { name }
    
    const childCount = randomInt(2, 4)
    const children = []
    
    for (let i = 0; i < childCount; i++) {
      children.push(generateNode(`${name}.${i + 1}`, depth + 1))
    }
    
    return { name, children }
  }
  
  return [{
    type: 'tree',
    data: [generateNode('Root', 0)],
    top: '1%',
    left: '7%',
    bottom: '1%',
    right: '20%',
    symbolSize: 7,
    label: {
      position: 'left',
      verticalAlign: 'middle',
      align: 'right'
    }
  }]
}

// Treemap Data
export function generateTreemapData() {
  const generateItems = (name: string, level: number): any => {
    if (level > 2) return { name, value: randomInt(100, 1000) }
    
    const childCount = randomInt(3, 6)
    const children = []
    
    for (let i = 0; i < childCount; i++) {
      children.push(generateItems(`${name}-${i + 1}`, level + 1))
    }
    
    return { name, children }
  }
  
  return [{
    type: 'treemap',
    data: [generateItems('Root', 0)]
  }]
}

// Graph Data
export function generateGraphData(nodes: number = 20, links: number = 30) {
  const nodeData = Array.from({ length: nodes }, (_, i) => ({
    id: `${i}`,
    name: `Node ${i}`,
    symbolSize: randomInt(10, 30),
    category: randomInt(0, 3)
  }))
  
  const linkData = []
  for (let i = 0; i < links; i++) {
    linkData.push({
      source: `${randomInt(0, nodes - 1)}`,
      target: `${randomInt(0, nodes - 1)}`
    })
  }
  
  return [{
    type: 'graph',
    layout: 'force',
    data: nodeData,
    links: linkData,
    categories: [
      { name: 'Category 1' },
      { name: 'Category 2' },
      { name: 'Category 3' },
      { name: 'Category 4' }
    ],
    roam: true,
    force: {
      repulsion: 100
    }
  }]
}

// Sankey Data
export function generateSankeyData() {
  const nodes = [
    { name: 'Source A' },
    { name: 'Source B' },
    { name: 'Source C' },
    { name: 'Process 1' },
    { name: 'Process 2' },
    { name: 'Result X' },
    { name: 'Result Y' },
    { name: 'Result Z' }
  ]
  
  const links = [
    { source: 'Source A', target: 'Process 1', value: randomInt(10, 50) },
    { source: 'Source B', target: 'Process 1', value: randomInt(10, 50) },
    { source: 'Source B', target: 'Process 2', value: randomInt(10, 50) },
    { source: 'Source C', target: 'Process 2', value: randomInt(10, 50) },
    { source: 'Process 1', target: 'Result X', value: randomInt(10, 40) },
    { source: 'Process 1', target: 'Result Y', value: randomInt(10, 40) },
    { source: 'Process 2', target: 'Result Y', value: randomInt(10, 40) },
    { source: 'Process 2', target: 'Result Z', value: randomInt(10, 40) }
  ]
  
  return [{
    type: 'sankey',
    data: nodes,
    links
  }]
}

// Parallel Data
export function generateParallelData() {
  const schema = [
    { name: 'Price', index: 0, text: 'Price' },
    { name: 'Net Weight', index: 1, text: 'Net Weight' },
    { name: 'Amount', index: 2, text: 'Amount' },
    { name: 'Score', index: 3, text: 'Score' },
    { name: 'Yield', index: 4, text: 'Yield' }
  ]
  
  const data = Array.from({ length: 20 }, () => [
    randomFloat(20, 100),
    randomFloat(10, 50),
    randomInt(50, 200),
    randomFloat(60, 95),
    randomFloat(1, 5)
  ])
  
  return {
    parallelAxis: schema.map((item, idx) => ({
      dim: idx,
      name: item.text
    })),
    series: [{
      type: 'parallel',
      data
    }]
  }
}

// ThemeRiver Data
export function generateThemeRiverData() {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E']
  const dates = generateDates(20)
  const data = []
  
  categories.forEach(category => {
    dates.forEach(date => {
      data.push([date, randomInt(10, 100), category])
    })
  })
  
  return [{
    type: 'themeRiver',
    data
  }]
}

// Lines Data (for trajectory/movement visualization)
export function generateLinesData() {
  const coords = [
    [120, 66], [122, 67], [125, 68], [127, 70], [130, 72],
    [133, 74], [135, 76], [138, 78], [140, 80], [142, 82]
  ]
  
  const linesData = Array.from({ length: 5 }, () => ({
    coords: coords.map(([x, y]) => [
      x + randomFloat(-5, 5),
      y + randomFloat(-5, 5)
    ])
  }))
  
  return [{
    type: 'lines',
    data: linesData,
    polyline: true,
    effect: {
      show: true,
      period: 6,
      trailLength: 0.7,
      symbolSize: 4
    }
  }]
}

// Area Chart Data
export function generateAreaData(points: number = 12) {
  const xData = categories.months.slice(0, points)
  const data1 = Array.from({ length: points }, () => randomInt(100, 300))
  const data2 = Array.from({ length: points }, () => randomInt(50, 200))
  
  return {
    xData,
    series: [
      {
        name: 'Series 1',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: data1
      },
      {
        name: 'Series 2',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: data2
      }
    ]
  }
}