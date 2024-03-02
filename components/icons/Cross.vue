<script setup>
  const props = defineProps({
    "color": {
      default: "black"
    }
  })
</script>
<template>
  <svg width="30" height="30" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line x1="32.0858" y1="32.0358" x2="1.92363" y2="1.87369" :stroke="color" stroke-width="4"/>
  <line x1="31.9142" y1="1.7926" x2="1.75205" y2="31.9548" :stroke="color" stroke-width="4"/>
  </svg>
</template>
