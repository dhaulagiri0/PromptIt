<script setup>
  const props = defineProps({
    'text': {
      type: String,
      default: 'Username',
    },
    'pfp': {
      type: String,
      default: 'user-icon.svg',
    },
  });
</script>
<template>
  <div class="
    container
    p-4
    flex
    items-center
    max-w-[350px]
    space-x-4
    "
  >
    <div class="flex-none">
      <UserIcon :pfp="pfp"/>
    </div>
    <div class="flex-1 w-fill">
      <ConsoleDisplay :text="text"/>
    </div>
    <div class="flex-none">
      <button class="
        bg-richred
        rounded-vl
        border-4
        border-black
        overflow-hidden
        drop-shadow-solid
        p-3
        hover:drop-shadow-solid-grey
      ">
        <IconsCross color="white"/>
      </button>
    </div>
  </div>
</template>
