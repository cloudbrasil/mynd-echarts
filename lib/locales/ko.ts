import type { LocaleMessages } from './types'

export const ko: LocaleMessages = {
  configDialog: {
    title: '차트 구성',
    sections: {
      title: '제목',
      legend: '범례',
      tooltip: '툴팁',
      toolbox: '도구상자',
      grid: '그리드 및 레이아웃',
      xAxis: 'X축',
      yAxis: 'Y축',
      colors: '색상',
      animation: '애니메이션',
      language: '언어 / Language / 语言'
    },
    fields: {
      titleText: '제목 텍스트',
      subtitle: '부제목',
      position: '위치',
      textStyleColor: '텍스트 스타일 색상',
      fontSize: '글꼴 크기',
      showLegend: '범례 표시',
      orientation: '방향',
      showTooltip: '툴팁 표시',
      trigger: '트리거',
      formatter: '포맷터',
      showToolbox: '도구상자 표시',
      iconSize: '아이콘 크기',
      itemGap: '항목 간격',
      showTitleOnHover: '호버 시 제목 표시',
      features: '기능',
      enable: '활성화',
      imageType: '이미지 유형',
      filename: '파일명',
      readOnly: '읽기 전용',
      leftMargin: '왼쪽 여백',
      rightMargin: '오른쪽 여백',
      topMargin: '위쪽 여백',
      bottomMargin: '아래쪽 여백',
      containLabel: '레이블 포함',
      name: '이름',
      type: '유형',
      showAxisLine: '축선 표시',
      showSplitLine: '분할선 표시',
      colorPalette: '색상 팔레트',
      backgroundColor: '배경색',
      enableAnimation: '애니메이션 활성화',
      animationDuration: '애니메이션 지속 시간 (ms)',
      animationEasing: '애니메이션 이징',
      selectLanguage: '언어 선택'
    },
    positions: {
      left: '왼쪽',
      center: '중앙',
      right: '오른쪽',
      top: '위',
      middle: '중앙',
      bottom: '아래'
    },
    orientations: {
      horizontal: '가로',
      vertical: '세로'
    },
    triggerTypes: {
      item: '항목',
      axis: '축',
      none: '없음'
    },
    axisTypes: {
      value: '값',
      category: '카테고리',
      time: '시간',
      log: '로그'
    },
    chartTypes: {
      line: '선 차트',
      bar: '막대 차트',
      stack: '스택',
      tiled: '타일'
    },
    easingTypes: {
      linear: '선형',
      cubicIn: '큐빅 인',
      cubicOut: '큐빅 아웃',
      cubicInOut: '큐빅 인아웃',
      elasticOut: '탄성 아웃',
      bounceOut: '바운스 아웃'
    },
    features: {
      saveAsImage: '이미지로 저장',
      restore: '복원',
      dataView: '데이터 보기',
      dataZoom: '데이터 확대/축소',
      magicType: '매직 타입 (차트 전환기)'
    },
    placeholders: {
      chartTitle: '차트 제목',
      chartSubtitle: '차트 부제목',
      formatterExample: '{b}: {c}',
      defaultFilename: 'chart',
      marginExample: '10%',
      pixelValue: '60',
      xAxisName: 'X축 이름',
      yAxisName: 'Y축 이름'
    },
    helpTexts: {
      formatter: '자리 표시자 사용: {a} 시리즈 이름, {b} 데이터 이름, {c} 데이터 값, {d} 백분율. 예: \'{b}: {c} ({d}%)\'',
      languageChange: '차트 구성의 모든 UI 요소 언어를 변경합니다'
    },
    buttons: {
      close: '닫기',
      reset: '재설정',
      apply: '적용',
      addColor: '색상 추가'
    }
  }
}