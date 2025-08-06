import type { LocaleMessages } from './types'

export const it: LocaleMessages = {
  configDialog: {
    title: 'Configurazione del grafico',
    sections: {
      title: 'Titolo',
      legend: 'Legenda',
      tooltip: 'Suggerimento',
      toolbox: 'Strumenti',
      grid: 'Griglia e layout',
      xAxis: 'Asse X',
      yAxis: 'Asse Y',
      colors: 'Colori',
      animation: 'Animazione',
      language: 'Lingua / Language / 语言'
    },
    fields: {
      titleText: 'Testo del titolo',
      subtitle: 'Sottotitolo',
      position: 'Posizione',
      textStyleColor: 'Colore stile testo',
      fontSize: 'Dimensione carattere',
      showLegend: 'Mostra legenda',
      orientation: 'Orientamento',
      showTooltip: 'Mostra suggerimento',
      trigger: 'Attivatore',
      formatter: 'Formattatore',
      showToolbox: 'Mostra strumenti',
      iconSize: 'Dimensione icone',
      itemGap: 'Spaziatura elementi',
      showTitleOnHover: 'Mostra titolo al passaggio del mouse',
      features: 'Funzionalità',
      enable: 'Abilita',
      imageType: 'Tipo immagine',
      filename: 'Nome file',
      readOnly: 'Solo lettura',
      leftMargin: 'Margine sinistro',
      rightMargin: 'Margine destro',
      topMargin: 'Margine superiore',
      bottomMargin: 'Margine inferiore',
      containLabel: 'Contieni etichetta',
      name: 'Nome',
      type: 'Tipo',
      showAxisLine: 'Mostra linea asse',
      showSplitLine: 'Mostra linea di divisione',
      colorPalette: 'Tavolozza colori',
      backgroundColor: 'Colore di sfondo',
      enableAnimation: 'Abilita animazione',
      animationDuration: 'Durata animazione (ms)',
      animationEasing: 'Easing animazione',
      selectLanguage: 'Seleziona lingua'
    },
    positions: {
      left: 'Sinistra',
      center: 'Centro',
      right: 'Destra',
      top: 'Alto',
      middle: 'Centro',
      bottom: 'Basso'
    },
    orientations: {
      horizontal: 'Orizzontale',
      vertical: 'Verticale'
    },
    triggerTypes: {
      item: 'Elemento',
      axis: 'Asse',
      none: 'Nessuno'
    },
    axisTypes: {
      value: 'Valore',
      category: 'Categoria',
      time: 'Tempo',
      log: 'Logaritmico'
    },
    chartTypes: {
      line: 'Grafico a linee',
      bar: 'Grafico a barre',
      stack: 'Pila',
      tiled: 'Affiancato'
    },
    easingTypes: {
      linear: 'Lineare',
      cubicIn: 'Cubico in entrata',
      cubicOut: 'Cubico in uscita',
      cubicInOut: 'Cubico entrata-uscita',
      elasticOut: 'Elastico in uscita',
      bounceOut: 'Rimbalzo in uscita'
    },
    features: {
      saveAsImage: 'Salva come immagine',
      restore: 'Ripristina',
      dataView: 'Vista dati',
      dataZoom: 'Zoom dati',
      magicType: 'Tipo magico (Cambio grafico)'
    },
    placeholders: {
      chartTitle: 'Titolo del grafico',
      chartSubtitle: 'Sottotitolo del grafico',
      formatterExample: '{b}: {c}',
      defaultFilename: 'grafico',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'Nome asse X',
      yAxisName: 'Nome asse Y'
    },
    helpTexts: {
      formatter: 'Usa segnaposto: {a} nome serie, {b} nome dati, {c} valore dati, {d} percentuale. Esempio: \'{b}: {c} ({d}%)\'',
      languageChange: 'Cambia la lingua per tutti gli elementi UI nella configurazione del grafico'
    },
    buttons: {
      close: 'Chiudi',
      reset: 'Ripristina',
      apply: 'Applica',
      addColor: 'Aggiungi colore'
    }
  }
}