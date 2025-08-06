/**
 * @fileoverview Generic types and utility types for chart options
 * @module mynd-echarts/types/generics
 */

import type {
  EChartsOption,
  SeriesOption,
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  RadarSeriesOption,
  TreeSeriesOption,
  HeatmapSeriesOption,
  GraphSeriesOption,
  GaugeSeriesOption,
  FunnelSeriesOption,
  SankeySeriesOption,
  BoxplotSeriesOption,
  CandlestickSeriesOption,
  EffectScatterSeriesOption,
  LinesSeriesOption,
  TreemapSeriesOption,
  SunburstSeriesOption,
  MapSeriesOption,
  ParallelSeriesOption,
  ThemeRiverSeriesOption,
  PictorialBarSeriesOption,
  CustomSeriesOption,
  XAxisComponentOption,
  YAxisComponentOption,
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  DataZoomComponentOption
} from './echarts'

/**
 * Utility type to extract series types
 */
export type SeriesType = SeriesOption['type']

/**
 * Map of series type to series option
 */
export interface SeriesTypeMap {
  line: LineSeriesOption
  bar: BarSeriesOption
  pie: PieSeriesOption
  scatter: ScatterSeriesOption
  effectScatter: EffectScatterSeriesOption
  radar: RadarSeriesOption
  tree: TreeSeriesOption
  treemap: TreemapSeriesOption
  sunburst: SunburstSeriesOption
  boxplot: BoxplotSeriesOption
  candlestick: CandlestickSeriesOption
  heatmap: HeatmapSeriesOption
  map: MapSeriesOption
  parallel: ParallelSeriesOption
  lines: LinesSeriesOption
  graph: GraphSeriesOption
  sankey: SankeySeriesOption
  funnel: FunnelSeriesOption
  gauge: GaugeSeriesOption
  pictorialBar: PictorialBarSeriesOption
  themeRiver: ThemeRiverSeriesOption
  custom: CustomSeriesOption
}

/**
 * Generic type for creating typed chart options
 * @template T - The series type
 */
export type TypedChartOption<T extends keyof SeriesTypeMap> = Omit<EChartsOption, 'series'> & {
  series?: SeriesTypeMap[T] | SeriesTypeMap[T][]
}

/**
 * Generic type for creating multi-series chart options
 * @template T - Tuple of series types
 */
export type MultiSeriesChartOption<T extends readonly SeriesType[]> = Omit<EChartsOption, 'series'> & {
  series?: {
    [K in keyof T]: T[K] extends keyof SeriesTypeMap ? SeriesTypeMap[T[K]] : never
  }
}

/**
 * Utility type to make specific properties required
 * @template T - The base type
 * @template K - Keys to make required
 */
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Utility type to make specific properties optional
 * @template T - The base type
 * @template K - Keys to make optional
 */
export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Deep partial type
 * @template T - The type to make deeply partial
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

/**
 * Deep required type
 * @template T - The type to make deeply required
 */
export type DeepRequired<T> = T extends object ? {
  [P in keyof T]-?: DeepRequired<T[P]>
} : T

/**
 * Type for chart data item
 * @template T - The data type
 */
export type ChartDataItem<T = any> = T | [number, T] | { value: T; [key: string]: any }

/**
 * Type for chart data array
 * @template T - The data type
 */
export type ChartData<T = any> = ChartDataItem<T>[]

/**
 * Base configuration for axis charts (line, bar, etc.)
 */
export interface AxisChartConfig {
  xAxis?: XAxisComponentOption | XAxisComponentOption[]
  yAxis?: YAxisComponentOption | YAxisComponentOption[]
  grid?: GridComponentOption | GridComponentOption[]
}

/**
 * Base configuration for all charts
 */
export interface BaseChartConfig {
  title?: TitleComponentOption | TitleComponentOption[]
  legend?: LegendComponentOption
  tooltip?: TooltipComponentOption
  dataZoom?: DataZoomComponentOption | DataZoomComponentOption[]
  animation?: boolean
  animationDuration?: number
  animationEasing?: string
}

/**
 * Type for creating a line chart configuration
 */
export type LineChartConfig = BaseChartConfig & AxisChartConfig & {
  series: LineSeriesOption | LineSeriesOption[]
}

/**
 * Type for creating a bar chart configuration
 */
export type BarChartConfig = BaseChartConfig & AxisChartConfig & {
  series: BarSeriesOption | BarSeriesOption[]
}

/**
 * Type for creating a pie chart configuration
 */
export type PieChartConfig = BaseChartConfig & {
  series: PieSeriesOption | PieSeriesOption[]
}

/**
 * Type for creating a scatter chart configuration
 */
export type ScatterChartConfig = BaseChartConfig & AxisChartConfig & {
  series: ScatterSeriesOption | ScatterSeriesOption[]
}

/**
 * Type for creating a radar chart configuration
 */
export type RadarChartConfig = BaseChartConfig & {
  radar?: any // RadarComponentOption
  series: RadarSeriesOption | RadarSeriesOption[]
}

/**
 * Type for creating a gauge chart configuration
 */
export type GaugeChartConfig = BaseChartConfig & {
  series: GaugeSeriesOption | GaugeSeriesOption[]
}

/**
 * Utility type to extract data from series option
 * @template T - The series option type
 */
export type ExtractSeriesData<T> = T extends { data?: infer D } ? D : never

/**
 * Utility type to extract the type of a series
 * @template T - The series option type
 */
export type ExtractSeriesType<T> = T extends { type: infer Type } ? Type : never

/**
 * Type for theme colors
 */
export type ThemeColors = string[] | {
  color?: string[]
  backgroundColor?: string
  textStyle?: {
    color?: string
  }
}

/**
 * Type for responsive chart options
 */
export type ResponsiveChartOption = EChartsOption & {
  media?: Array<{
    query?: {
      minWidth?: number
      maxWidth?: number
      minHeight?: number
      maxHeight?: number
      minAspectRatio?: number
      maxAspectRatio?: number
    }
    option: EChartsOption
  }>
}

/**
 * Type helper for creating strongly typed event parameters
 * @template T - The event name
 */
export type ChartEventParams<T extends string> = {
  type: T
  // Add more specific event parameter types based on event name
  [key: string]: any
}

/**
 * Type for chart update options
 */
export interface ChartUpdateOptions {
  notMerge?: boolean
  lazyUpdate?: boolean
  silent?: boolean
  replaceMerge?: string | string[]
  transition?: {
    duration?: number
    easing?: string
    delay?: number
  }
}