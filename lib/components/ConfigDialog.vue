<template>
  <Teleport to="body">
    <div v-if="isOpen" class="config-dialog-overlay" @click="handleOverlayClick">
      <div class="config-dialog" @click.stop>
        <div class="config-header">
          <h2>{{ t('configDialog.title') }}</h2>
          <button class="close-btn" @click="close" :title="t('configDialog.buttons.close')">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="config-content">
          <!-- Title Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('title')" :class="{ active: expandedSections.title }">
              <span class="material-icons">{{ expandedSections.title ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.title') }}</span>
            </button>
            <div v-if="expandedSections.title" class="accordion-content">
              <BaseInput
                v-model="localOptions.title.text"
                :label="t('configDialog.fields.titleText')"
                :placeholder="t('configDialog.placeholders.chartTitle')"
                @input="updateOptions"
              />
              <BaseInput
                v-model="localOptions.title.subtext"
                :label="t('configDialog.fields.subtitle')"
                :placeholder="t('configDialog.placeholders.chartSubtitle')"
                @input="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.title.left"
                :label="t('configDialog.fields.position')"
                :options="[
                  { label: t('configDialog.positions.left'), value: 'left' },
                  { label: t('configDialog.positions.center'), value: 'center' },
                  { label: t('configDialog.positions.right'), value: 'right' }
                ]"
                @change="updateOptions"
              />
              <div class="form-group color-group">
                <label class="color-label">{{ t('configDialog.fields.textStyleColor') }}</label>
                <input type="color" v-model="titleTextColor" @input="updateOptions" class="color-picker">
              </div>
              <BaseInput
                v-model="titleFontSize"
                type="number"
                :label="t('configDialog.fields.fontSize')"
                :min="10"
                :max="48"
                @input="updateOptions"
                input-class="font-size-input"
              />
            </div>
          </div>

          <!-- Legend Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('legend')" :class="{ active: expandedSections.legend }">
              <span class="material-icons">{{ expandedSections.legend ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.legend') }}</span>
            </button>
            <div v-if="expandedSections.legend" class="accordion-content">
              <BaseCheckbox
                v-model="localOptions.legend.show"
                :label="t('configDialog.fields.showLegend')"
                @change="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.legend.left"
                :label="t('configDialog.fields.position')"
                :options="[
                  { label: t('configDialog.positions.left'), value: 'left' },
                  { label: t('configDialog.positions.center'), value: 'center' },
                  { label: t('configDialog.positions.right'), value: 'right' }
                ]"
                @change="updateOptions"
              />
              <BaseSelect
                v-model="legendOrient"
                :label="t('configDialog.fields.orientation')"
                :options="[
                  { label: t('configDialog.orientations.horizontal'), value: 'horizontal' },
                  { label: t('configDialog.orientations.vertical'), value: 'vertical' }
                ]"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- Tooltip Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('tooltip')" :class="{ active: expandedSections.tooltip }">
              <span class="material-icons">{{ expandedSections.tooltip ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.tooltip') }}</span>
            </button>
            <div v-if="expandedSections.tooltip" class="accordion-content">
              <BaseCheckbox
                v-model="localOptions.tooltip.show"
                :label="t('configDialog.fields.showTooltip')"
                @change="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.tooltip.trigger"
                :label="t('configDialog.fields.trigger')"
                :options="[
                  { label: t('configDialog.triggerTypes.item'), value: 'item' },
                  { label: t('configDialog.triggerTypes.axis'), value: 'axis' },
                  { label: t('configDialog.triggerTypes.none'), value: 'none' }
                ]"
                @change="updateOptions"
              />
              <BaseInput
                v-model="localOptions.tooltip.formatter"
                type="textarea"
                :label="t('configDialog.fields.formatter')"
                :placeholder="t('configDialog.placeholders.formatterExample')"
                :help-text="t('configDialog.helpTexts.formatter')"
                :rows="3"
                @input="updateOptions"
              />
            </div>
          </div>

          <!-- Toolbox Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('toolbox')" :class="{ active: expandedSections.toolbox }">
              <span class="material-icons">{{ expandedSections.toolbox ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.toolbox') }}</span>
            </button>
            <div v-if="expandedSections.toolbox" class="accordion-content">
              <BaseCheckbox
                v-model="localOptions.toolbox.show"
                :label="t('configDialog.fields.showToolbox')"
                @change="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.toolbox.orient"
                :label="t('configDialog.fields.orientation')"
                :options="[
                  { label: t('configDialog.orientations.horizontal'), value: 'horizontal' },
                  { label: t('configDialog.orientations.vertical'), value: 'vertical' }
                ]"
                @change="updateOptions"
              />
              <BaseSelect
                v-model="toolboxDisplayStyle"
                :label="t('configDialog.fields.displayStyle')"
                :options="[
                  { label: t('configDialog.toolboxStyles.menu'), value: 'menu' },
                  { label: t('configDialog.toolboxStyles.toolbar'), value: 'toolbar' }
                ]"
                @change="updateOptions"
              />
              <BaseInput
                v-model="localOptions.toolbox.itemSize"
                type="number"
                :label="t('configDialog.fields.iconSize')"
                :min="10"
                :max="30"
                @input="updateOptions"
              />
              <BaseInput
                v-model="localOptions.toolbox.itemGap"
                type="number"
                :label="t('configDialog.fields.itemGap')"
                :min="0"
                :max="30"
                @input="updateOptions"
              />
              <BaseCheckbox
                v-model="localOptions.toolbox.showTitle"
                :label="t('configDialog.fields.showTitleOnHover')"
                @change="updateOptions"
              />
              
              <div class="feature-section">
                <h4 class="section-subtitle">{{ t('configDialog.fields.features') }}</h4>
                
                <!-- Save as Image -->
                <div class="feature-group">
                  <h5 class="feature-title">{{ t('configDialog.features.saveAsImage') }}</h5>
                  <BaseCheckbox
                    v-model="toolboxSaveAsImageShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                  <BaseSelect
                    v-model="toolboxSaveAsImageType"
                    :label="t('configDialog.fields.imageType')"
                    :options="[
                  { label: 'PNG', value: 'png' },
                  { label: 'JPEG', value: 'jpeg' },
                  { label: 'SVG', value: 'svg' }
                ]"
                    @change="updateOptions"
                  />
                  <BaseInput
                    v-model="toolboxSaveAsImageName"
                    :label="t('configDialog.fields.filename')"
                    :placeholder="t('configDialog.placeholders.defaultFilename')"
                    @input="updateOptions"
                  />
                </div>
                
                <!-- Restore -->
                <div class="feature-group">
                  <h5 class="feature-title">{{ t('configDialog.features.restore') }}</h5>
                  <BaseCheckbox
                    v-model="toolboxRestoreShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                </div>
                
                <!-- Data View -->
                <div class="feature-group">
                  <h5 class="feature-title">{{ t('configDialog.features.dataView') }}</h5>
                  <BaseCheckbox
                    v-model="toolboxDataViewShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                  <BaseCheckbox
                    v-model="toolboxDataViewReadOnly"
                    :label="t('configDialog.fields.readOnly')"
                    @change="updateOptions"
                  />
                </div>
                
                <!-- Data Zoom -->
                <div class="feature-group">
                  <h5 class="feature-title">{{ t('configDialog.features.dataZoom') }}</h5>
                  <BaseCheckbox
                    v-model="toolboxDataZoomShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                </div>
                
                <!-- Magic Type -->
                <div class="feature-group">
                  <h5 class="feature-title">{{ t('configDialog.features.magicType') }}</h5>
                  <BaseCheckbox
                    v-model="toolboxMagicTypeShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                  <div class="checkbox-group">
                    <BaseCheckbox
                      v-model="toolboxMagicTypeLine"
                      :label="t('configDialog.chartTypes.line')"
                      @change="updateToolboxMagicTypes"
                    />
                    <BaseCheckbox
                      v-model="toolboxMagicTypeBar"
                      :label="t('configDialog.chartTypes.bar')"
                      @change="updateToolboxMagicTypes"
                    />
                    <BaseCheckbox
                      v-model="toolboxMagicTypeStack"
                      :label="t('configDialog.chartTypes.stack')"
                      @change="updateToolboxMagicTypes"
                    />
                    <BaseCheckbox
                      v-model="toolboxMagicTypeTiled"
                      :label="t('configDialog.chartTypes.tiled')"
                      @change="updateToolboxMagicTypes"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grid Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('grid')" :class="{ active: expandedSections.grid }">
              <span class="material-icons">{{ expandedSections.grid ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.grid') }}</span>
            </button>
            <div v-if="expandedSections.grid" class="accordion-content">
              <BaseInput
                v-model="localOptions.grid.left"
                :label="t('configDialog.fields.leftMargin')"
                :placeholder="t('configDialog.placeholders.marginExample')"
                @input="updateOptions"
              />
              <BaseInput
                v-model="localOptions.grid.right"
                :label="t('configDialog.fields.rightMargin')"
                :placeholder="t('configDialog.placeholders.marginExample')"
                @input="updateOptions"
              />
              <BaseInput
                v-model="localOptions.grid.top"
                :label="t('configDialog.fields.topMargin')"
                :placeholder="t('configDialog.placeholders.pixelValue')"
                @input="updateOptions"
              />
              <BaseInput
                v-model="localOptions.grid.bottom"
                :label="t('configDialog.fields.bottomMargin')"
                :placeholder="t('configDialog.placeholders.pixelValue')"
                @input="updateOptions"
              />
              <BaseCheckbox
                v-model="localOptions.grid.containLabel"
                :label="t('configDialog.fields.containLabel')"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- X Axis Section -->
          <div class="accordion-section" v-if="hasAxis">
            <button class="accordion-header" @click="toggleSection('xAxis')" :class="{ active: expandedSections.xAxis }">
              <span class="material-icons">{{ expandedSections.xAxis ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.xAxis') }}</span>
            </button>
            <div v-if="expandedSections.xAxis" class="accordion-content">
              <BaseInput
                v-model="localOptions.xAxis.name"
                :label="t('configDialog.fields.name')"
                :placeholder="t('configDialog.placeholders.xAxisName')"
                @input="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.xAxis.type"
                :label="t('configDialog.fields.type')"
                :options="[
                  { label: t('configDialog.axisTypes.value'), value: 'value' },
                  { label: t('configDialog.axisTypes.category'), value: 'category' },
                  { label: t('configDialog.axisTypes.time'), value: 'time' },
                  { label: t('configDialog.axisTypes.log'), value: 'log' }
                ]"
                @change="updateOptions"
              />
              <BaseCheckbox
                v-model="xAxisLineShow"
                :label="t('configDialog.fields.showAxisLine')"
                @change="updateOptions"
              />
              <BaseCheckbox
                v-model="xAxisSplitLineShow"
                :label="t('configDialog.fields.showSplitLine')"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- Y Axis Section -->
          <div class="accordion-section" v-if="hasAxis">
            <button class="accordion-header" @click="toggleSection('yAxis')" :class="{ active: expandedSections.yAxis }">
              <span class="material-icons">{{ expandedSections.yAxis ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.yAxis') }}</span>
            </button>
            <div v-if="expandedSections.yAxis" class="accordion-content">
              <BaseInput
                v-model="localOptions.yAxis.name"
                :label="t('configDialog.fields.name')"
                :placeholder="t('configDialog.placeholders.yAxisName')"
                @input="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.yAxis.type"
                :label="t('configDialog.fields.type')"
                :options="[
                  { label: t('configDialog.axisTypes.value'), value: 'value' },
                  { label: t('configDialog.axisTypes.category'), value: 'category' },
                  { label: t('configDialog.axisTypes.time'), value: 'time' },
                  { label: t('configDialog.axisTypes.log'), value: 'log' }
                ]"
                @change="updateOptions"
              />
              <BaseCheckbox
                v-model="yAxisLineShow"
                :label="t('configDialog.fields.showAxisLine')"
                @change="updateOptions"
              />
              <BaseCheckbox
                v-model="yAxisSplitLineShow"
                :label="t('configDialog.fields.showSplitLine')"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- Colors Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('colors')" :class="{ active: expandedSections.colors }">
              <span class="material-icons">{{ expandedSections.colors ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.colors') }}</span>
            </button>
            <div v-if="expandedSections.colors" class="accordion-content">
              <div>
                <h4 class="section-subtitle">{{ t('configDialog.fields.colorPalette') }}</h4>
                <div class="color-palette">
                  <div v-for="(color, index) in colorPalette" :key="index" class="color-item">
                    <input type="color" :value="color" @input="updateColor(index, $event)" @change="updateOptions" class="color-picker">
                    <button @click="removeColor(index)" class="remove-color">
                      <span class="material-icons">close</span>
                    </button>
                  </div>
                  <button @click="addColor" class="add-color">
                    <span class="material-icons">add</span>
                    {{ t('configDialog.buttons.addColor') }}
                  </button>
                </div>
              </div>
              <div class="form-group color-group">
                <label class="color-label">{{ t('configDialog.fields.backgroundColor') }}</label>
                <input type="color" v-model="backgroundColor" @input="updateOptions" class="color-picker">
              </div>
            </div>
          </div>

          <!-- Animation Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('animation')" :class="{ active: expandedSections.animation }">
              <span class="material-icons">{{ expandedSections.animation ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.animation') }}</span>
            </button>
            <div v-if="expandedSections.animation" class="accordion-content">
              <BaseCheckbox
                v-model="localOptions.animation"
                :label="t('configDialog.fields.enableAnimation')"
                @change="updateOptions"
              />
              <BaseInput
                v-model="localOptions.animationDuration"
                type="number"
                :label="t('configDialog.fields.animationDuration')"
                :min="0"
                :max="5000"
                :step="100"
                @input="updateOptions"
              />
              <BaseSelect
                v-model="localOptions.animationEasing"
                :label="t('configDialog.fields.animationEasing')"
                :options="[
                  { label: t('configDialog.easingTypes.linear'), value: 'linear' },
                  { label: t('configDialog.easingTypes.cubicIn'), value: 'cubicIn' },
                  { label: t('configDialog.easingTypes.cubicOut'), value: 'cubicOut' },
                  { label: t('configDialog.easingTypes.cubicInOut'), value: 'cubicInOut' },
                  { label: t('configDialog.easingTypes.elasticOut'), value: 'elasticOut' },
                  { label: t('configDialog.easingTypes.bounceOut'), value: 'bounceOut' }
                ]"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- Language Section -->
          <div class="accordion-section">
            <button class="accordion-header" @click="toggleSection('language')" :class="{ active: expandedSections.language }">
              <span class="material-icons">{{ expandedSections.language ? 'expand_less' : 'expand_more' }}</span>
              <span>{{ t('configDialog.sections.language') }}</span>
            </button>
            <div v-if="expandedSections.language" class="accordion-content">
              <BaseSelect
                v-model="currentLocale"
                :label="t('configDialog.fields.selectLanguage')"
                :options="availableLocales"
                @change="handleLocaleChange"
              />
              <div class="help-text" style="margin-top: 0.5rem;">
                {{ t('configDialog.helpTexts.languageChange') }}
              </div>
            </div>
          </div>
        </div>

        <div class="config-footer">
          <button class="btn-secondary" @click="resetOptions">{{ t('configDialog.buttons.reset') }}</button>
          <button class="btn-primary" @click="applyAndClose">{{ t('configDialog.buttons.apply') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, watch, watchEffect } from 'vue'
import type { EChartsOption } from 'echarts'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseCheckbox from './BaseCheckbox.vue'
import { useTranslation, useLocale } from '../composables/useLocale'

interface ConfigDialogProps {
  modelValue: boolean
  options: EChartsOption
}

const props = withDefaults(defineProps<ConfigDialogProps>(), {
  modelValue: false,
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:options': [options: EChartsOption]
  'update:locale': [locale: string]
}>()

// Localization
const { t } = useTranslation()
const { locale: currentLocale } = useLocale()

// Available locales for the dropdown
const availableLocales = computed(() => [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'ru', label: 'Русский' },
  { value: 'it', label: 'Italiano' }
])

const handleLocaleChange = () => {
  // Emit an event to notify parent about locale change
  emit('update:locale', currentLocale.value)
}

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const expandedSections = reactive({
  title: true,
  legend: false,
  tooltip: false,
  toolbox: false,
  grid: false,
  xAxis: false,
  yAxis: false,
  colors: false,
  animation: false,
  language: false
})

// Helper function to check if chart has axis
const checkHasAxis = (options: any): boolean => {
  const series = options?.series
  if (!series) return true
  const seriesArray = Array.isArray(series) ? series : [series]
  return !seriesArray.some((s: any) => s.type === 'pie' || s.type === 'radar' || s.type === 'gauge')
}

// Check if chart has axis (for non-pie, non-radar charts)
const hasAxis = computed(() => checkHasAxis(props.options))

// Initialize with default options structure
const createDefaultOptions = (): any => {
  const defaults: any = {
    title: {
      text: '',
      subtext: '',
      left: 'center',
      textStyle: {
        color: '#333333',
        fontSize: 18
      }
    },
    legend: {
      show: true,
      left: 'center',
      orient: 'horizontal'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: ''
    },
    toolbox: {
      show: true,
      orient: 'horizontal',
      itemSize: 15,
      itemGap: 10,
      showTitle: true,
      feature: {
        saveAsImage: {
          show: true,
          type: 'png',
          name: 'chart',
          pixelRatio: 1,
          backgroundColor: 'auto'
        },
        restore: {
          show: true
        },
        dataView: {
          show: false,
          readOnly: false
        },
        dataZoom: {
          show: true
        },
        magicType: {
          show: true,
          type: ['line', 'bar']
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '60',
      bottom: '60',
      containLabel: true
    },
    color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  }
  
  // Always initialize axis defaults (they will be hidden if not needed)
  defaults.xAxis = {
    name: '',
    type: 'category',
    axisLine: { show: true },
    splitLine: { show: false },
    data: []
  }
  defaults.yAxis = {
    name: '',
    type: 'value',
    axisLine: { show: true },
    splitLine: { show: true }
  }
  
  // Ensure nested objects exist
  if (!defaults.title) {
    defaults.title = { text: '', subtext: '' }
  }
  if (!defaults.title.textStyle) {
    defaults.title.textStyle = { color: '#333333', fontSize: 18 }
  }
  
  return defaults
}

const localOptions = reactive(createDefaultOptions())

// Computed properties for safe nested access
// Helper function to expand shorthand hex colors
const expandHexColor = (hex: string): string => {
  if (!hex) return '#333333'
  
  // Remove # if present
  const cleanHex = hex.replace('#', '')
  
  // If it's a 3-digit hex, expand it
  if (cleanHex.length === 3) {
    return '#' + cleanHex.split('').map(c => c + c).join('')
  }
  
  // If it's already 6 digits, return with #
  if (cleanHex.length === 6) {
    return '#' + cleanHex
  }
  
  // Default fallback
  return '#333333'
}

const titleTextColor = computed({
  get: () => expandHexColor(localOptions.title?.textStyle?.color || '#333333'),
  set: (value) => {
    if (!localOptions.title) localOptions.title = {}
    if (!localOptions.title.textStyle) localOptions.title.textStyle = {}
    localOptions.title.textStyle.color = value
  }
})

const titleFontSize = computed({
  get: () => localOptions.title?.textStyle?.fontSize || 18,
  set: (value) => {
    if (!localOptions.title) localOptions.title = {}
    if (!localOptions.title.textStyle) localOptions.title.textStyle = {}
    localOptions.title.textStyle.fontSize = value
  }
})

// Legend computed properties
const legendOrient = computed({
  get: () => localOptions.legend?.orient || 'horizontal',
  set: (value) => {
    if (!localOptions.legend) localOptions.legend = {}
    localOptions.legend.orient = value
  }
})

// X Axis computed properties
const xAxisLineShow = computed({
  get: () => localOptions.xAxis?.axisLine?.show ?? true,
  set: (value) => {
    if (!localOptions.xAxis) localOptions.xAxis = {}
    if (!localOptions.xAxis.axisLine) localOptions.xAxis.axisLine = {}
    localOptions.xAxis.axisLine.show = value
  }
})

const xAxisSplitLineShow = computed({
  get: () => localOptions.xAxis?.splitLine?.show ?? false,
  set: (value) => {
    if (!localOptions.xAxis) localOptions.xAxis = {}
    if (!localOptions.xAxis.splitLine) localOptions.xAxis.splitLine = {}
    localOptions.xAxis.splitLine.show = value
  }
})

// Y Axis computed properties
const yAxisLineShow = computed({
  get: () => localOptions.yAxis?.axisLine?.show ?? true,
  set: (value) => {
    if (!localOptions.yAxis) localOptions.yAxis = {}
    if (!localOptions.yAxis.axisLine) localOptions.yAxis.axisLine = {}
    localOptions.yAxis.axisLine.show = value
  }
})

const yAxisSplitLineShow = computed({
  get: () => localOptions.yAxis?.splitLine?.show ?? true,
  set: (value) => {
    if (!localOptions.yAxis) localOptions.yAxis = {}
    if (!localOptions.yAxis.splitLine) localOptions.yAxis.splitLine = {}
    localOptions.yAxis.splitLine.show = value
  }
})

// Background color computed property with expansion
const backgroundColor = computed({
  get: () => {
    const bg = localOptions.backgroundColor
    if (!bg || bg === 'transparent' || bg === 'rgba(0,0,0,0)') {
      return '#ffffff'  // Default to white for color picker
    }
    return expandHexColor(bg)
  },
  set: (value) => {
    localOptions.backgroundColor = value
  }
})

// Toolbox computed properties
const toolboxDisplayStyle = computed({
  get: () => localOptions.toolbox?.displayStyle ?? 'menu',
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    localOptions.toolbox.displayStyle = value
  }
})

const toolboxSaveAsImageShow = computed({
  get: () => localOptions.toolbox?.feature?.saveAsImage?.show ?? true,
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.saveAsImage) localOptions.toolbox.feature.saveAsImage = {}
    localOptions.toolbox.feature.saveAsImage.show = value
  }
})

const toolboxSaveAsImageType = computed({
  get: () => localOptions.toolbox?.feature?.saveAsImage?.type || 'png',
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.saveAsImage) localOptions.toolbox.feature.saveAsImage = {}
    localOptions.toolbox.feature.saveAsImage.type = value
  }
})

const toolboxSaveAsImageName = computed({
  get: () => localOptions.toolbox?.feature?.saveAsImage?.name || 'chart',
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.saveAsImage) localOptions.toolbox.feature.saveAsImage = {}
    localOptions.toolbox.feature.saveAsImage.name = value
  }
})

const toolboxRestoreShow = computed({
  get: () => localOptions.toolbox?.feature?.restore?.show ?? true,
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.restore) localOptions.toolbox.feature.restore = {}
    localOptions.toolbox.feature.restore.show = value
  }
})

const toolboxDataViewShow = computed({
  get: () => localOptions.toolbox?.feature?.dataView?.show ?? false,
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.dataView) localOptions.toolbox.feature.dataView = {}
    localOptions.toolbox.feature.dataView.show = value
  }
})

