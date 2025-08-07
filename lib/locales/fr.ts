import type { LocaleMessages } from './types'

export const fr: LocaleMessages = {
  configDialog: {
    title: 'Configuration du Graphique',
    sections: {
      title: 'Titre et Sous-titre',
      legend: 'Légende',
      tooltip: 'Info-bulle',
      toolbox: 'Boîte à Outils',
      grid: 'Grille et Mise en Page',
      xAxis: 'Axe X',
      yAxis: 'Axe Y',
      colors: 'Couleurs',
      animation: 'Animation',
      language: 'Langue / Language / 语言'
    },
    fields: {
      // Title section
      titleText: 'Texte du Titre',
      subtitle: 'Sous-titre',
      position: 'Position',
      textStyleColor: 'Couleur du Texte',
      fontSize: 'Taille de Police',
      
      // Legend section
      showLegend: 'Afficher la Légende',
      orientation: 'Orientation',
      
      // Tooltip section
      showTooltip: 'Afficher l\'Info-bulle',
      trigger: 'Déclencheur',
      formatter: 'Formateur',
      formatterHelp: 'Utiliser les marqueurs: {a} nom de série, {b} nom de donnée, {c} valeur, {d} pourcentage. Exemple: \'{b}: {c} ({d}%)\'',
      
      // Toolbox section
      showToolbox: 'Afficher la Boîte à Outils',
      iconSize: 'Taille des Icônes',
      itemGap: 'Espacement des Éléments',
      showTitleOnHover: 'Afficher le Titre au Survol',
      features: 'Fonctionnalités',
      
      // Toolbox features
      saveAsImage: 'Enregistrer comme Image',
      saveAsImageEnable: 'Activer',
      imageType: 'Type d\'Image',
      filename: 'Nom du Fichier',
      restore: 'Restaurer',
      restoreEnable: 'Activer',
      dataView: 'Vue des Données',
      dataViewEnable: 'Activer',
      readOnly: 'Lecture Seule',
      dataZoom: 'Zoom sur Données',
      dataZoomEnable: 'Activer',
      magicType: 'Changement de Type',
      magicTypeEnable: 'Activer',
      lineChart: 'Graphique en Ligne',
      barChart: 'Graphique en Barres',
      stack: 'Empiler',
      tiled: 'Carrelé',
      
      // Grid section
      leftMargin: 'Marge Gauche',
      rightMargin: 'Marge Droite',
      topMargin: 'Marge Haute',
      bottomMargin: 'Marge Basse',
      containLabel: 'Contenir l\'Étiquette',
      
      // Axis sections
      name: 'Nom',
      type: 'Type',
      showAxisLine: 'Afficher la Ligne d\'Axe',
      showSplitLine: 'Afficher la Ligne de Séparation',
      
      // Colors section
      colorPalette: 'Palette de Couleurs',
      backgroundColor: 'Couleur d\'Arrière-plan',
      addColor: 'Ajouter une Couleur',
      
      // Animation section
      enableAnimation: 'Activer l\'Animation',
      animationDuration: 'Durée de l\'Animation (ms)',
      animationEasing: 'Accélération de l\'Animation',
      
      // Language section
      selectLanguage: 'Sélectionner la Langue',
      
      // General
      enable: 'Activer'
    },
    positions: {
      left: 'Gauche',
      center: 'Centre',
      right: 'Droite',
      top: 'Haut',
      middle: 'Milieu',
      bottom: 'Bas'
    },
    orientations: {
      horizontal: 'Horizontal',
      vertical: 'Vertical'
    },
    triggerTypes: {
      item: 'Élément',
      axis: 'Axe',
      none: 'Aucun'
    },
    axisTypes: {
      value: 'Valeur',
      category: 'Catégorie',
      time: 'Temps',
      log: 'Logarithmique'
    },
    easingTypes: {
      linear: 'Linéaire',
      cubicIn: 'Cubique Entrée',
      cubicOut: 'Cubique Sortie',
      cubicInOut: 'Cubique Entrée-Sortie',
      elasticOut: 'Élastique Sortie',
      bounceOut: 'Rebond Sortie'
    },
    buttons: {
      reset: 'Réinitialiser',
      apply: 'Appliquer',
      close: 'Fermer',
      addColor: 'Ajouter une Couleur'
    },
    chartTypes: {
      line: 'Graphique en Ligne',
      bar: 'Graphique en Barres',
      stack: 'Empiler',
      tiled: 'Carrelé'
    },
    features: {
      saveAsImage: 'Enregistrer comme Image',
      restore: 'Restaurer',
      dataView: 'Vue des Données',
      dataZoom: 'Zoom sur Données',
      magicType: 'Changement de Type'
    },
    placeholders: {
      chartTitle: 'Titre du graphique',
      chartSubtitle: 'Sous-titre du graphique',
      formatterExample: '{b}: {c}',
      defaultFilename: 'graphique',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'Nom de l\'Axe X',
      yAxisName: 'Nom de l\'Axe Y'
    },
    helpTexts: {
      formatter: 'Utiliser les marqueurs: {a} nom de série, {b} nom de donnée, {c} valeur, {d} pourcentage. Exemple: \'{b}: {c} ({d}%)}}\'',
      languageChange: 'Change la langue pour tous les éléments de l\'interface dans la configuration du graphique'
    }
  },
  chart: {
    loading: 'Chargement...',
    noData: 'Aucune donnée'
  },
  dataView: {
    title: 'Vue des Données',
    noData: 'Aucune donnée disponible à afficher',
    downloadCSV: 'Télécharger CSV',
    copyToClipboard: 'Copier dans le Presse-papiers',
    close: 'Fermer',
    category: 'Catégorie',
    series: 'Série',
    name: 'Nom',
    value: 'Valeur',
    index: 'Index'
  },
  toolbox: {
    saveAsImage: 'Enregistrer comme Image',
    restore: 'Restaurer',
    dataView: 'Vue des Données',
    dataZoom: 'Zoom',
    magicType: 'Changer le Type de Graphique',
    brush: 'Sélection au Pinceau'
  }
}