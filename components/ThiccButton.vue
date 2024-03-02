<script setup>
 const props = defineProps({
   'color': {
     type: String, 
     default: 'grapefruit',
   },
 })
</script>

<template>
  <div class="
    border-black
    hover:drop-shadow-solid-grey
    overflow-hidden
    drop-shadow-solid
    px-2 
    border-4
    mx-auto
    p-3
    pl-5
    pr-5
    text-center
    font-gohu
    text-xl
    rounded-vl" :class="['bg-' + props.color]">
    <slot />
  </div>
</template>
