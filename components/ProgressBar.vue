<template>
  <div class="flex flex-row justify-between mr-[55px]">
    <p v-if="props.roundNumber" class="text-xl text-white ml-2 text-nowrap">Round: {{ props.roundNumber }}</p>
    <p v-if="props.currPlayer" class="text-xl text-white ml-2 text-nowrap">{{ props.currPlayer }}'s Turn</p>
  </div>
  <div class="flex place-items-center">
    <div id="progress-bar" class="rounded-full w-full border-4 border-black bg-offwhite">
      <div :key="progress" :class="`bg-${props.color}`" class="h-10 rounded-full w-full outline outline-4"
          :style="{
            'width': `${progress}%`,
            'visibility': progress ? 'visible' : 'hidden'
          }">
      </div>
    </div>
    <img src="~/assets/images/clock.svg" alt="clock grow-0" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  duration: number;
  color: string;
  roundNumber?: string;
  currPlayer?: string;
}
const props = withDefaults(defineProps<Props>(), {
  duration: 30,
  color: 'grapefruit',
});

const spentDuration = ref<number>(0);
const progress = ref<number>(0);
onBeforeMount(() => {
  let interval = setInterval(() => {
      if (spentDuration.value < props.duration) {
        spentDuration.value += 1
        progress.value = parseInt(((props.duration - spentDuration.value) / props.duration) * 100);
        console.log("Progress = ", parseInt(progress.value));
      }
  }, 1000)
})
</script>
