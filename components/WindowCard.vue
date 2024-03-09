<script setup>
  const props = defineProps({
    'headerColor': {
      type: String, 
      default: 'grapefruit',
    },
    'headerText': {
      type: String, 
      default: '',
    },
  })
</script>

<template>
  <div class="
    container 
    mx-auto 
    main-container 
    rounded-vl
    border-4
    bg-offwhite 
    border-black
    overflow-hidden
    drop-shadow-solid
  ">
    <div class="block h-full">
      <div class="
        flex
        header 
        space-x-4 
        p-2 
        border-b-4 
        border-black 
        " :class="['bg-' + headerColor]"> 
        <div class="flex-1 inline text-left items-baseline h-fill pl-2">
          <p class="font-gohu text-2xl">{{ props.headerText }}</p>
        </div>
        <div class="flex-1 w-fill inline text-right space-x-2">
          <IconsCircle class="inline"/>
          <IconsDash class="inline"/>
          <IconsCross class="inline"/>
        </div>
      </div>
      <div class="space-y-3 p-4 h-full">
        <slot />
      </div>
    </div>
  </div>
</template>
