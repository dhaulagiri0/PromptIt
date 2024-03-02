<script setup>
  const props = defineProps({
    "isVisible" : {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div class="
      mb-5
      w-fill
      flex
      item-stretch
  ">
    <div class="
      flex-none
    ">
      <img class="h-20" src="~/assets/images/logo.svg">
    </div>
    <div class="flex-1 w-fill" />
    <div class="flex-none h-20" :class="[isVisible ? '' : 'invisible']">
      <IconsBack />
    </div>
  </div>
</template>