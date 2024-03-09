<script setup>
  const props = defineProps({
    "backVisible" : {
      type: Boolean,
      default: false
    },
    "progress" : {
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
      place-items-center
  ">
    <div class="
      flex-none
    ">
      <img class="h-20" src="~/assets/images/logo-png.png">
    </div>
    <div v-if="props.progress" class="flex-1 w-fill px-40">
      <slot />
    </div>
    <div v-else class="flex-1 w-fill" />
    <div :class="[backVisible ? '' : 'invisible']" @click="goBack">
      <IconsBack class="cursor-pointer" />
    </div>
  </div>
</template>
