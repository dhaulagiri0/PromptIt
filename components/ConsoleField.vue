<script setup>
  const props = defineProps({
    'placeholderText': {
      type: String, 
      default: 'Placeholder',
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
    :placeholder="placeholderText" 
    >
  </input>
</template>
