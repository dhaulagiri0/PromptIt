<script setup>
  const props = defineProps({
    "text" : {
      type: String,
      default: "Display Text",
    },
  })
</script>

<template>
  <div class="
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
    >
    <h3>{{ text }}</h3>
  </div>
</template>
