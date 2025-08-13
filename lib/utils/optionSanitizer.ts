import type { EChartsOption } from 'echarts';

/**
 * Non-destructive guard rails for options.
 * - Removes falsy/invalid series entries to avoid ECharts crashes on resize/render.
 * - Preserves original array/object shape for series.
 */
export function sanitizeOptions(input: EChartsOption): EChartsOption {
  const options: any = input as any;
  const out: any = { ...options };

  if (options && options.series != null) {
    if (Array.isArray(options.series)) {
      out.series = options.series.filter((s: any) => s && typeof s === 'object' && typeof s.type === 'string');
    } else if (typeof options.series === 'object') {
      const s = options.series as any;
      out.series = s && typeof s === 'object' && typeof s.type === 'string' ? s : undefined;
    }
  }

  return out as EChartsOption;
}
