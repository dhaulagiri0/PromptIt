<script setup>
  const props = defineProps({
    'errorText': {
      type: String, 
      default: 'You done fucked up boy!',
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
    bg-darkergrey 
    border-black
    overflow-hidden
    drop-shadow-solid
    max-w-72
    font-gohu
  ">
    <div class="block">
      <div class="
        flex
        header 
        space-x-4 
        p-2 
        border-b-4 
        border-black 
        bg-richred
        "> 
        <div class="flex-1 inline text-left items-baseline h-fill pl-2">
          <p class="text-2xl">Error!</p>
        </div>
        <div class="flex-1 w-fill inline text-right space-x-2">
          <IconsCircle class="inline"/>
          <IconsDash class="inline"/>
          <IconsCross class="inline"/>
        </div>
      </div>
      <div class="space-y-3 content-container p-4">
        <p class="text-offwhite text-2xl text-center">{{ errorText }}</p>
      </div>
    </div>
  </div>
</template>
