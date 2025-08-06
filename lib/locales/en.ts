import type { LocaleMessages } from './types'

export const en: LocaleMessages = {
  configDialog: {
    title: 'Chart Configuration',
    sections: {
      title: 'Title & Subtitle',
      legend: 'Legend',
      tooltip: 'Tooltip',
      toolbox: 'Toolbox',
      grid: 'Grid & Layout',
      xAxis: 'X Axis',
      yAxis: 'Y Axis',
      colors: 'Colors',
      animation: 'Animation',
      language: 'Language / 语言 / Idioma'
    },
    fields: {
      // Title section
      titleText: 'Title Text',
      subtitle: 'Subtitle',
      position: 'Position',
      textStyleColor: 'Text Style Color',
      fontSize: 'Font Size',
      
      // Legend section
      showLegend: 'Show Legend',
      orientation: 'Orientation',
      
      // Tooltip section
      showTooltip: 'Show Tooltip',
      trigger: 'Trigger',
      formatter: 'Formatter',
      formatterHelp: 'Use placeholders: {a} series name, {b} data name, {c} data value, {d} percentage. Example: \'{b}: {c} ({d}%)\'',
      
      // Toolbox section
      showToolbox: 'Show Toolbox',
      iconSize: 'Icon Size',
      itemGap: 'Item Gap',
      showTitleOnHover: 'Show Title on Hover',
      features: 'Features',
      
      // Toolbox features
      saveAsImage: 'Save as Image',
      saveAsImageEnable: 'Enable',
      imageType: 'Image Type',
      filename: 'Filename',
      restore: 'Restore',
      restoreEnable: 'Enable',
      dataView: 'Data View',
      dataViewEnable: 'Enable',
      readOnly: 'Read Only',
      dataZoom: 'Data Zoom',
      dataZoomEnable: 'Enable',
      magicType: 'Magic Type (Chart Switcher)',
      magicTypeEnable: 'Enable',
      lineChart: 'Line Chart',
      barChart: 'Bar Chart',
      stack: 'Stack',
      tiled: 'Tiled',
      
      // Grid section
      leftMargin: 'Left Margin',
      rightMargin: 'Right Margin',
      topMargin: 'Top Margin',
      bottomMargin: 'Bottom Margin',
      containLabel: 'Contain Label',
      
      // Axis sections
      name: 'Name',
      type: 'Type',
      showAxisLine: 'Show Axis Line',
      showSplitLine: 'Show Split Line',
      
      // Colors section
      colorPalette: 'Color Palette',
      backgroundColor: 'Background Color',
      addColor: 'Add Color',
      
      // Animation section
      enableAnimation: 'Enable Animation',
      animationDuration: 'Animation Duration (ms)',
      animationEasing: 'Animation Easing',
      
      // Language section
      selectLanguage: 'Select Language',
      
      // General
      enable: 'Enable'
    },
    positions: {
      left: 'Left',
      center: 'Center',
      right: 'Right',
      top: 'Top',
      middle: 'Middle',
      bottom: 'Bottom'
    },
    orientations: {
      horizontal: 'Horizontal',
      vertical: 'Vertical'
    },
    triggerTypes: {
      item: 'Item',
      axis: 'Axis',
      none: 'None'
    },
    axisTypes: {
      value: 'Value',
      category: 'Category',
      time: 'Time',
      log: 'Log'
    },
    easingTypes: {
      linear: 'Linear',
      cubicIn: 'Cubic In',
      cubicOut: 'Cubic Out',
      cubicInOut: 'Cubic In Out',
      elasticOut: 'Elastic Out',
      bounceOut: 'Bounce Out'
    },
    buttons: {
      reset: 'Reset',
      apply: 'Apply',
      close: 'Close',
      addColor: 'Add Color'
    },
    chartTypes: {
      line: 'Line Chart',
      bar: 'Bar Chart',
      stack: 'Stack',
      tiled: 'Tiled'
    },
    features: {
      saveAsImage: 'Save as Image',
      restore: 'Restore',
      dataView: 'Data View',
      dataZoom: 'Data Zoom',
      magicType: 'Magic Type (Chart Switcher)'
    },
    placeholders: {
      chartTitle: 'Chart title',
      chartSubtitle: 'Chart subtitle',
      formatterExample: '{b}: {c}',
      defaultFilename: 'chart',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'X Axis Name',
      yAxisName: 'Y Axis Name'
    },
    helpTexts: {
      formatter: 'Use placeholders: {a} series name, {b} data name, {c} data value, {d} percentage. Example: \'{b}: {c} ({d}%)}\'',
      languageChange: 'Changes the language for all UI elements in the chart configuration'
    }
  },
  chart: {
    loading: 'Loading...',
    noData: 'No data'
  }
}