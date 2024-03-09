<script setup>
  const props = defineProps({
    "text" : {
      type: String,
      default: "Display Text",
    },
    "shadow": {
      type: Boolean,
      default: false,
    },
  });
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
    max-w-48
    "
    :class="[shadow ? 'drop-shadow-solid' : '']"
    >
    <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
  </div>
</template>