const toolboxDataViewReadOnly = computed({
  get: () => localOptions.toolbox?.feature?.dataView?.readOnly ?? false,
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.dataView) localOptions.toolbox.feature.dataView = {}
    localOptions.toolbox.feature.dataView.readOnly = value
  }
})

const toolboxDataZoomShow = computed({
  get: () => localOptions.toolbox?.feature?.dataZoom?.show ?? true,
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.dataZoom) localOptions.toolbox.feature.dataZoom = {}
    localOptions.toolbox.feature.dataZoom.show = value
  }
})

const toolboxMagicTypeShow = computed({
  get: () => localOptions.toolbox?.feature?.magicType?.show ?? true,
  set: (value) => {
    if (!localOptions.toolbox) localOptions.toolbox = {}
    if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
    if (!localOptions.toolbox.feature.magicType) localOptions.toolbox.feature.magicType = {}
    localOptions.toolbox.feature.magicType.show = value
  }
})

// Store magic type states separately to avoid circular dependency
const magicTypeStates = reactive({
  line: false,
  bar: false,
  stack: false,
  tiled: false
})

// Initialize magic type states
watchEffect(() => {
  const types = localOptions.toolbox?.feature?.magicType?.type
  if (Array.isArray(types)) {
    magicTypeStates.line = types.includes('line')
    magicTypeStates.bar = types.includes('bar')
    magicTypeStates.stack = types.includes('stack')
    magicTypeStates.tiled = types.includes('tiled')
  }
})

