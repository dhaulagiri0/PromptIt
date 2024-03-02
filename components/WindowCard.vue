<script setup></script>

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
    drop-shadow-solid"
  >
    <div class="block">
      <div class="header space-x-4 text-right p-2 border-b-4 border-black bg-grapefruit">
        <img class="inline text-l" src="/assets/svgs/ui-circle.svg"/>
        <img class="inline text-l" src="/assets/svgs/ui-dash.svg"/>
        <img class="inline text-l" src="/assets/svgs/ui-x.svg"/>
        <!-- <span class="text-3xl">minus </span> -->
        <!-- <span class="text-3xl">cross</span> -->
      </div>
      <div class="content-container p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
