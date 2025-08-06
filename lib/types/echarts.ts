/**
 * @fileoverview Re-export all ECharts types for convenient access
 * @module mynd-echarts/types/echarts
 */

// Core ECharts types
export type {
  ECharts,
  EChartsOption,
  SetOptionOpts,
  ResizeOpts,
  EChartsInitOpts,
  ElementEvent,
  ECElementEvent,
  Payload,
  DefaultLabelFormatterCallbackParams,
  AnimationDelayCallback,
  AnimationDurationCallback,
  RegisteredSeriesOption,
  SeriesOption,
  ComposeOption
} from 'echarts'

// Chart type options
export type {
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  EffectScatterSeriesOption,
  RadarSeriesOption,
  TreeSeriesOption,
  TreemapSeriesOption,
  SunburstSeriesOption,
  BoxplotSeriesOption,
  CandlestickSeriesOption,
  HeatmapSeriesOption,
  MapSeriesOption,
  ParallelSeriesOption,
  LinesSeriesOption,
  GraphSeriesOption,
  SankeySeriesOption,
  FunnelSeriesOption,
  GaugeSeriesOption,
  PictorialBarSeriesOption,
  ThemeRiverSeriesOption,
  CustomSeriesOption
} from 'echarts/charts'

// Component options
export type {
  TitleComponentOption,
  LegendComponentOption,
  GridComponentOption,
  PolarComponentOption,
  RadarComponentOption,
  DataZoomComponentOption,
  VisualMapComponentOption,
  TooltipComponentOption,
  AxisPointerComponentOption,
  ToolboxComponentOption,
  BrushComponentOption,
  GeoComponentOption,
  ParallelComponentOption,
  TimelineComponentOption,
  GraphicComponentOption,
  CalendarComponentOption,
  SingleAxisComponentOption,
  MarkPointComponentOption,
  MarkLineComponentOption,
  MarkAreaComponentOption,
  AriaComponentOption,
  DatasetComponentOption
} from 'echarts/components'

