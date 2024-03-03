<script setup>
  const props = defineProps({
    'errorText': {
      type: String, 
      default: 'You done fucked up boy!',
    },
  })
  console.log("From error + ", errorText)
</script>

<template>
  <div
    id="popup-error"
    class=" 
    z-40
    overflow-y-auto 
    overflow-x-hidden 
    absolute 
    bottom-20 
    left-0
    max-h-fit
    rounded-vl
    border-4
    bg-darkergrey 
    border-black
    overflow-hidden
    max-w-fit
    drop-shadow-solid
    font-gohu
    cursor-pointer
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
        place-items-center
        "> 
        <div class="flex-1 text-left items-baseline h-fill pl-2">
          <p class="text-2xl">Error!</p>
        </div>
        <div class="flex flex-row w-fill text-right space-x-2">
          <IconsCircle />
          <IconsDash  />
          <IconsCross />
        </div>
      </div>
      <div class="space-y-3 content-container p-4">
        <p class="text-offwhite text-2xl text-center">{{ errorText }}</p>
      </div>
    </div>
  </div>
</template>
