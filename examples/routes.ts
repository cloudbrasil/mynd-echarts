import type { RouteRecordRaw } from 'vue-router'

// Import views
import LineChart from './views/LineChart.vue'
import BarChart from './views/BarChart.vue'
import PieChart from './views/PieChart.vue'

// Lazy load other views
const ScatterChart = () => import('./views/ScatterChart.vue')
const AreaChart = () => import('./views/AreaChart.vue')
const RadarChart = () => import('./views/RadarChart.vue')
const HeatmapChart = () => import('./views/HeatmapChart.vue')
const BoxplotChart = () => import('./views/BoxplotChart.vue')
const CandlestickChart = () => import('./views/CandlestickChart.vue')
const FunnelChart = () => import('./views/FunnelChart.vue')
const GaugeChart = () => import('./views/GaugeChart.vue')
const TreeChart = () => import('./views/TreeChart.vue')
const TreemapChart = () => import('./views/TreemapChart.vue')
const SunburstChart = () => import('./views/SunburstChart.vue')
const GraphChart = () => import('./views/GraphChart.vue')
const SankeyChart = () => import('./views/SankeyChart.vue')
const ParallelChart = () => import('./views/ParallelChart.vue')
const ThemeRiverChart = () => import('./views/ThemeRiverChart.vue')
const LinesChart = () => import('./views/LinesChart.vue')
const MixedChart = () => import('./views/MixedChart.vue')
const CustomChart = () => import('./views/CustomChart.vue')
const OptionEditor = () => import('./views/OptionEditor.vue')
const PerformanceTest = () => import('./views/PerformanceTest.vue')
const Home = () => import('./views/Home.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/line',
    name: 'line',
    component: LineChart
  },
  {
    path: '/bar',
    name: 'bar',
    component: BarChart
  },
  {
    path: '/pie',
    name: 'pie',
    component: PieChart
  },
  {
    path: '/scatter',
    name: 'scatter',
    component: ScatterChart
  },
  {
    path: '/area',
    name: 'area',
    component: AreaChart
  },
  {
    path: '/radar',
    name: 'radar',
    component: RadarChart
  },
  {
    path: '/heatmap',
    name: 'heatmap',
    component: HeatmapChart
  },
  {
    path: '/boxplot',
    name: 'boxplot',
    component: BoxplotChart
  },
  {
    path: '/candlestick',
    name: 'candlestick',
    component: CandlestickChart
  },
  {
    path: '/funnel',
    name: 'funnel',
    component: FunnelChart
  },
  {
    path: '/gauge',
    name: 'gauge',
    component: GaugeChart
  },
  {
    path: '/tree',
    name: 'tree',
    component: TreeChart
  },
  {
    path: '/treemap',
    name: 'treemap',
    component: TreemapChart
  },
  {
    path: '/sunburst',
    name: 'sunburst',
    component: SunburstChart
  },
  {
    path: '/graph',
    name: 'graph',
    component: GraphChart
  },
  {
    path: '/sankey',
    name: 'sankey',
    component: SankeyChart
  },
  {
    path: '/parallel',
    name: 'parallel',
    component: ParallelChart
  },
  {
    path: '/themeriver',
    name: 'themeriver',
    component: ThemeRiverChart
  },
  {
    path: '/lines',
    name: 'lines',
    component: LinesChart
  },
  {
    path: '/mixed',
    name: 'mixed',
    component: MixedChart
  },
  {
    path: '/custom',
    name: 'custom',
    component: CustomChart
  },
  {
    path: '/editor',
    name: 'editor',
    component: OptionEditor
  },
  {
    path: '/performance',
    name: 'performance',
    component: PerformanceTest
  }
]