// Individual magic type toggles
const toolboxMagicTypeLine = computed({
  get: () => magicTypeStates.line,
  set: (value) => {
    magicTypeStates.line = value
    updateToolboxMagicTypes()
  }
})

const toolboxMagicTypeBar = computed({
  get: () => magicTypeStates.bar,
  set: (value) => {
    magicTypeStates.bar = value
    updateToolboxMagicTypes()
  }
})

const toolboxMagicTypeStack = computed({
  get: () => magicTypeStates.stack,
  set: (value) => {
    magicTypeStates.stack = value
    updateToolboxMagicTypes()
  }
})

const toolboxMagicTypeTiled = computed({
  get: () => magicTypeStates.tiled,
  set: (value) => {
    magicTypeStates.tiled = value
    updateToolboxMagicTypes()
  }
})

const updateToolboxMagicTypes = () => {
  if (!localOptions.toolbox) localOptions.toolbox = {}
  if (!localOptions.toolbox.feature) localOptions.toolbox.feature = {}
  if (!localOptions.toolbox.feature.magicType) localOptions.toolbox.feature.magicType = {}
  
  const types = []
  if (magicTypeStates.line) types.push('line')
  if (magicTypeStates.bar) types.push('bar')
  if (magicTypeStates.stack) types.push('stack')
  if (magicTypeStates.tiled) types.push('tiled')
  
  localOptions.toolbox.feature.magicType.type = types
  updateOptions()
}

