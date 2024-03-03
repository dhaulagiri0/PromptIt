<template>
  <div id="Main" class="bg-gradient-to-tr from-richpink to-richblue h-dvh p-5 grid content-center font-gohu">
    <div class="main-content flex space-x-20 ml-64 mr-64 ">
      <div class="left flex-1 basis-2/3 p-4">
        <WindowCard class="w-fill" header-color="richblue">
          <div class="p-10">
            <IconsMainLogo class="w-fill min-w-20" />
          </div>
        </WindowCard> 
        <div class="text-center p-10">
         <p class="text-offwhite text-2xl">A short description about the game here.</p>
        </div>
      </div>
      <div class="right flex-1 basis-1/3 p-4">
        <WindowCard class="min-w-80">
          <div class="p-5 space-y-5">
            <ConsoleField class="w-fill" placeholder-text="Game Code_"/>
            <ThiccButton>
              <h3>Join a Game</h3>
            </ThiccButton>
            <ThiccButton color="offwhite">
              <h3>Start a Game</h3>
            </ThiccButton>
          </div>
        </WindowCard>
        <div class="flex p-10 min-w-[100px]">
              <button class="flex-1 basis-2/5 text-offwhite text-2xl text-right" a-href="">Login</button>
              <p class="flex-1 basis-1/5 text-offwhite text-2xl text-center">|</p>
              <button class="flex-1 basis-2/5 text-offwhite text-2xl text-left" a-href="">Sign Up</button>
        </div>
      </div>
    </div>
    <Footer class="h-16 inset-x-0 fixed bottom-0"/>
  </div>
</template>

<script setup lang="ts">
  const { getCurrentUser } = useAuth();
  console.log(getCurrentUser().value)
</script>
