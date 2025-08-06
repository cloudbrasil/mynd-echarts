import type { LocaleMessages } from './types'

export const de: LocaleMessages = {
  configDialog: {
    title: 'Diagrammkonfiguration',
    sections: {
      title: 'Titel & Untertitel',
      legend: 'Legende',
      tooltip: 'Tooltip',
      toolbox: 'Werkzeugkasten',
      grid: 'Raster & Layout',
      xAxis: 'X-Achse',
      yAxis: 'Y-Achse',
      colors: 'Farben',
      animation: 'Animation',
      language: 'Sprache / Language / 语言'
    },
    fields: {
      // Title section
      titleText: 'Titeltext',
      subtitle: 'Untertitel',
      position: 'Position',
      textStyleColor: 'Textstilfarbe',
      fontSize: 'Schriftgröße',
      
      // Legend section
      showLegend: 'Legende anzeigen',
      orientation: 'Ausrichtung',
      
      // Tooltip section
      showTooltip: 'Tooltip anzeigen',
      trigger: 'Auslöser',
      formatter: 'Formatierung',
      formatterHelp: 'Platzhalter verwenden: {a} Serienname, {b} Datenname, {c} Datenwert, {d} Prozentsatz. Beispiel: \'{b}: {c} ({d}%)\'',
      
      // Toolbox section
      showToolbox: 'Werkzeugkasten anzeigen',
      iconSize: 'Symbolgröße',
      itemGap: 'Elementabstand',
      showTitleOnHover: 'Titel beim Überfahren anzeigen',
      features: 'Funktionen',
      
      // Toolbox features
      saveAsImage: 'Als Bild speichern',
      saveAsImageEnable: 'Aktivieren',
      imageType: 'Bildtyp',
      filename: 'Dateiname',
      restore: 'Wiederherstellen',
      restoreEnable: 'Aktivieren',
      dataView: 'Datenansicht',
      dataViewEnable: 'Aktivieren',
      readOnly: 'Schreibgeschützt',
      dataZoom: 'Datenzoom',
      dataZoomEnable: 'Aktivieren',
      magicType: 'Diagrammtyp wechseln',
      magicTypeEnable: 'Aktivieren',
      lineChart: 'Liniendiagramm',
      barChart: 'Balkendiagramm',
      stack: 'Stapel',
      tiled: 'Gekachelt',
      
      // Grid section
      leftMargin: 'Linker Rand',
      rightMargin: 'Rechter Rand',
      topMargin: 'Oberer Rand',
      bottomMargin: 'Unterer Rand',
      containLabel: 'Beschriftung enthalten',
      
      // Axis sections
      name: 'Name',
      type: 'Typ',
      showAxisLine: 'Achsenlinie anzeigen',
      showSplitLine: 'Trennlinie anzeigen',
      
      // Colors section
      colorPalette: 'Farbpalette',
      backgroundColor: 'Hintergrundfarbe',
      addColor: 'Farbe hinzufügen',
      
      // Animation section
      enableAnimation: 'Animation aktivieren',
      animationDuration: 'Animationsdauer (ms)',
      animationEasing: 'Animations-Easing',
      
      // Language section
      selectLanguage: 'Sprache auswählen',
      
      // General
      enable: 'Aktivieren'
    },
    positions: {
      left: 'Links',
      center: 'Mitte',
      right: 'Rechts',
      top: 'Oben',
      middle: 'Mitte',
      bottom: 'Unten'
    },
    orientations: {
      horizontal: 'Horizontal',
      vertical: 'Vertikal'
    },
    triggerTypes: {
      item: 'Element',
      axis: 'Achse',
      none: 'Keine'
    },
    axisTypes: {
      value: 'Wert',
      category: 'Kategorie',
      time: 'Zeit',
      log: 'Logarithmisch'
    },
    easingTypes: {
      linear: 'Linear',
      cubicIn: 'Kubisch Ein',
      cubicOut: 'Kubisch Aus',
      cubicInOut: 'Kubisch Ein-Aus',
      elasticOut: 'Elastisch Aus',
      bounceOut: 'Sprung Aus'
    },
    buttons: {
      reset: 'Zurücksetzen',
      apply: 'Anwenden',
      close: 'Schließen',
      addColor: 'Farbe hinzufügen'
    },
    chartTypes: {
      line: 'Liniendiagramm',
      bar: 'Balkendiagramm',
      stack: 'Stapel',
      tiled: 'Gekachelt'
    },
    features: {
      saveAsImage: 'Als Bild speichern',
      restore: 'Wiederherstellen',
      dataView: 'Datenansicht',
      dataZoom: 'Datenzoom',
      magicType: 'Diagrammtyp wechseln'
    },
    placeholders: {
      chartTitle: 'Diagrammtitel',
      chartSubtitle: 'Diagrammuntertitel',
      formatterExample: '{b}: {c}',
      defaultFilename: 'diagramm',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'X-Achsenname',
      yAxisName: 'Y-Achsenname'
    },
    helpTexts: {
      formatter: 'Platzhalter verwenden: {a} Serienname, {b} Datenname, {c} Datenwert, {d} Prozentsatz. Beispiel: \'{b}: {c} ({d}%)\'',
      languageChange: 'Ändert die Sprache für alle UI-Elemente in der Diagrammkonfiguration'
    }
  },
  chart: {
    loading: 'Laden...',
    noData: 'Keine Daten'
  }
}