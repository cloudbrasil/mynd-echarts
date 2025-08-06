import type { LocaleMessages } from './types'

export const ja: LocaleMessages = {
  configDialog: {
    title: 'チャート設定',
    sections: {
      title: 'タイトル',
      legend: '凡例',
      tooltip: 'ツールチップ',
      toolbox: 'ツールボックス',
      grid: 'グリッド＆レイアウト',
      xAxis: 'X軸',
      yAxis: 'Y軸',
      colors: '色',
      animation: 'アニメーション',
      language: '言語 / Language / 语言'
    },
    fields: {
      titleText: 'タイトルテキスト',
      subtitle: 'サブタイトル',
      position: '位置',
      textStyleColor: 'テキストスタイルの色',
      fontSize: 'フォントサイズ',
      showLegend: '凡例を表示',
      orientation: '向き',
      showTooltip: 'ツールチップを表示',
      trigger: 'トリガー',
      formatter: 'フォーマッター',
      showToolbox: 'ツールボックスを表示',
      iconSize: 'アイコンサイズ',
      itemGap: 'アイテム間隔',
      showTitleOnHover: 'ホバー時にタイトルを表示',
      features: '機能',
      enable: '有効にする',
      imageType: '画像タイプ',
      filename: 'ファイル名',
      readOnly: '読み取り専用',
      leftMargin: '左マージン',
      rightMargin: '右マージン',
      topMargin: '上マージン',
      bottomMargin: '下マージン',
      containLabel: 'ラベルを含む',
      name: '名前',
      type: 'タイプ',
      showAxisLine: '軸線を表示',
      showSplitLine: '分割線を表示',
      colorPalette: 'カラーパレット',
      backgroundColor: '背景色',
      enableAnimation: 'アニメーションを有効にする',
      animationDuration: 'アニメーション時間（ミリ秒）',
      animationEasing: 'アニメーションイージング',
      selectLanguage: '言語を選択'
    },
    positions: {
      left: '左',
      center: '中央',
      right: '右',
      top: '上',
      middle: '中央',
      bottom: '下'
    },
    orientations: {
      horizontal: '水平',
      vertical: '垂直'
    },
    triggerTypes: {
      item: 'アイテム',
      axis: '軸',
      none: 'なし'
    },
    axisTypes: {
      value: '数値',
      category: 'カテゴリ',
      time: '時間',
      log: '対数'
    },
    chartTypes: {
      line: '折れ線グラフ',
      bar: '棒グラフ',
      stack: 'スタック',
      tiled: 'タイル'
    },
    easingTypes: {
      linear: 'リニア',
      cubicIn: 'キュービックイン',
      cubicOut: 'キュービックアウト',
      cubicInOut: 'キュービックインアウト',
      elasticOut: 'エラスティックアウト',
      bounceOut: 'バウンスアウト'
    },
    features: {
      saveAsImage: '画像として保存',
      restore: '復元',
      dataView: 'データビュー',
      dataZoom: 'データズーム',
      magicType: 'マジックタイプ（チャート切替）'
    },
    placeholders: {
      chartTitle: 'チャートタイトル',
      chartSubtitle: 'チャートサブタイトル',
      formatterExample: '{b}: {c}',
      defaultFilename: 'chart',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'X軸名',
      yAxisName: 'Y軸名'
    },
    helpTexts: {
      formatter: 'プレースホルダーを使用: {a} シリーズ名、{b} データ名、{c} データ値、{d} パーセンテージ。例: \'{b}: {c} ({d}%)\'',
      languageChange: 'チャート設定のすべてのUI要素の言語を変更します'
    },
    buttons: {
      close: '閉じる',
      reset: 'リセット',
      apply: '適用',
      addColor: '色を追加'
    }
  }
}