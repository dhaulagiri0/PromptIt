<script setup>
</script>

<template>
  <div class="bg-slate-900 h-dvh p-5">
    <Header />
    <div class="main-content flex space-x-10 ml-28 mr-28">
      <div class="left flex-1 p-4">
        <WindowCard class="w-fill" header-color="richblue">
          <div class="p-10">
            <IconsMainLogo class="w-fill min-w-20" />
          </div>
        </WindowCard> 
      </div>
      <div class="right flex-none p-4">
        <WindowCard class="">
          <ConsoleField place/>
          <ThiccButton />
          <ThiccButton />
        </WindowCard>
      </div>
    </div>
  </div>
</template>
