<template>
  <div
    id="login">
    <form class="flex flex-col w-1/2 text-white" @submit.prevent="handleLogin">
      <input
        type="email"
        class= "bg-black mt-2 p-2 rounded-md"
        v-model="credentials.email"
        placeholder="Email_"
        required />
      <input
        type="password"
        class= "bg-black mt-2 p-2 rounded-md"
        v-model="credentials.password"
        placeholder="Password_"
        required />
      <button
        type="submit"
        class="bg-black mt-2 p-2 rounded-md">
        Log In
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
const { logInUser, sendResetEmail } = useAuth()
const router = useRouter()

const credentials = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  console.log("Handling log in");
  console.log("Email: ", credentials.email, " Password: ", credentials.password);
  if (!credentials.email || !credentials.password) {
    console.log('Please fill in all fields');
    return;
  }
  logInUser(credentials.email, credentials.password)
    .then((user) => {
      console.log("User logged in: ", user);
      router.push('/');
    })
    .catch((e: any) => {
      console.error(e);
    });
}
</script>
