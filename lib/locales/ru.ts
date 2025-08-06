import type { LocaleMessages } from './types'

export const ru: LocaleMessages = {
  configDialog: {
    title: 'Настройка графика',
    sections: {
      title: 'Заголовок',
      legend: 'Легенда',
      tooltip: 'Подсказка',
      toolbox: 'Панель инструментов',
      grid: 'Сетка и макет',
      xAxis: 'Ось X',
      yAxis: 'Ось Y',
      colors: 'Цвета',
      animation: 'Анимация',
      language: 'Язык / Language / 语言'
    },
    fields: {
      titleText: 'Текст заголовка',
      subtitle: 'Подзаголовок',
      position: 'Позиция',
      textStyleColor: 'Цвет текста',
      fontSize: 'Размер шрифта',
      showLegend: 'Показать легенду',
      orientation: 'Ориентация',
      showTooltip: 'Показать подсказку',
      trigger: 'Триггер',
      formatter: 'Форматирование',
      showToolbox: 'Показать панель инструментов',
      iconSize: 'Размер иконок',
      itemGap: 'Промежуток между элементами',
      showTitleOnHover: 'Показывать заголовок при наведении',
      features: 'Функции',
      enable: 'Включить',
      imageType: 'Тип изображения',
      filename: 'Имя файла',
      readOnly: 'Только чтение',
      leftMargin: 'Левый отступ',
      rightMargin: 'Правый отступ',
      topMargin: 'Верхний отступ',
      bottomMargin: 'Нижний отступ',
      containLabel: 'Включать метки',
      name: 'Название',
      type: 'Тип',
      showAxisLine: 'Показать линию оси',
      showSplitLine: 'Показать разделительную линию',
      colorPalette: 'Цветовая палитра',
      backgroundColor: 'Цвет фона',
      enableAnimation: 'Включить анимацию',
      animationDuration: 'Продолжительность анимации (мс)',
      animationEasing: 'Плавность анимации',
      selectLanguage: 'Выбрать язык'
    },
    positions: {
      left: 'Слева',
      center: 'По центру',
      right: 'Справа',
      top: 'Сверху',
      middle: 'По центру',
      bottom: 'Снизу'
    },
    orientations: {
      horizontal: 'Горизонтально',
      vertical: 'Вертикально'
    },
    triggerTypes: {
      item: 'Элемент',
      axis: 'Ось',
      none: 'Нет'
    },
    axisTypes: {
      value: 'Значение',
      category: 'Категория',
      time: 'Время',
      log: 'Логарифмический'
    },
    chartTypes: {
      line: 'Линейный график',
      bar: 'Столбчатая диаграмма',
      stack: 'Стек',
      tiled: 'Плиткой'
    },
    easingTypes: {
      linear: 'Линейный',
      cubicIn: 'Кубический вход',
      cubicOut: 'Кубический выход',
      cubicInOut: 'Кубический вход-выход',
      elasticOut: 'Эластичный выход',
      bounceOut: 'Отскок'
    },
    features: {
      saveAsImage: 'Сохранить как изображение',
      restore: 'Восстановить',
      dataView: 'Просмотр данных',
      dataZoom: 'Масштабирование данных',
      magicType: 'Магический тип (переключатель графиков)'
    },
    placeholders: {
      chartTitle: 'Заголовок графика',
      chartSubtitle: 'Подзаголовок графика',
      formatterExample: '{b}: {c}',
      defaultFilename: 'график',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'Название оси X',
      yAxisName: 'Название оси Y'
    },
    helpTexts: {
      formatter: 'Используйте заполнители: {a} название серии, {b} название данных, {c} значение данных, {d} процент. Пример: \'{b}: {c} ({d}%)\'',
      languageChange: 'Изменяет язык для всех элементов интерфейса в настройках графика'
    },
    buttons: {
      close: 'Закрыть',
      reset: 'Сбросить',
      apply: 'Применить',
      addColor: 'Добавить цвет'
    }
  }
}