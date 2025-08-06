import type { LocaleMessages } from './types'

export const ptBR: LocaleMessages = {
  configDialog: {
    title: 'Configuração do Gráfico',
    sections: {
      title: 'Título e Subtítulo',
      legend: 'Legenda',
      tooltip: 'Dica de Ferramenta',
      toolbox: 'Caixa de Ferramentas',
      grid: 'Grade e Layout',
      xAxis: 'Eixo X',
      yAxis: 'Eixo Y',
      colors: 'Cores',
      animation: 'Animação',
      language: 'Idioma / Language / 语言'
    },
    fields: {
      // Title section
      titleText: 'Texto do Título',
      subtitle: 'Subtítulo',
      position: 'Posição',
      textStyleColor: 'Cor do Texto',
      fontSize: 'Tamanho da Fonte',
      
      // Legend section
      showLegend: 'Mostrar Legenda',
      orientation: 'Orientação',
      
      // Tooltip section
      showTooltip: 'Mostrar Dica',
      trigger: 'Gatilho',
      formatter: 'Formatador',
      formatterHelp: 'Use marcadores: {a} nome da série, {b} nome do dado, {c} valor do dado, {d} porcentagem. Exemplo: \'{b}: {c} ({d}%)\'',
      
      // Toolbox section
      showToolbox: 'Mostrar Ferramentas',
      iconSize: 'Tamanho do Ícone',
      itemGap: 'Espaçamento entre Itens',
      showTitleOnHover: 'Mostrar Título ao Passar o Mouse',
      features: 'Recursos',
      
      // Toolbox features
      saveAsImage: 'Salvar como Imagem',
      saveAsImageEnable: 'Habilitar',
      imageType: 'Tipo de Imagem',
      filename: 'Nome do Arquivo',
      restore: 'Restaurar',
      restoreEnable: 'Habilitar',
      dataView: 'Visualizar Dados',
      dataViewEnable: 'Habilitar',
      readOnly: 'Somente Leitura',
      dataZoom: 'Zoom de Dados',
      dataZoomEnable: 'Habilitar',
      magicType: 'Alternar Tipo',
      magicTypeEnable: 'Habilitar',
      lineChart: 'Gráfico de Linha',
      barChart: 'Gráfico de Barras',
      stack: 'Empilhar',
      tiled: 'Lado a Lado',
      
      // Grid section
      leftMargin: 'Margem Esquerda',
      rightMargin: 'Margem Direita',
      topMargin: 'Margem Superior',
      bottomMargin: 'Margem Inferior',
      containLabel: 'Conter Rótulo',
      
      // Axis sections
      name: 'Nome',
      type: 'Tipo',
      showAxisLine: 'Mostrar Linha do Eixo',
      showSplitLine: 'Mostrar Linha Divisória',
      
      // Colors section
      colorPalette: 'Paleta de Cores',
      backgroundColor: 'Cor de Fundo',
      addColor: 'Adicionar Cor',
      
      // Animation section
      enableAnimation: 'Habilitar Animação',
      animationDuration: 'Duração da Animação (ms)',
      animationEasing: 'Suavização da Animação',
      
      // Language section
      selectLanguage: 'Selecionar Idioma',
      
      // General
      enable: 'Habilitar'
    },
    positions: {
      left: 'Esquerda',
      center: 'Centro',
      right: 'Direita',
      top: 'Topo',
      middle: 'Meio',
      bottom: 'Base'
    },
    orientations: {
      horizontal: 'Horizontal',
      vertical: 'Vertical'
    },
    triggerTypes: {
      item: 'Item',
      axis: 'Eixo',
      none: 'Nenhum'
    },
    axisTypes: {
      value: 'Valor',
      category: 'Categoria',
      time: 'Tempo',
      log: 'Logarítmico'
    },
    easingTypes: {
      linear: 'Linear',
      cubicIn: 'Cúbico Entrada',
      cubicOut: 'Cúbico Saída',
      cubicInOut: 'Cúbico Entrada-Saída',
      elasticOut: 'Elástico Saída',
      bounceOut: 'Quique Saída'
    },
    buttons: {
      reset: 'Redefinir',
      apply: 'Aplicar',
      close: 'Fechar',
      addColor: 'Adicionar Cor'
    },
    chartTypes: {
      line: 'Gráfico de Linha',
      bar: 'Gráfico de Barras',
      stack: 'Empilhar',
      tiled: 'Lado a Lado'
    },
    features: {
      saveAsImage: 'Salvar como Imagem',
      restore: 'Restaurar',
      dataView: 'Visualizar Dados',
      dataZoom: 'Zoom de Dados',
      magicType: 'Alternar Tipo'
    },
    placeholders: {
      chartTitle: 'Título do gráfico',
      chartSubtitle: 'Subtítulo do gráfico',
      formatterExample: '{b}: {c}',
      defaultFilename: 'grafico',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'Nome do Eixo X',
      yAxisName: 'Nome do Eixo Y'
    },
    helpTexts: {
      formatter: 'Use marcadores: {a} nome da série, {b} nome do dado, {c} valor do dado, {d} porcentagem. Exemplo: \'{b}: {c} ({d}%)}}\'',
      languageChange: 'Altera o idioma para todos os elementos da interface na configuração do gráfico'
    }
  },
  chart: {
    loading: 'Carregando...',
    noData: 'Sem dados'
  }
}