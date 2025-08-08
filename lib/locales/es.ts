import type { LocaleMessages } from './types'

export const es: LocaleMessages = {
  configDialog: {
    title: 'Configuración del Gráfico',
    sections: {
      title: 'Título y Subtítulo',
      legend: 'Leyenda',
      tooltip: 'Información Emergente',
      toolbox: 'Caja de Herramientas',
      grid: 'Cuadrícula y Diseño',
      xAxis: 'Eje X',
      yAxis: 'Eje Y',
      colors: 'Colores',
      animation: 'Animación',
      language: 'Idioma / Language / 语言'
    },
    fields: {
      // Title section
      titleText: 'Texto del Título',
      subtitle: 'Subtítulo',
      position: 'Posición',
      textStyleColor: 'Color del Texto',
      fontSize: 'Tamaño de Fuente',
      
      // Legend section
      showLegend: 'Mostrar Leyenda',
      orientation: 'Orientación',
      
      // Tooltip section
      showTooltip: 'Mostrar Información',
      trigger: 'Activador',
      formatter: 'Formateador',
      formatterHelp: 'Usar marcadores: {a} nombre de serie, {b} nombre de datos, {c} valor de datos, {d} porcentaje. Ejemplo: \'{b}: {c} ({d}%)\'',
      
      // Toolbox section
      showToolbox: 'Mostrar Herramientas',
      iconSize: 'Tamaño del Icono',
      itemGap: 'Espacio entre Elementos',
      showTitleOnHover: 'Mostrar Título al Pasar',
      features: 'Características',
      
      // Toolbox features
      saveAsImage: 'Guardar como Imagen',
      saveAsImageEnable: 'Habilitar',
      imageType: 'Tipo de Imagen',
      filename: 'Nombre de Archivo',
      restore: 'Restaurar',
      restoreEnable: 'Habilitar',
      dataView: 'Vista de Datos',
      dataViewEnable: 'Habilitar',
      readOnly: 'Solo Lectura',
      dataZoom: 'Zoom de Datos',
      dataZoomEnable: 'Habilitar',
      magicType: 'Cambio de Tipo',
      magicTypeEnable: 'Habilitar',
      lineChart: 'Gráfico de Líneas',
      barChart: 'Gráfico de Barras',
      stack: 'Apilar',
      tiled: 'Mosaico',
      
      // Grid section
      leftMargin: 'Margen Izquierdo',
      rightMargin: 'Margen Derecho',
      topMargin: 'Margen Superior',
      bottomMargin: 'Margen Inferior',
      containLabel: 'Contener Etiqueta',
      
      // Axis sections
      name: 'Nombre',
      type: 'Tipo',
      showAxisLine: 'Mostrar Línea del Eje',
      showSplitLine: 'Mostrar Línea Divisoria',
      
      // Colors section
      colorPalette: 'Paleta de Colores',
      backgroundColor: 'Color de Fondo',
      addColor: 'Agregar Color',
      
      // Animation section
      enableAnimation: 'Habilitar Animación',
      animationDuration: 'Duración de Animación (ms)',
      animationEasing: 'Suavizado de Animación',
      
      // Language section
      selectLanguage: 'Seleccionar Idioma',
      
      // General
      enable: 'Habilitar',
      displayStyle: 'Estilo de Visualización'
    },
    positions: {
      left: 'Izquierda',
      center: 'Centro',
      right: 'Derecha',
      top: 'Arriba',
      middle: 'Medio',
      bottom: 'Abajo'
    },
    orientations: {
      horizontal: 'Horizontal',
      vertical: 'Vertical'
    },
    triggerTypes: {
      item: 'Elemento',
      axis: 'Eje',
      none: 'Ninguno'
    },
    axisTypes: {
      value: 'Valor',
      category: 'Categoría',
      time: 'Tiempo',
      log: 'Logarítmico'
    },
    easingTypes: {
      linear: 'Lineal',
      cubicIn: 'Cúbico Entrada',
      cubicOut: 'Cúbico Salida',
      cubicInOut: 'Cúbico Entrada-Salida',
      elasticOut: 'Elástico Salida',
      bounceOut: 'Rebote Salida'
    },
    buttons: {
      reset: 'Reiniciar',
      apply: 'Aplicar',
      close: 'Cerrar',
      addColor: 'Agregar Color'
    },
    chartTypes: {
      line: 'Gráfico de Líneas',
      bar: 'Gráfico de Barras',
      stack: 'Apilar',
      tiled: 'Mosaico'
    },
    features: {
      saveAsImage: 'Guardar como Imagen',
      restore: 'Restaurar',
      dataView: 'Vista de Datos',
      dataZoom: 'Zoom de Datos',
      magicType: 'Cambio de Tipo'
    },
    placeholders: {
      chartTitle: 'Título del gráfico',
      chartSubtitle: 'Subtítulo del gráfico',
      formatterExample: '{b}: {c}',
      defaultFilename: 'gráfico',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'Nombre del Eje X',
      yAxisName: 'Nombre del Eje Y'
    },
    helpTexts: {
      formatter: 'Usar marcadores: {a} nombre de serie, {b} nombre de datos, {c} valor de datos, {d} porcentaje. Ejemplo: \'{b}: {c} ({d}%)}}\'',
      languageChange: 'Cambia el idioma para todos los elementos de la interfaz en la configuración del gráfico'
    },
    toolboxStyles: {
      menu: 'Menú',
      toolbar: 'Barra de herramientas'
    }
  },
  chart: {
    loading: 'Cargando...',
    noData: 'Sin datos'
  },
  dataView: {
    title: 'Vista de Datos',
    noData: 'No hay datos disponibles para mostrar',
    downloadCSV: 'Descargar CSV',
    copyToClipboard: 'Copiar al Portapapeles',
    close: 'Cerrar',
    category: 'Categoría',
    series: 'Serie',
    name: 'Nombre',
    value: 'Valor',
    index: 'Índice'
  },
  toolbox: {
    saveAsImage: 'Guardar como Imagen',
    restore: 'Restaurar',
    dataView: 'Vista de Datos',
    dataZoom: 'Zoom',
    magicType: 'Cambiar Tipo de Gráfico',
    brush: 'Selección con Pincel'
  }
}