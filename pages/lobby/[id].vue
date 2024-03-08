<template>
  <div
    id="login"
    class="bg-gradient-to-tr from-richpink to-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
    <Header backVisible="true" :goBack="goBack"/>
    <main class="grow flex flex-row justify-center">
      <div v-if="hostId != undefined" class="flex items-center gap-16">
        <div class="space-y-4 max-w-80">
          <div class="
            border-black
            rounded-vl
            overflow-hidden
            p-3
            pl-5
            pr-5
            bg-white
            border-4
            text-black
            font-gohu
            text-xl
            "
            >
            <h3>Host</h3>
          </div>
          <div class="flex gap-4">
            <UserIcon />
            <ConsoleDisplay v-if="Object.keys(players).length != 0" class="grow" :text="players[hostId]['name']" />
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
            text-3xl
            drop-shadow-solid
            "
            @click="copyGameId"
            >
            <h3>Game Code:</h3>
            <div class="flex justify-between place-items-center">
              <h3>{{ gameId }}</h3>
              <img src="~/assets/images/copy.svg" alt="Copy" class="w-6 h-6" />
            </div>
          </div>
          <h3 class="text-white text-xl">Share this code with your friends!</h3>
          <ThiccButton v-if="hostId == userId" class="ml-auto w-fit text-black bg-white place-self-end">
            Start Game
          </ThiccButton>
        </div>
        <WindowCard class="w-[800px]" header-color="richpink" headerText="Lobby">
          <div class="grid grid-cols-2 grid-rows-4">
            <div v-if="Object.keys(players).length != 0" v-for="player in players" :key="player['id']">
              <UserLobby 
              :text="player['name']" 
              :show-button="hostId == userId && player['id'] != userId"
              :playerId="player['id']"
              :kickFun="kick"
              />
            </div>
          </div>
        </WindowCard>
      </div>
    </main>
  </div>
</template>


<script setup lang="ts">
  const { deleteGame } = useLobby();
  const { subscribeGameState } = useGameListeners();
  import { storeToRefs } from 'pinia';
  const router = useRouter();
  const route = useRoute();
  const { getCurrentUser } = useAuth();
  const { updateUserState, subscribeHostState, kickPlayer } = useUserState();
  import { type User } from 'firebase/auth';
  import { type Unsubscribe } from 'firebase/firestore';
  import { useGameStore } from '~/stores/game'; 
  import { onMounted } from 'vue';
  const user = ref<User | null>(null);
  const userName = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const gameStore = useGameStore();
  const gameId = route.params.id;
  const { hostId, players, gameStatus } = storeToRefs(gameStore);
  var unsub:Unsubscribe;

  onBeforeMount(async () => {
    const _user = await getCurrentUser();
    if (_user) {
      user.value = _user;
    } else {
      router.push(`/`);
    }
    userName.value = _user["displayName"];
    userId.value = _user["uid"];

    await updateUserState(userId.value, "ingame");
    unsub = await subscribeGameState(_user, gameId, gameStore, goBack);
    
    // wait for game data to update
    watch(hostId, () => {
      if (userId.value == hostId.value) {
        console.log("is host");
      } else {
        console.log("not host");
        subscribeHostState(hostId.value, hostLeftCall);
      }
    })  
  })

  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  
  async function copyGameId() {
    await navigator.clipboard.writeText(gameId);
  }

  async function hostLeftCall() {
    unsub();
    deleteGame(gameId);
    router.push("/");
  }

  async function goBack() {
    unsub();
    if (userId.value == hostId.value) {
      deleteGame(gameId);
    }
    router.push("/");
  }
  async function kick(playerId: string) {
    kickPlayer(playerId, gameId);
  }

</script>