// Deep merge options with safety checks
const deepMerge = (target: any, source: any, path: string[] = []): any => {
  if (!source || typeof source !== 'object') {
    return source
  }
  
  // Handle arrays by cloning them
  if (Array.isArray(source)) {
    return [...source]
  }
  
  if (!target || typeof target !== 'object' || Array.isArray(target)) {
    target = {}
  }
  
  for (const key in source) {
    const currentPath = [...path, key]
    const sourceValue = source[key]
    
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      // Ensure nested objects exist in target
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {}
      }
      target[key] = deepMerge(target[key], sourceValue, currentPath)
    } else if (sourceValue !== undefined) {
      // Handle arrays and primitive values
      target[key] = Array.isArray(sourceValue) ? [...sourceValue] : sourceValue
    }
  }
  
  // Ensure required nested structures exist
  if (path.length === 0) {
    // Root level - ensure all required structures exist
    if (target.title && !target.title.textStyle) {
      target.title.textStyle = { color: '#333333', fontSize: 18 }
    }
    if (target.xAxis) {
      if (!target.xAxis.axisLine) target.xAxis.axisLine = { show: true }
      if (!target.xAxis.splitLine) target.xAxis.splitLine = { show: false }
    }
    if (target.yAxis) {
      if (!target.yAxis.axisLine) target.yAxis.axisLine = { show: true }
      if (!target.yAxis.splitLine) target.yAxis.splitLine = { show: true }
    }
    if (!target.color || !Array.isArray(target.color)) {
      target.color = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
    }
  }
  
  return target
}

