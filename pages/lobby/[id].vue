<template>
  <div
    id="login"
    class="bg-gradient-to-tr from-richpink to-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
    <Header />
    <main class="grow flex flex-col justify-center">
    </main>
  </div>
</template>


<script setup lang="ts">
const { createGame } = useLobby()
const router = useRouter()
const route = useRoute()

const gameId = route.params.id;

</script>
