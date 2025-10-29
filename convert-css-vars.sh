#!/bin/bash

# Convert all $variable to var(--variable) in CSS files
find app/styles/original -name "*.css" -type f -exec sed -i '' \
  -e 's/$color_primary/var(--color-primary)/g' \
  -e 's/$color_secondary/var(--color-secondary)/g' \
  -e 's/$color_tertiary/var(--color-tertiary)/g' \
  -e 's/$color_highlight_primary/var(--color-highlight-primary)/g' \
  -e 's/$color_highlight_secondary/var(--color-highlight-secondary)/g' \
  -e 's/$color_highlight_secondary_v2/var(--color-highlight-secondary-v2)/g' \
  -e 's/$color_secondary_active/var(--color-secondary-active)/g' \
  -e 's/$color_highlight_primary_active/var(--color-highlight-primary-active)/g' \
  -e 's/$color_grey/var(--color-grey)/g' \
  -e 's/$color_grey_v2/var(--color-grey-v2)/g' \
  -e 's/$color_light_grey/var(--color-light-grey)/g' \
  -e 's/$color_light_v2_grey/var(--color-light-v2-grey)/g' \
  -e 's/$text_color/var(--text-color)/g' \
  -e 's/$header_height/var(--header-height)/g' \
  -e 's/$header_index/var(--header-index)/g' \
  -e 's/$mobile_brake_p/var(--mobile-brake-p)/g' \
  -e 's/$initial_section_height/var(--initial-section-height)/g' \
  -e 's/$svg_banner_index/var(--svg-banner-index)/g' \
  {} \;

echo "CSS variables converted!"
