<script setup>
  const props = defineProps({
    'headerColor': {
      type: String, 
      default: 'grapefruit',
    },
  })
</script>

<template>
  <div class="
    container 
    mx-auto 
    main-container 
    rounded-vl
    w-max 
    border-4
    bg-offwhite 
    border-black
    overflow-hidden
    drop-shadow-solid
  ">
    <div class="block">
      <div class="
        header 
        space-x-4 
        text-right 
        p-2 
        border-b-4 
        border-black 
        " :class="['bg-' + headerColor]"> 
        <IconsCircle class="inline"/>
        <IconsDash class="inline"/>
        <IconsCross class="inline"/>
      </div>
      <div class="space-y-3 content-container p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
