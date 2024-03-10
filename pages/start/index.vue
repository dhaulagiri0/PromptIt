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
    <main class="flex flex-row justify-center items-center w-fill h-full">
      <div class="flex items-center">
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
            <div class="flex flex-col justify-between">
              <h3 class="mb-4">WHAT TO DO:</h3>
              <div class="mb-4">
                <p>Each game is split into multiple rounds.</p>
                <p>Each round is split into multiple turns. One turn for each player.</p>
                <p>On your turn, you will see an image.</p>
                <p>Describing this image as detailedly as possible, earns you points.</p>
                <p>Describing it creatively will also earn you points.</p>
                <p>Your description will generate another image for the next player to see.</p>
              </div>
              <br>
              <!--TODO: Change colour to actual yellow-->
              <h3 class="text-richblue">General Tasks:</h3>
              <h3 class="text-offwhite mb-4">These tasks are for everyone. Complete to earn points.</h3>
              <h3 class="text-richyellow">Individual Tasks:</h3>
              <h3 class="text-offwhite">These tasks are exclusive to you. Complete to earn extra points.</h3>
              <!-- <div v-if="user != null && indivTasks != undefined" v-for="task in indivTasks[user.uid]" 
                :key="indivTasks">
                <p>{{ task["description"] }}</p>
              </div> -->
              <br>
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
    if (!gameSnap) {
      goBack();
    }
});

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

onMounted(async () => {
  // wait 15 seconds
  await delay(15000);
  // push to game page
  router.push("/game/" + gameId.value)
})

</script>
