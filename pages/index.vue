<script setup>
</script>

<template>
  <div class="bg-slate-900 h-dvh p-5 grid content-center">
    <!-- <Header /> -->
    <div class="main-content flex space-x-10 ml-28 mr-28 ">
      <div class="left flex-1 basis-2/3 p-4">
        <WindowCard class="w-fill" header-color="richblue">
          <div class="p-10">
            <IconsMainLogo class="w-fill min-w-20" />
          </div>
        </WindowCard> 
      </div>
      <div class="right flex-1 basis-1/3 p-4">
        <WindowCard>
          <div class="p-5 space-y-5">
            <ConsoleField placeholder-text="Game Code_"/>
            <ThiccButton>
              <h3>Join a Game</h3>
            </ThiccButton>
            <ThiccButton color="offwhite">
              <h3>Start a Game</h3>
            </ThiccButton>
          </div>
        </WindowCard>
      </div>
    </div>

  </div>
</template>
