<template>
  <div
    id="login">
    <form class="flex flex-col w-1/2 text-white" @submit.prevent="handleSignUp">
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
        Sign Up
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
const { createUser, sendResetEmail } = useAuth()
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
</script>
