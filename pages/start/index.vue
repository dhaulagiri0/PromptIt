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
          <div class="
            container
            p-4
            flex
            items-center
            space-x-4
            "
          >
            <div class="flex-none">
              <UserIcon pfp="pfp"/>
            </div>
            <div 
              class="
              w-full
              rounded-vl
              bg-black
              border-4
              border-white
              text-xl
              text-white
              p-4 
              text-nowrap 
              text-ellipsis">
              <p>
              {{ username }}
              </p>
            </div>
          </div>
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
              <h3>You are</h3>
              <h3>Cringe_</h3>
            </div>
          </div>
          <h3 class="text-white text-center">Hello</h3>
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
              <div v-for="task in indivTasks['WynHlrBXhUckXXHi3NrijZ88sV83']" 
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
const gameStore =  useGameStore();
const { indivTasks } = storeToRefs(gameStore);
let unsub: Unsubscribe | null = null;
const { subscribeGameState } = useGameListeners(); 
const { getCurrentUser } = useAuth(); 
const router = useRouter();

const gameId = "74hjv3";
const goBack = () => router.push('/');
let user = reactive<User | null>(null);
const username = ref<string>("Username");
onBeforeMount(async () => {
    const _user = await getCurrentUser();
    if (_user) {
        username.value = _user.displayName;
    }
    unsub = await subscribeGameState(_user, gameId, gameStore, goBack);

    watch(indivTasks, () => {
        console.log(indivTasks.value);
    })  
});


</script>
