<script setup>
  const props = defineProps({
    'errorText': {
      type: String, 
      default: 'You done fucked up boy!',
    },
  })

  const show = ref(true)

  function setShow() {
      show.value = false
  }
</script>

<template>
  <div
    v-if="show" 
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
          <button class="inline" data-modal-hide="popup-error"  type="button" @click="setShow()">
            <IconsCircle />
          </button>
          <button class="inline" data-modal-hide="popup-error"  type="button" @click="setShow()">
            <IconsDash />
          </button>
          <button class="inline" data-modal-hide="popup-error"  type="button" @click="setShow()">
            <IconsCross />
          </button>
        </div>
      </div>
      <div class="space-y-3 content-container p-4">
        <p class="text-offwhite text-2xl text-center">{{ errorText }}</p>
      </div>
    </div>
  </div>
</template>
