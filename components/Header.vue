<script setup>
  const props = defineProps({
    "backVisible" : {
      type: Boolean,
      default: false
    },
    "goBack" : {
      default: console.log("back"),
    }
  })
</script>

<template>
  <div class="
      p-5
      w-fill
      flex
      item-stretch
  ">
    <div class="
      flex-none
    ">
      <img class="h-20" src="~/assets/images/logo-png.png">
    </div>
    <div class="flex-1 w-fill" />
    <div class="flex-none my-auto" :class="[backVisible ? '' : 'invisible']" @click="goBack">
      <IconsBack class="my-auto" />
    </div>
  </div>
</template>
