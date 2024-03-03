<template>
  <div
    id="login"
    class="bg-gradient-to-tr from-richpink to-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
    <Header />
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
            <h3>Login</h3>
          </ThiccButton>
          <ThiccButton class="mt-4 w-full bg-white text-black cursor-pointer" type="submit" @click="handleLoginWithGoogle">
            <h3>Login with Google</h3>
          </ThiccButton>
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
const { createUser, logInUserWithGoogle, sendResetEmail } = useAuth()
const router = useRouter()

const credentials = reactive({
  email: '',
  password: ''
})

async function handleSignUp() {
  console.log("Handling sign up");
  console.log("Email: ", credentials.email, " Password: ", credentials.password);
  if (!credentials.email || !credentials.password) {
    console.log('Please fill in all fields');
    return;
  }
  let user: User | undefined;
  try {
    user = createUser(credentials.email, credentials.password);
  } catch (e: any) {
    if (e.message == 'Firebase: Error (auth/email-already-in-use).') {
      console.log('Email already in use');
    } else {
      console.error(e);
    }
  }
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
