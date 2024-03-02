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
    max-w-[300px]
    space-x-4
    "
  >
    <div class="flex-none">
      <UserIcon :pfp="pfp"/>
    </div>
    <div class="flex-1">
      <ConsoleDisplay :text="text"/>
    </div>
  </div>
</template>
