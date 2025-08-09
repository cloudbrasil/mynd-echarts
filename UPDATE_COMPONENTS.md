# Component Dark Mode Updates

## Components that need updating:
1. DataViewDialog.vue - Uses :global(.dark)
2. ConfigDialog.vue - Uses :global(.dark) 
3. BaseInput.vue - Uses :global(.dark)
4. BaseSelect.vue - Uses :global(.dark)
5. BaseCheckbox.vue - Uses :global(.dark)
6. ZoomBar.vue - Already updated ✓
7. ChartToolbox.vue - Already updated ✓
8. MyndEcharts.vue - Already updated ✓

## For each component:
1. Add `isDarkMode?: boolean` prop
2. Add `:data-theme="isDarkMode ? 'dark' : 'light'"` to root element
3. Replace `:global(.dark) .class` with `.root[data-theme="dark"] .class`
4. Pass isDarkMode from parent to all children

## Status:
- [ ] DataViewDialog
- [ ] ConfigDialog
- [ ] BaseInput
- [ ] BaseSelect
- [ ] BaseCheckbox