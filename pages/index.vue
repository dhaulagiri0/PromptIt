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
            <ConsoleField 
              v-model="gameCode"
              class="w-fill" placeholder-text="Game Code_"/>
            <ThiccButton @click="handleJoinGame">
              <h3>Join a Game</h3>
            </ThiccButton>
            <ThiccButton color="offwhite"  @click="handleCreateGame">
              <h3>Start a Game</h3>
            </ThiccButton>
            <div v-if="showError" class="text-center">
              <h3>{{ errorMessage }}</h3>
            </div>
          </div>
        </WindowCard>
        <div v-if="user == null" class="flex p-11 min-w-[100px]">
              <button class="flex-2 basis-2/5 text-offwhite text-2xl text-right" @click="router.push('/login')">Login</button>
              <p class="flex-2 basis-1/5 text-offwhite text-2xl text-center">|</p>
              <button class="flex-2 basis-2/5 text-offwhite text-2xl text-left" @click="router.push('/signup')">Sign Up</button>
        </div>
      </div>
    </div>
    <Footer class="h-17 inset-x-0 fixed bottom-0"/>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { createGame, joinGame } = useLobby();
const { onDisconnectListener, updateUserState } = useUserState();
const { getCurrentUser } = useAuth();
import { type User } from 'firebase/auth';
import { onMounted } from 'vue';
const user = ref<User | null>(null);
const showError = ref(false);
const errorMessage = ref<string>("Error 404");
const gameCode = ref("");

onBeforeMount(async () => {
  const _user = await getCurrentUser();
  if (_user) {
    console.log("found user")
    user.value = _user;
    onDisconnectListener(user.value);
    updateUserState(user.value.uid, "online");
  }
})

const handleCreateGame = async () => {
  const _user = await getCurrentUser()
  if (!_user) {
    showError.value=true;
    errorMessage.value = "You must be logged in to create a game"
    return console.log("You must be logged in to create a game")
  }
  
  user.value = _user
  const game = await createGame(user.value.uid, user.value.displayName)
  router.push(`/lobby/${game}`)
}

const handleJoinGame = async () => {
  const _user = await getCurrentUser()
  if (!_user) {
    showError.value=true;
    errorMessage.value = "You must be logged in to create a game"
    return console.log("You must be logged in to create a game")
  }

  if (gameCode.value == "") {
    return console.log("You must enter a valid game code")
  }

  user.value = _user
  const game = await joinGame(gameCode.value, user.value.uid, user.value.displayName)
  if (game != null) {
    router.push(`/lobby/${gameCode.value}`)
  }
}
</script>
