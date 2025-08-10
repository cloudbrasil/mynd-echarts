<template>
  <Teleport :to="teleportTo">
    <div v-if="isOpen" class="mynd-echarts-config-dialog-overlay config-dialog-overlay" :data-theme="isDarkMode ? 'dark' : 'light'" @click="handleOverlayClick">
      <div class="mynd-echarts-config-dialog config-dialog" @click.stop>
        <div class="mynd-echarts-config-header config-header">
          <h2>{{ t('configDialog.title') }}</h2>
          <button class="mynd-echarts-close-btn close-btn" @click="close" :title="t('configDialog.buttons.close')">
            <span class="material-icons" aria-hidden="true">close</span>
            <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="mynd-echarts-config-content config-content">
          <!-- Title Section -->
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('title')" :class="{ active: expandedSections.title }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.title" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.title') }}</span>
            </button>
            <div v-if="expandedSections.title" class="mynd-echarts-accordion-content accordion-content">
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.title.text"
                :label="t('configDialog.fields.titleText')"
                :placeholder="t('configDialog.placeholders.chartTitle')"
                @input="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.title.subtext"
                :label="t('configDialog.fields.subtitle')"
                :placeholder="t('configDialog.placeholders.chartSubtitle')"
                @input="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
                v-model="localOptions.title.left"
                :label="t('configDialog.fields.position')"
                :options="[
                  { label: t('configDialog.positions.left'), value: 'left' },
                  { label: t('configDialog.positions.center'), value: 'center' },
                  { label: t('configDialog.positions.right'), value: 'right' }
                ]"
                @change="updateOptions"
              />
              <div class="mynd-echarts-form-group mynd-echarts-color-group">
                <label class="mynd-echarts-color-label">{{ t('configDialog.fields.textStyleColor') }}</label>
                <input type="color" v-model="titleTextColor" @input="updateOptions" class="mynd-echarts-color-picker">
              </div>
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="titleFontSize"
                type="number"
                :label="t('configDialog.fields.fontSize')"
                :min="10"
                :max="48"
                @input="updateOptions"
                input-class="mynd-echarts-font-size-input"
              />
            </div>
          </div>

          <!-- Legend Section -->
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('legend')" :class="{ active: expandedSections.legend }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.legend" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.legend') }}</span>
            </button>
            <div v-if="expandedSections.legend" class="mynd-echarts-accordion-content accordion-content">
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="localOptions.legend.show"
                :label="t('configDialog.fields.showLegend')"
                @change="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
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
                :isDarkMode="isDarkMode"
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
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('tooltip')" :class="{ active: expandedSections.tooltip }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.tooltip" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.tooltip') }}</span>
            </button>
            <div v-if="expandedSections.tooltip" class="mynd-echarts-accordion-content accordion-content">
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="localOptions.tooltip.show"
                :label="t('configDialog.fields.showTooltip')"
                @change="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
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
                :isDarkMode="isDarkMode"
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
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('toolbox')" :class="{ active: expandedSections.toolbox }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.toolbox" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.toolbox') }}</span>
            </button>
            <div v-if="expandedSections.toolbox" class="mynd-echarts-accordion-content accordion-content">
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="localOptions.toolbox.show"
                :label="t('configDialog.fields.showToolbox')"
                @change="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
                v-model="localOptions.toolbox.orient"
                :label="t('configDialog.fields.orientation')"
                :options="[
                  { label: t('configDialog.orientations.horizontal'), value: 'horizontal' },
                  { label: t('configDialog.orientations.vertical'), value: 'vertical' }
                ]"
                @change="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
                v-model="toolboxDisplayStyle"
                :label="t('configDialog.fields.displayStyle')"
                :options="[
                  { label: t('configDialog.toolboxStyles.menu'), value: 'menu' },
                  { label: t('configDialog.toolboxStyles.toolbar'), value: 'toolbar' }
                ]"
                @change="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.toolbox.itemSize"
                type="number"
                :label="t('configDialog.fields.iconSize')"
                :min="10"
                :max="30"
                @input="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.toolbox.itemGap"
                type="number"
                :label="t('configDialog.fields.itemGap')"
                :min="0"
                :max="30"
                @input="updateOptions"
              />
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="localOptions.toolbox.showTitle"
                :label="t('configDialog.fields.showTitleOnHover')"
                @change="updateOptions"
              />
              
              <div class="mynd-echarts-feature-section">
                <h4 class="mynd-echarts-section-subtitle">{{ t('configDialog.fields.features') }}</h4>
                
                <!-- Save as Image -->
                <div class="mynd-echarts-feature-group">
                  <h5 class="mynd-echarts-feature-title">{{ t('configDialog.features.saveAsImage') }}</h5>
                  <BaseCheckbox
                :isDarkMode="isDarkMode"
                    v-model="toolboxSaveAsImageShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                  <BaseSelect
                :isDarkMode="isDarkMode"
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
                :isDarkMode="isDarkMode"
                    v-model="toolboxSaveAsImageName"
                    :label="t('configDialog.fields.filename')"
                    :placeholder="t('configDialog.placeholders.defaultFilename')"
                    @input="updateOptions"
                  />
                </div>
                
                <!-- Restore -->
                <div class="mynd-echarts-feature-group">
                  <h5 class="mynd-echarts-feature-title">{{ t('configDialog.features.restore') }}</h5>
                  <BaseCheckbox
                :isDarkMode="isDarkMode"
                    v-model="toolboxRestoreShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                </div>
                
                <!-- Data View -->
                <div class="mynd-echarts-feature-group">
                  <h5 class="mynd-echarts-feature-title">{{ t('configDialog.features.dataView') }}</h5>
                  <BaseCheckbox
                :isDarkMode="isDarkMode"
                    v-model="toolboxDataViewShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                  <BaseCheckbox
                :isDarkMode="isDarkMode"
                    v-model="toolboxDataViewReadOnly"
                    :label="t('configDialog.fields.readOnly')"
                    @change="updateOptions"
                  />
                </div>
                
                <!-- Data Zoom -->
                <div class="mynd-echarts-feature-group">
                  <h5 class="mynd-echarts-feature-title">{{ t('configDialog.features.dataZoom') }}</h5>
                  <BaseCheckbox
                :isDarkMode="isDarkMode"
                    v-model="toolboxDataZoomShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                </div>
                
                <!-- Magic Type -->
                <div class="mynd-echarts-feature-group">
                  <h5 class="mynd-echarts-feature-title">{{ t('configDialog.features.magicType') }}</h5>
                  <BaseCheckbox
                :isDarkMode="isDarkMode"
                    v-model="toolboxMagicTypeShow"
                    :label="t('configDialog.fields.enable')"
                    @change="updateOptions"
                  />
                  <div class="mynd-echarts-checkbox-group">
                    <BaseCheckbox
                :isDarkMode="isDarkMode"
                      v-model="toolboxMagicTypeLine"
                      :label="t('configDialog.chartTypes.line')"
                      @change="updateToolboxMagicTypes"
                    />
                    <BaseCheckbox
                :isDarkMode="isDarkMode"
                      v-model="toolboxMagicTypeBar"
                      :label="t('configDialog.chartTypes.bar')"
                      @change="updateToolboxMagicTypes"
                    />
                    <BaseCheckbox
                :isDarkMode="isDarkMode"
                      v-model="toolboxMagicTypeStack"
                      :label="t('configDialog.chartTypes.stack')"
                      @change="updateToolboxMagicTypes"
                    />
                    <BaseCheckbox
                :isDarkMode="isDarkMode"
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
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('grid')" :class="{ active: expandedSections.grid }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.grid" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.grid') }}</span>
            </button>
            <div v-if="expandedSections.grid" class="mynd-echarts-accordion-content accordion-content">
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.grid.left"
                :label="t('configDialog.fields.leftMargin')"
                :placeholder="t('configDialog.placeholders.marginExample')"
                @input="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.grid.right"
                :label="t('configDialog.fields.rightMargin')"
                :placeholder="t('configDialog.placeholders.marginExample')"
                @input="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.grid.top"
                :label="t('configDialog.fields.topMargin')"
                :placeholder="t('configDialog.placeholders.pixelValue')"
                @input="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.grid.bottom"
                :label="t('configDialog.fields.bottomMargin')"
                :placeholder="t('configDialog.placeholders.pixelValue')"
                @input="updateOptions"
              />
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="localOptions.grid.containLabel"
                :label="t('configDialog.fields.containLabel')"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- X Axis Section -->
          <div class="accordion-section" v-if="hasAxis">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('xAxis')" :class="{ active: expandedSections.xAxis }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.xAxis" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.xAxis') }}</span>
            </button>
            <div v-if="expandedSections.xAxis" class="mynd-echarts-accordion-content accordion-content">
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.xAxis.name"
                :label="t('configDialog.fields.name')"
                :placeholder="t('configDialog.placeholders.xAxisName')"
                @input="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
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
                :isDarkMode="isDarkMode"
                v-model="xAxisLineShow"
                :label="t('configDialog.fields.showAxisLine')"
                @change="updateOptions"
              />
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="xAxisSplitLineShow"
                :label="t('configDialog.fields.showSplitLine')"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- Y Axis Section -->
          <div class="accordion-section" v-if="hasAxis">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('yAxis')" :class="{ active: expandedSections.yAxis }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.yAxis" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.yAxis') }}</span>
            </button>
            <div v-if="expandedSections.yAxis" class="mynd-echarts-accordion-content accordion-content">
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.yAxis.name"
                :label="t('configDialog.fields.name')"
                :placeholder="t('configDialog.placeholders.yAxisName')"
                @input="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
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
                :isDarkMode="isDarkMode"
                v-model="yAxisLineShow"
                :label="t('configDialog.fields.showAxisLine')"
                @change="updateOptions"
              />
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="yAxisSplitLineShow"
                :label="t('configDialog.fields.showSplitLine')"
                @change="updateOptions"
              />
            </div>
          </div>

          <!-- Colors Section -->
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('colors')" :class="{ active: expandedSections.colors }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.colors" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.colors') }}</span>
            </button>
            <div v-if="expandedSections.colors" class="mynd-echarts-accordion-content accordion-content">
              <div>
                <h4 class="mynd-echarts-section-subtitle">{{ t('configDialog.fields.colorPalette') }}</h4>
                <div class="mynd-echarts-color-palette color-palette">
                  <div v-for="(color, index) in colorPalette" :key="index" class="mynd-echarts-color-item">
                    <input type="color" :value="color" @input="updateColor(index, $event)" @change="updateOptions" class="mynd-echarts-color-picker">
                    <button @click="removeColor(index)" class="mynd-echarts-remove-color remove-color">
                      <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                  <button @click="addColor" class="mynd-echarts-add-color add-color">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    {{ t('configDialog.buttons.addColor') }}
                  </button>
                </div>
              </div>
              <div class="mynd-echarts-form-group mynd-echarts-color-group">
                <label class="mynd-echarts-color-label">{{ t('configDialog.fields.backgroundColor') }}</label>
                <input type="color" v-model="backgroundColor" @input="updateOptions" class="mynd-echarts-color-picker">
              </div>
            </div>
          </div>

          <!-- Animation Section -->
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('animation')" :class="{ active: expandedSections.animation }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.animation" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.animation') }}</span>
            </button>
            <div v-if="expandedSections.animation" class="mynd-echarts-accordion-content accordion-content">
              <BaseCheckbox
                :isDarkMode="isDarkMode"
                v-model="localOptions.animation"
                :label="t('configDialog.fields.enableAnimation')"
                @change="updateOptions"
              />
              <BaseInput
                :isDarkMode="isDarkMode"
                v-model="localOptions.animationDuration"
                type="number"
                :label="t('configDialog.fields.animationDuration')"
                :min="0"
                :max="5000"
                :step="100"
                @input="updateOptions"
              />
              <BaseSelect
                :isDarkMode="isDarkMode"
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
          <div class="mynd-echarts-accordion-section accordion-section">
            <button class="mynd-echarts-accordion-header accordion-header" @click="toggleSection('language')" :class="{ active: expandedSections.language }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="mynd-echarts-icon">
                <path v-if="expandedSections.language" d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                <path v-else d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
              </svg>
              <span>{{ t('configDialog.sections.language') }}</span>
            </button>
            <div v-if="expandedSections.language" class="mynd-echarts-accordion-content accordion-content">
              <BaseSelect
                :isDarkMode="isDarkMode"
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

        <div class="mynd-echarts-config-footer config-footer">
          <button class="mynd-echarts-btn-secondary btn-secondary" @click="resetOptions">{{ t('configDialog.buttons.reset') }}</button>
          <button class="mynd-echarts-btn-primary btn-primary" @click="applyAndClose">{{ t('configDialog.buttons.apply') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, watch, watchEffect, getCurrentInstance } from 'vue'
// Choose teleport target: prefer test target when present
const teleportTo = computed(() => {
  if (typeof document !== 'undefined' && document.getElementById('teleport-target')) {
    return '#teleport-target'
  }
  return 'body'
})
import type { EChartsOption } from 'echarts'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'
import BaseCheckbox from './BaseCheckbox.vue'
import { useTranslation, useLocale } from '../composables/useLocale'

interface ConfigDialogProps {
  modelValue: boolean
  options: EChartsOption
  isDarkMode?: boolean
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

// Expose methods expected by tests on component instance
;(getCurrentInstance()?.proxy as any).closeDialog = () => close()
;(getCurrentInstance()?.proxy as any).updateOptions = (opts?: EChartsOption) => {
  if (opts) {
    // Emit the provided options directly (used by tests)
    emit('update:options', opts)
    return
  } else {
    updateOptions()
  }
}
;(getCurrentInstance()?.proxy as any).updateLocale = (locale: string) => {
  ;(currentLocale as any).value = locale as any
  handleLocaleChange()
}
</script>

<style scoped>
.mynd-echarts-config-dialog-overlay {
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

.mynd-echarts-config-dialog {
  background: var(--bg-primary, white);
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.mynd-echarts-config-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mynd-echarts-config-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary, #2c3e50);
}

.mynd-echarts-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-secondary, #718096);
  transition: color 0.2s;
}

.mynd-echarts-close-btn:hover {
  color: var(--text-primary, #2c3e50);
}

.mynd-echarts-config-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.mynd-echarts-accordion-section {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;
}

.mynd-echarts-accordion-header {
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

.mynd-echarts-accordion-header:hover {
  background: var(--bg-tertiary, #f5f6fa);
}

.mynd-echarts-accordion-header.active {
  background: var(--bg-tertiary, #f5f6fa);
}

.mynd-echarts-accordion-content {
  padding: 1rem;
  background: var(--bg-primary, white);
}

/* Spacing between form components */
.mynd-echarts-accordion-content > * {
  margin-bottom: 1.25rem;
}

.mynd-echarts-accordion-content > *:last-child {
  margin-bottom: 0;
}

/* Special styles for color inputs */
.mynd-echarts-color-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.mynd-echarts-color-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.mynd-echarts-color-picker {
  width: 3rem;
  height: 3rem;
  padding: 0.25rem;
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 0.5rem;
  cursor: pointer;
  background: var(--bg-primary, white);
  transition: all 0.2s ease;
}

.mynd-echarts-color-picker:hover {
  border-color: var(--border-hover, #cbd5e1);
}

.mynd-echarts-color-picker:focus {
  outline: none;
  border-color: var(--primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.mynd-echarts-color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.mynd-echarts-color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 0.25rem;
}

/* Font size input */
:deep(.mynd-echarts-font-size-input) {
  width: 100px !important;
}

.mynd-echarts-section-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  margin-bottom: 0.75rem;
  letter-spacing: 0.025em;
}

.mynd-echarts-feature-section {
  margin-top: 1.5rem;
}

.mynd-echarts-feature-group {
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.mynd-echarts-feature-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 0.75rem;
}

.mynd-echarts-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
  margin-left: 1rem;
}

.mynd-echarts-color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.mynd-echarts-color-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.mynd-echarts-color-item .mynd-echarts-color-picker {
  width: 2.5rem;
  height: 2.5rem;
}

.mynd-echarts-remove-color {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--text-secondary, #718096);
  transition: color 0.2s;
}

.mynd-echarts-remove-color:hover {
  color: #e53e3e;
}

.mynd-echarts-add-color {
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

.mynd-echarts-add-color:hover {
  background: var(--bg-tertiary, #f5f6fa);
}

.mynd-echarts-config-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e2e8f0);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.mynd-echarts-btn-primary,
.mynd-echarts-btn-secondary {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.mynd-echarts-btn-primary {
  background: #4299e1;
  color: white;
  border: none;
}

.mynd-echarts-btn-primary:hover {
  background: #3182ce;
}

.mynd-echarts-btn-secondary {
  background: var(--bg-secondary, #f8f9fa);
  color: var(--text-primary, #2c3e50);
  border: 1px solid var(--border-color, #e2e8f0);
}

.mynd-echarts-btn-secondary:hover {
  background: var(--bg-tertiary, #f5f6fa);
}

/* Dark mode support */
.mynd-echarts-config-dialog-overlay[data-theme="dark"] .mynd-echarts-config-dialog {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.mynd-echarts-config-dialog-overlay[data-theme="dark"] .mynd-echarts-color-picker {
  background-color: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #334155);
}

.mynd-echarts-config-dialog-overlay[data-theme="dark"] .mynd-echarts-feature-group {
  background: var(--bg-secondary, #1e293b);
}

.mynd-echarts-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  flex-shrink: 0;
}
</style>