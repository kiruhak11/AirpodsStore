<template>
  <div class="auth-container">
    <form @submit.prevent="isSignUp ? signUp : signIn" class="auth-form">
      <h2>{{ isSignUp ? 'Sign Up' : 'Sign In' }}</h2>

      <input v-if="isSignUp" v-model="username" type="text" placeholder="Username" required class="input-field" />

      <input v-model="email" type="email" placeholder="Email" required class="input-field" />

      <input v-model="password" type="password" placeholder="Password" required class="input-field" />

      <input v-if="isSignUp" v-model="confirmPassword" type="password" placeholder="Confirm Password" required class="input-field" />

      <button v-if="isSignUp" type="submit" class="auth-button" @click="signUp">{{ 'Sign Up' }}</button>
      <button v-if="!isSignUp" type="submit" class="auth-button" @click="signIn">{{ 'Sign In' }}</button>

      <p class="toggle-auth-mode">
        <a href="#" @click.prevent="toggleAuthMode">
          {{ isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }}
        </a>
      </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const username = ref<string>('');
const isSignUp = ref<boolean>(false);
const router = useRouter();

const toggleAuthMode = () => {
  isSignUp.value = !isSignUp.value;
};

const signIn = async () => {
  const client = useSupabaseClient();

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.error('Ошибка входа:', error.message);
    } else {
      console.log('Пользователь успешно вошел:', data);
      router.push('/');
    }
  } catch (err) {
    console.error('Ошибка при попытке входа:', err);
  }
};

const signUp = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Пароли не совпадают');
    return;
  }

  const client = useSupabaseClient();

  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value,
        },
      },
    });

    if (error) {
      console.log('Ошибка регистрации:', error.message);
    } else {
      console.log('Пользователь успешно зарегистрирован:', data);
      router.push('/');
    }
  } catch (err) {
    console.log('Ошибка при попытке регистрации:', err);
  }
};
</script>

<style lang="scss" scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 0 16px;
}

.auth-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-form h2 {
  margin-bottom: 1.5rem;
  font-size: 24px;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
}

.toggle-auth-mode {
  margin-top: 1rem;

  a {
    color: #007bff;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
