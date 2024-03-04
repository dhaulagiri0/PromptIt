<script setup>
  const model = defineModel()
  const props = defineProps({
    'placeholderText': {
      type: String, 
      default: 'Placeholder',
    },
    "shadow": {
      type: Boolean,
      default: false,
    },
    "type": String,
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
    w-full
    "
    :type="type"
    :class="[shadow ? 'drop-shadow-solid' : '']"
    :placeholder="placeholderText" 
    v-model="model"
    >
  </input>
</template>
