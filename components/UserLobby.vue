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
    'showButton': {
      type: Boolean,
      default: false
    },
    'playerId': {
      type: String,
      default: "id"
    },
    'kickFun': {
      default: console.log("kicked")
    }
  });

  async function kick() {
    props.kickFun(props.playerId);
  }
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
    <div class="flex-none align-middle h-fill">
      <button v-if="showButton" class="
        h-fit
        bg-richred
        rounded-vl
        border-4
        border-black
        overflow-hidden
        drop-shadow-solid
        p-3
        hover:drop-shadow-solid-grey
      " @click="kick">
        <IconsCross class="size-4" color="white"/>
      </button>
    </div>
  </div>
</template>
