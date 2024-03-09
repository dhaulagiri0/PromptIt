<template>
  <div
    id="Start"
    class="
    bg-gradient-to-tr from-richpink to-richblue
    h-screen
    font-gohu
    overflow-x-hidden 
    flex 
    flex-col">
    <Header class="absolute mt-4 ml-6"/>
    <main class="grow flex flex-row justify-center">
      <div class="flex items-center gap-16">
        <div class="w-80">
          <UserNormal :text="username"/>
          <div class="
            border-white
            rounded-vl
            overflow-hidden
            p-3
            pl-5
            pr-5
            grow
            bg-black
            border-4
            text-offwhite
            font-gohu
            text-3xl
            "
            >
            <div class="flex flex-col justify-between place-items-center">
              <h3>You are cringe</h3>
            </div>
          </div>
        </div>
          <div class="
            border-white
            rounded-vl
            overflow-hidden
            p-3
            pl-5
            pr-5
            bg-black
            border-4
            text-offwhite
            font-gohu
            text-xl
            "
            >
            <div class="flex flex-col w-96 justify-between">
              <h3>WHAT TO DO:</h3>
              <div></div>
              <br>
              <!--TODO: Change colour to actual yellow-->
              <h3 class="text-grapefruit">Individual Tasks:</h3>
              <div v-if="user != null" v-for="task in indivTasks[user.uid]" 
                :key="indivTasks">
                <p>{{ task["description"] }}</p>
              </div>
              <br>
              <h3 class="text-richred">Watch out for the saboteur!</h3>
            </div>
          </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const gameStore =  useGameStore();
const { indivTasks, gameId } = storeToRefs(gameStore);
const { checkGame } = useTasks();
const { getCurrentUser } = useAuth(); 
const router = useRouter();

// const gameId = "74hjv3";
const goBack = () => router.push('/');
let user = ref<User | null>(null);
const username = ref<string>("Username");
onBeforeMount(async () => {
    const _user = await getCurrentUser();
    if (_user) {
        user.value = _user
        username.value = _user.displayName;
    }

    const gameSnap = await checkGame(gameId.value)
    console.log(gameId.value)
    console.log(gameSnap)
    if (!gameSnap) {
      goBack();
    }
});

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

onMounted(async () => {
  // wait 10 seconds 
  await delay(5000);
  // push to game page
  router.push("/game/" + gameId.value)
})

</script>