// Watch for options changes and update local state
watch(() => props.options, (newOptions) => {
  if (newOptions && typeof newOptions === 'object') {
    const defaults = createDefaultOptions()
    const merged = deepMerge(defaults, newOptions)
    Object.assign(localOptions, merged)
  }
}, { immediate: true, deep: true })

// Re-sync when dialog opens
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.options) {
    const defaults = createDefaultOptions()
    // Deep clone the props.options to avoid reference issues
    const optionsClone = JSON.parse(JSON.stringify(props.options))
    const merged = deepMerge(defaults, optionsClone)
    Object.assign(localOptions, merged)
  }
})

const toggleSection = (section: string) => {
  expandedSections[section as keyof typeof expandedSections] = !expandedSections[section as keyof typeof expandedSections]
}

const updateOptions = () => {
  // Start with the original props.options to preserve any properties we don't manage
  const updatedOptions = JSON.parse(JSON.stringify(props.options || {}))
  
  // Apply local changes to options with safe deep copy
  if (localOptions.title) {
    updatedOptions.title = JSON.parse(JSON.stringify(localOptions.title))
  }
  
  if (localOptions.legend) {
    updatedOptions.legend = JSON.parse(JSON.stringify(localOptions.legend))
  }
  
  if (localOptions.tooltip) {
    updatedOptions.tooltip = JSON.parse(JSON.stringify(localOptions.tooltip))
  }
  
  if (localOptions.toolbox) {
    updatedOptions.toolbox = JSON.parse(JSON.stringify(localOptions.toolbox))
  }
  
  if (localOptions.grid) {
    updatedOptions.grid = JSON.parse(JSON.stringify(localOptions.grid))
  }
  
  if (hasAxis.value) {
    if (localOptions.xAxis) {
      updatedOptions.xAxis = JSON.parse(JSON.stringify(localOptions.xAxis))
    }
    if (localOptions.yAxis) {
      updatedOptions.yAxis = JSON.parse(JSON.stringify(localOptions.yAxis))
    }
  }
  
  if (localOptions.color && Array.isArray(localOptions.color)) {
    updatedOptions.color = [...localOptions.color]
  }
  
  if (localOptions.backgroundColor !== undefined) {
    updatedOptions.backgroundColor = localOptions.backgroundColor
  }
  
  if (localOptions.animation !== undefined) {
    updatedOptions.animation = localOptions.animation
  }
  
  if (localOptions.animationDuration !== undefined) {
    updatedOptions.animationDuration = localOptions.animationDuration
  }
  
  if (localOptions.animationEasing !== undefined) {
    updatedOptions.animationEasing = localOptions.animationEasing
  }
  
  emit('update:options', updatedOptions)
}

