<script setup>  
  const props = defineProps({
    'pfp': {
      type: String,
      default: "user-icon.svg",
    },
  });

</script>
<template>
  <img class="
    image
    border-white
    border-4
    bg-grapefruit
    rounded-[40px]
    h-14
    aspect-square
    overflow-hidden
    "
    :src="`/_nuxt/assets/images/${props.pfp}`"
   >
  </img>
</template>
