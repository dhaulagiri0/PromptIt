<template>
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-black">
    <main
      class="flex h-full flex-col text-center items-center justify-center gap-4 text-2xl text-primary">
        <h1 class="text-6xl font-bold">{{ props.error.statusCode }}</h1>
        <h2 class="text-4xl font-bold">{{ props.error.statusMessage }}</h2>
        <p class="text-2xl">{{ props.error.message }}</p>
        <p class="text-2xl">{{ props.error.description }}</p>
        <pre class="text-2xl">{{ props.error.data }}</pre>
    </main>
  </div>
</template>

<script setup lang="ts">
type Props = {
  error: {
    url: string;
    statusCode: number;
    statusMessage: string;
    message: string;
    description: string;
    data: any;
  };
};

const props = defineProps<Props>();
</script>