// Computed property for color array with expansion
const colorPalette = computed({
  get: () => {
    if (!localOptions.color || !Array.isArray(localOptions.color)) {
      return ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
    }
    return localOptions.color.map((color: string) => expandHexColor(color))
  },
  set: (value) => {
    localOptions.color = value
  }
})

const addColor = () => {
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  localOptions.color.push(randomColor)
  updateOptions()
}

const updateColor = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  if (target && localOptions.color) {
    localOptions.color[index] = target.value
  }
}

const removeColor = (index: number) => {
  if (localOptions.color.length > 1) {
    localOptions.color.splice(index, 1)
    updateOptions()
  }
}

const resetOptions = () => {
  Object.assign(localOptions, createDefaultOptions())
  updateOptions()
}

const close = () => {
  isOpen.value = false
}

const applyAndClose = () => {
  updateOptions()
  close()
}

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    close()
  }
}
</script>

<style scoped>
.config-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.config-dialog {
  background: var(--bg-primary, white);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.config-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary, #2c3e50);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-secondary, #718096);
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-primary, #2c3e50);
}

.config-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.accordion-section {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  padding: 1rem;
  background: var(--bg-secondary, #f8f9fa);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary, #2c3e50);
  transition: background-color 0.2s;
}

.accordion-header:hover {
  background: var(--bg-tertiary, #f5f6fa);
}

.accordion-header.active {
  background: var(--bg-tertiary, #f5f6fa);
}

.accordion-content {
  padding: 1rem;
  background: var(--bg-primary, white);
}

/* Spacing between form components */
.accordion-content > * {
  margin-bottom: 1.25rem;
}

.accordion-content > *:last-child {
  margin-bottom: 0;
}

/* Special styles for color inputs */
.color-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.color-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.color-picker {
  width: 3rem;
  height: 3rem;
  padding: 0.25rem;
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 0.5rem;
  cursor: pointer;
  background: var(--bg-primary, white);
  transition: all 0.2s ease;
}

.color-picker:hover {
  border-color: var(--border-hover, #cbd5e1);
}

.color-picker:focus {
  outline: none;
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 0.25rem;
}

/* Font size input */
:deep(.font-size-input) {
  width: 100px !important;
}

.section-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  margin-bottom: 0.75rem;
  letter-spacing: 0.025em;
}

.feature-section {
  margin-top: 1.5rem;
}

.feature-group {
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 0.75rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
  margin-left: 1rem;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.color-item .color-picker {
  width: 2.5rem;
  height: 2.5rem;
}

.remove-color {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-secondary, #718096);
  transition: color 0.2s;
}

.remove-color:hover {
  color: #e53e3e;
}

.add-color {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary, #f8f9fa);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary, #2c3e50);
  transition: all 0.2s;
}

.add-color:hover {
  background: var(--bg-tertiary, #f5f6fa);
}

.config-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e2e8f0);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4299e1;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #3182ce;
}

.btn-secondary {
  background: var(--bg-secondary, #f8f9fa);
  color: var(--text-primary, #2c3e50);
  border: 1px solid var(--border-color, #e2e8f0);
}

.btn-secondary:hover {
  background: var(--bg-tertiary, #f5f6fa);
}

/* Dark mode support */
:global(.dark) .config-dialog {
  background: var(--bg-primary);
  color: var(--text-primary);
}

:global(.dark) .color-picker {
  background-color: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #334155);
}

:global(.dark) .feature-group {
  background: var(--bg-secondary, #1e293b);
}

.material-icons {
  font-size: 1.25rem;
}
</style>