<template>
  <div
    id="login"
    class="bg-gradient-to-tr from-richpink to-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
    <Header class="absolute"/>
    <main class="grow flex flex-col justify-center">
      <WindowCard class="place-items-center max-w-96">
        <form class="flex flex-col text-white mx-4" @submit.prevent="handleSignUp">
          <input class="
            border-white
            mt-2
            rounded-vl
            overflow-hidden
            p-3
            px-5
            bg-black
            border-4
            text-offwhite
            text-xl
            w-full
            "
            type="email"
            v-model="credentials.email"
            placeholder="Email_"
            required
            />
          <input class="
            border-white
            rounded-vl
            mt-4
            overflow-hidden
            p-3
            px-5
            bg-black
            border-4
            text-offwhite
            text-xl
            w-full
            "
            type="password"
            v-model="credentials.password"
            placeholder="Password_"
            required
            />
          <ThiccButton class="mt-4 w-full bg-white text-black cursor-pointer" type="submit" @click="handleSignUp">
            <h3>Sign Up</h3>
          </ThiccButton>
          <ThiccButton class="mt-4 w-full bg-white text-black cursor-pointer" type="submit" @click="handleLoginWithGoogle">
            <h3>Login with Google</h3>
          </ThiccButton>
          <div v-if="showError" class="text-center mt-4 text-black">
            <h3>{{ errorMessage }}</h3>
          </div>
        </form>
      </WindowCard>
      <div class="mt-4 text-xl text-white text-center cursor-pointer" @click='router.push("/login")'>
        <p>Login</p>
      </div>
    </main>
    <Footer />
  </div>
</template>


<script setup lang="ts">
const { createUser, validatePassword, logInUserWithGoogle, sendResetEmail } = useAuth()
const router = useRouter()

const showError = ref(false)
const errorMessage = ref<string>("")

const credentials = reactive({
  email: '',
  password: ''
})

async function handleSignUp() {
  showError.value = false;
  console.log("Email: ", credentials.email, " Password: ", credentials.password);
  if (!credentials.email || !credentials.password) {
    showError.value = true;
    errorMessage.value = "Please enter an email and password";
  }
  if (!validatePassword(credentials.password)) {
    showError.value = true;
    errorMessage.value = "Password must have uppercaee, lowercase, number, and be at least 8 characters long";
    return;
  }
  let user: User | undefined;
  try {
    user = await createUser(credentials.email, credentials.password);
    if (user) {
      router.push('/');
    }
  } catch (e: any) {
    if (e.message == 'Firebase: Error (auth/email-already-in-use).') {
      errorMessage.value = "Email already in use";
    } else {
      errorMessage.value = e.message;
      console.error(e);
    }
    showError.value = true;
  }
  console.log(showError.value);
}

async function handleLoginWithGoogle() {
  console.log("Handling log in with Google");
  logInUserWithGoogle()
    .then((user) => {
      console.log("User logged in: ", user);
      router.push('/');
    })
    .catch((e: any) => {
      console.error(e);
    });
}
</script>
