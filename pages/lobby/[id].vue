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
          <ThiccButton v-if="hostId == userId" class="w-52 text-black bg-white">
            Start Game
          </ThiccButton>
        </div>
        <WindowCard class="w-[800px]" header-color="richpink" headerText="Lobby">
          <div class="grid grid-cols-2 grid-rows-4">
            <div v-if="Object.keys(players).length != 0" v-for="player in players" :key="player['id']">
              <!-- <UserLobby 
              :text="player['name']" 
              :show-button="hostId == userId && player['id'] != userId"/> -->
              <UserLobby 
              :text="player['name']" 
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
  const { updateUserState, subscribeHostState } = useUserState();
  import { type User } from 'firebase/auth';
  import { type Unsubscribe } from 'firebase/firestore';
  import { useGameStore } from '~/stores/game'; 
  const user = ref<User | null>(null);
  const userName = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const gameStore = useGameStore();
  const gameId = route.params.id;
  const { hostId, players, gameStatus } = storeToRefs(gameStore);
  const isHost = ref(userId == hostId);
  var unsub:Promise<Unsubscribe>;

  onBeforeMount(async () => {
    const _user = await getCurrentUser();
    if (_user) {
      user.value = _user;
    } else {
      router.push(`/`);
    }
    userName.value = _user["displayName"];
    userId.value = _user["uid"];

    updateUserState(userId.value, "ingame");

    if (userId.value == hostId.value) {
      console.log("is host");
    } else {
      console.log("not host");
      subscribeHostState(hostId.value, hostLeftCall);
    }
    unsub = subscribeGameState(_user, gameId, gameStore, goBack);
  })

  async function copyGameId() {
    await navigator.clipboard.writeText(gameId);
  }

  async function hostLeftCall() {
    (await unsub)();
    deleteGame(gameId);
    router.push("/");
  }

  async function goBack() {
    (await unsub)();
    if (isHost) {
      deleteGame(gameId);
    }
    router.push("/");
  }

</script>
