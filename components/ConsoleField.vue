<script setup>
  const props = defineProps({
    'placeholderText': {
      type: String, 
      default: 'Placeholder',
    },
    "shadow": {
      type: Boolean,
      default: false,
    },
  })
</script>

<template>
  <input class="
    border-white
    rounded-vl
    overflow-hidden
    p-3
    pl-5
    pr-5
    bg-black
    border-4
    text-offwhite
    font-gohu
    text-xl
    "
    :class="[shadow ? 'drop-shadow-solid' : '']"
    :placeholder="placeholderText" 
    >
  </input>
</template>
