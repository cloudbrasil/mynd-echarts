import type { LocaleMessages } from './types'

export const zhCN: LocaleMessages = {
  configDialog: {
    title: '图表配置',
    sections: {
      title: '标题和副标题',
      legend: '图例',
      tooltip: '提示框',
      toolbox: '工具箱',
      grid: '网格和布局',
      xAxis: 'X 轴',
      yAxis: 'Y 轴',
      colors: '颜色',
      animation: '动画',
      language: '语言 / Language / Idioma'
    },
    fields: {
      // Title section
      titleText: '标题文本',
      subtitle: '副标题',
      position: '位置',
      textStyleColor: '文本颜色',
      fontSize: '字体大小',
      
      // Legend section
      showLegend: '显示图例',
      orientation: '方向',
      
      // Tooltip section
      showTooltip: '显示提示框',
      trigger: '触发器',
      formatter: '格式化器',
      formatterHelp: '使用占位符：{a} 系列名称，{b} 数据名称，{c} 数据值，{d} 百分比。示例：\'{b}: {c} ({d}%)\'',
      
      // Toolbox section
      showToolbox: '显示工具箱',
      iconSize: '图标大小',
      itemGap: '项目间隔',
      showTitleOnHover: '悬停时显示标题',
      features: '功能',
      
      // Toolbox features
      saveAsImage: '保存为图片',
      saveAsImageEnable: '启用',
      imageType: '图片类型',
      filename: '文件名',
      restore: '还原',
      restoreEnable: '启用',
      dataView: '数据视图',
      dataViewEnable: '启用',
      readOnly: '只读',
      dataZoom: '数据缩放',
      dataZoomEnable: '启用',
      magicType: '动态类型切换',
      magicTypeEnable: '启用',
      lineChart: '折线图',
      barChart: '柱状图',
      stack: '堆叠',
      tiled: '平铺',
      
      // Grid section
      leftMargin: '左边距',
      rightMargin: '右边距',
      topMargin: '上边距',
      bottomMargin: '下边距',
      containLabel: '包含标签',
      
      // Axis sections
      name: '名称',
      type: '类型',
      showAxisLine: '显示轴线',
      showSplitLine: '显示分割线',
      
      // Colors section
      colorPalette: '调色板',
      backgroundColor: '背景颜色',
      addColor: '添加颜色',
      
      // Animation section
      enableAnimation: '启用动画',
      animationDuration: '动画时长（毫秒）',
      animationEasing: '动画缓动',
      
      // Language section
      selectLanguage: '选择语言',
      
      // General
      enable: '启用'
    },
    positions: {
      left: '左',
      center: '中',
      right: '右',
      top: '上',
      middle: '中',
      bottom: '下'
    },
    orientations: {
      horizontal: '水平',
      vertical: '垂直'
    },
    triggerTypes: {
      item: '数据项',
      axis: '坐标轴',
      none: '无'
    },
    axisTypes: {
      value: '数值',
      category: '类目',
      time: '时间',
      log: '对数'
    },
    easingTypes: {
      linear: '线性',
      cubicIn: '三次方缓入',
      cubicOut: '三次方缓出',
      cubicInOut: '三次方缓入缓出',
      elasticOut: '弹性缓出',
      bounceOut: '弹跳缓出'
    },
    buttons: {
      reset: '重置',
      apply: '应用',
      close: '关闭',
      addColor: '添加颜色'
    },
    chartTypes: {
      line: '折线图',
      bar: '柱状图',
      stack: '堆叠',
      tiled: '平铺'
    },
    features: {
      saveAsImage: '保存为图片',
      restore: '还原',
      dataView: '数据视图',
      dataZoom: '数据缩放',
      magicType: '动态类型切换'
    },
    placeholders: {
      chartTitle: '图表标题',
      chartSubtitle: '图表副标题',
      formatterExample: '{b}: {c}',
      defaultFilename: 'chart',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'X轴名称',
      yAxisName: 'Y轴名称'
    },
    helpTexts: {
      formatter: '使用占位符：{a} 系列名称，{b} 数据名称，{c} 数据值，{d} 百分比。示例：\'{b}: {c} ({d}%)\'',
      languageChange: '更改图表配置中所有UI元素的语言'
    }
  },
  chart: {
    loading: '加载中...',
    noData: '暂无数据'
  }
}