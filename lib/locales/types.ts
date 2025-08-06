export interface LocaleMessages {
  configDialog: {
    title: string
    sections: {
      title: string
      legend: string
      tooltip: string
      toolbox: string
      grid: string
      xAxis: string
      yAxis: string
      colors: string
      animation: string
      language: string
    }
    fields: {
      // Title section
      titleText: string
      subtitle: string
      position: string
      textStyleColor: string
      fontSize: string
      
      // Legend section
      showLegend: string
      orientation: string
      
      // Tooltip section
      showTooltip: string
      trigger: string
      formatter: string
      formatterHelp: string
      
      // Toolbox section
      showToolbox: string
      iconSize: string
      itemGap: string
      showTitleOnHover: string
      features: string
      
      // Toolbox features
      saveAsImage: string
      saveAsImageEnable: string
      imageType: string
      filename: string
      restore: string
      restoreEnable: string
      dataView: string
      dataViewEnable: string
      readOnly: string
      dataZoom: string
      dataZoomEnable: string
      magicType: string
      magicTypeEnable: string
      lineChart: string
      barChart: string
      stack: string
      tiled: string
      
      // Grid section
      leftMargin: string
      rightMargin: string
      topMargin: string
      bottomMargin: string
      containLabel: string
      
      // Axis sections
      name: string
      type: string
      showAxisLine: string
      showSplitLine: string
      
      // Colors section
      colorPalette: string
      backgroundColor: string
      addColor: string
      
      // Animation section
      enableAnimation: string
      animationDuration: string
      animationEasing: string
      
      // Language section
      selectLanguage: string
      
      // General
      enable: string
    }
    positions: {
      left: string
      center: string
      right: string
      top: string
      middle: string
      bottom: string
    }
    orientations: {
      horizontal: string
      vertical: string
    }
    triggerTypes: {
      item: string
      axis: string
      none: string
    }
    axisTypes: {
      value: string
      category: string
      time: string
      log: string
    }
    easingTypes: {
      linear: string
      cubicIn: string
      cubicOut: string
      cubicInOut: string
      elasticOut: string
      bounceOut: string
    }
    buttons: {
      reset: string
      apply: string
      close: string
      addColor: string
    }
    chartTypes: {
      line: string
      bar: string
      stack: string
      tiled: string
    }
    features: {
      saveAsImage: string
      restore: string
      dataView: string
      dataZoom: string
      magicType: string
    }
    placeholders: {
      chartTitle: string
      chartSubtitle: string
      formatterExample: string
      defaultFilename: string
      marginExample: string
      pixelValue: string
      xAxisName: string
      yAxisName: string
    }
    helpTexts: {
      formatter: string
      languageChange: string
    }
  }
  chart: {
    loading: string
    noData: string
  }
}

export type SupportedLocale = 
  | 'en'
  | 'zh-CN'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'ko'
  | 'pt'
  | 'pt-BR'
  | 'ru'
  | 'it'
  | 'nl'
  | 'pl'
  | 'tr'
  | 'ar'
  | 'he'
  | 'th'
  | 'vi'
  | 'id'
  | 'hi'
  | 'cs'
  | 'sk'
  | 'uk'
  | 'sv'
  | 'no'
  | 'da'
  | 'fi'
  | 'el'
  | 'hu'
  | 'ro'