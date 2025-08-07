# MyndEcharts Toolbox Fix Documentation

## Overview

This document describes the comprehensive fixes implemented to resolve toolbox icon overlap issues in the MyndEcharts component when used in external applications.

## Problem Statement

The ECharts toolbox icons were overlapping or stacking vertically when the MyndEcharts component was integrated into external Vue applications, despite working correctly in the playground environment. This was due to missing CSS styles and positioning context issues.

## Solution Architecture

### 1. CSS Fixes (`lib/styles/echarts-toolbox.css`)

Created dedicated CSS file that:
- Forces flexbox layout on toolbox containers
- Ensures horizontal display with proper spacing
- Uses high specificity selectors to override conflicting styles
- Handles both HTML and SVG rendering modes

### 2. Component Structure

Enhanced component wrapper structure:
```html
<div class="mynd-echarts-wrapper">     <!-- Isolation wrapper -->
  <div class="mynd-echarts-container"> <!-- Container layer -->
    <div class="mynd-echarts-chart">   <!-- Chart element -->
```

Benefits:
- Creates CSS isolation boundaries
- Prevents external style inheritance
- Establishes proper positioning context
- Ensures consistent sizing

### 3. Toolbox Control Props

New props for fine-grained control:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toolboxMode` | String | 'auto' | Control mode: 'auto', 'fixed', or 'disabled' |
| `toolboxPosition` | Object | `{ right: 10, top: 10 }` | Numeric position values |
| `fixToolboxOverlap` | Boolean | true | Auto-fix overlap issues |
| `debugToolbox` | Boolean | false | Enable debug mode |

### 4. Options Processing

The `processChartOptions()` method:
- Deep clones options to ensure JSON serializability
- Strips non-serializable functions
- Applies static toolbox configuration
- Ensures all values are serializable

### 5. Automatic Position Fixing

The `fixToolboxPosition()` method:
- Checks chart instance state
- Applies static positioning defaults
- Uses only JSON-serializable values
- Respects user configuration

### 6. Observer Pattern

Implemented observers for responsive behavior:

**ResizeObserver:**
- Monitors container size changes
- Triggers chart resize
- Fixes toolbox position after resize

**MutationObserver:**
- Detects DOM changes affecting toolbox
- Reapplies fixes when needed
- Debounced to prevent performance issues

### 7. Manual Control Methods

Public methods for manual intervention:

```javascript
// Manually refresh toolbox layout
chartRef.value.refreshToolbox()

// Get ECharts instance for advanced control
const chart = chartRef.value.getChartInstance()

// Fix toolbox position programmatically
chartRef.value.fixToolboxPosition()
```

### 8. Debug Features

When `debugToolbox` is enabled:
- Console logging of configuration and measurements
- Visual borders around toolbox elements
- Events for tracking toolbox lifecycle
- Container dimension reporting

## Usage Examples

### Basic Usage
```vue
<MyndEcharts 
  :options="chartOptions"
  toolbox-mode="fixed"
  :fix-toolbox-overlap="true"
/>
```

### With Custom Position
```vue
<MyndEcharts 
  :options="chartOptions"
  toolbox-mode="fixed"
  :toolbox-position="{ right: 20, top: 20 }"
/>
```

### Debug Mode
```vue
<MyndEcharts 
  :options="chartOptions"
  :debug-toolbox="true"
  @toolbox-rendered="onRendered"
  @toolbox-overlap-detected="onOverlap"
  @toolbox-fixed="onFixed"
/>
```

## Test Scenarios

The test suite covers:

1. **Container with `overflow: hidden`** - Ensures toolbox remains visible
2. **Absolute positioning** - Handles different positioning contexts
3. **CSS transforms** - Manages stacking context issues
4. **Flexbox containers** - Adapts to flex layouts
5. **CSS Grid** - Works with grid positioning
6. **Small containers** - Handles space constraints
7. **Nested containers** - Complex DOM hierarchies
8. **Dynamic resizing** - Responsive behavior

## Known Limitations

### 1. Overflow Clipping
- **Issue**: Toolbox may be clipped if positioned outside container bounds with `overflow: hidden`
- **Workaround**: Adjust `toolboxPosition` to keep within bounds

### 2. Transform Scale
- **Issue**: Scale transforms < 1 may misalign click targets
- **Workaround**: Use `toolboxMode="fixed"` for transformed containers

### 3. Small Containers
- **Issue**: Containers < 250px width may not fit all toolbox features
- **Workaround**: Reduce features or use custom configuration

### 4. Nested Transforms
- **Issue**: Multiple nested transforms can compound positioning issues
- **Workaround**: Use `refreshToolbox()` method manually

### 5. Third-party CSS
- **Issue**: Some CSS frameworks may override toolbox styles
- **Workaround**: Increase CSS specificity or use `!important`

### 6. SVG vs Canvas
- **Issue**: SVG renderer may handle toolbox differently
- **Workaround**: Test with both renderers, prefer canvas for consistency

### 7. Scroll Position
- **Issue**: Container scroll affects tooltip positioning
- **Workaround**: Account for scroll offset in container styles

## Performance Considerations

1. **Debouncing**: All fixes are debounced to prevent excessive recalculation
2. **Conditional Processing**: Fixes only apply when needed
3. **Observer Cleanup**: Proper cleanup prevents memory leaks
4. **JSON Serialization**: Ensures options remain lightweight

## Migration Guide

For existing implementations:

1. **Update imports** to include CSS:
```javascript
import { MyndEcharts } from '@docbrasil/mynd-echarts'
import '@docbrasil/mynd-echarts/dist/style.css'
```

2. **Add toolbox props** if experiencing issues:
```vue
<MyndEcharts 
  :options="existingOptions"
  toolbox-mode="fixed"
  :fix-toolbox-overlap="true"
/>
```

3. **Enable debug mode** to diagnose issues:
```vue
<MyndEcharts 
  :debug-toolbox="true"
  @toolbox-overlap-detected="handleOverlap"
/>
```

4. **Use manual fix** as fallback:
```javascript
onMounted(() => {
  nextTick(() => {
    chartRef.value?.refreshToolbox()
  })
})
```

## Best Practices

1. **Always include the CSS file** in your build
2. **Use `toolbox-mode="fixed"`** for complex layouts
3. **Test with both canvas and SVG** renderers
4. **Enable debug mode** during development
5. **Monitor the console** for warnings
6. **Use ResizeObserver** for responsive containers
7. **Apply fixes after dynamic content** changes
8. **Keep toolbox configuration simple** and static

## Support

If you encounter issues:

1. Enable debug mode and check console
2. Try manual refresh: `chartRef.value.refreshToolbox()`
3. Verify CSS is loaded correctly
4. Test with `toolbox-mode="fixed"`
5. Check for conflicting global styles
6. Report issues with debug output

## Version History

- **v1.0.0** - Initial toolbox fix implementation
  - CSS isolation
  - Container structure
  - Manual fix methods
  - Debug features
  - Observer pattern
  - Test suite

## Future Improvements

Potential enhancements:
- Auto-detect optimal toolbox position
- Smart feature reduction for small containers
- Custom toolbox layouts
- Enhanced debug visualization
- Automated testing for more edge cases
- Performance metrics collection