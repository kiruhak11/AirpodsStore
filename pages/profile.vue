<template>
  <nuxt-layout>
    <div class="container">
      <h1>Профиль пользователя</h1>

      <div class="user-info">
        <label for="username">Имя пользователя</label>
        <input v-model="username" type="text" id="username" class="input-field" />
        <button @click="updateUsername" class="profile-button">Обновить имя</button>
      </div>

      <div class="password-change">
        <label for="current-password">Текущий пароль</label>
        <input v-model="currentPassword" type="password" id="current-password" class="input-field" />

        <label for="new-password">Новый пароль</label>
        <input v-model="newPassword" type="password" id="new-password" class="input-field" />

        <button class="profile-button" @click="updatePassword">Изменить пароль</button>

        <Button class="" variant="destructive" @click="deleteAccount">Удалить аккаунт</Button>

        <Button class="mt-6" @click="signOut">Выйти</Button>
      </div>

      <div class="total-spent">
        <p>
          Вы потратили на покупки: <strong>{{ totalSpent }} руб.</strong>
        </p>
      </div>
    </div>
  </nuxt-layout>
</template>

<script lang="ts" setup>
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const username = ref<string>(user?.value?.user_metadata?.username || '');
const currentPassword = ref<string>('');
const newPassword = ref<string>('');
const totalSpent = ref<number>(0);

const fetchTotalSpent = async () => {
  if (!user.value || !user.value.id) {
    console.error('Пользователь не авторизован или id пользователя отсутствует.');
    return;
  }

  try {
    const { data, error } = await client.from('orders').select('total_price').eq('user_id', user.value.id);

    if (error) {
      console.error('Ошибка получения суммы покупок:', error.message);
    } else {
      totalSpent.value = data.reduce((sum, order) => sum + order.total_price, 0);
    }
  } catch (err) {
    console.error('Ошибка при попытке получить данные покупок:', err);
  }
};

const verifyCurrentPassword = async (): Promise<boolean> => {
  const currentUser = user.value;

  if (!currentUser || !currentUser.email) {
    console.error('Пользователь не авторизован или email отсутствует.');
    return false;
  }

  const { error } = await client.auth.signInWithPassword({
    email: currentUser.email,
    password: currentPassword.value,
  });

  if (error) {
    console.error('Ошибка проверки текущего пароля:', error.message);
    return false;
  }

  return true;
};

const updateUsername = async () => {
  try {
    const { error } = await client.auth.updateUser({
      data: { username: username.value },
    });

    if (error) {
      console.error('Ошибка обновления имени пользователя:', error.message);
    } else {
      console.log('Имя пользователя успешно обновлено');
    }
  } catch (err) {
    console.error('Ошибка при попытке обновить имя пользователя:', err);
  }
};

const updatePassword = async () => {
  const isCurrentPasswordValid = await verifyCurrentPassword();
  if (!isCurrentPasswordValid) {
    alert('Текущий пароль неверен. Пожалуйста, попробуйте снова.');
    return;
  }

  try {
    const { error } = await client.auth.updateUser({
      password: newPassword.value,
    });

    if (error) {
      console.error('Ошибка смены пароля:', error.message);
    } else {
      console.log('Пароль успешно изменен');
      alert('Пароль успешно изменен!');
      currentPassword.value = '';
      newPassword.value = '';
    }
  } catch (err) {
    console.error('Ошибка при попытке изменить пароль:', err);
  }
};

const deleteAccount = async () => {
  try {
    const userId = user.value?.id;

    if (!userId) {
      console.error('ID пользователя не найден.');
      return;
    }

    const response = await $fetch('/api/delete-user', {
      method: 'POST',
      body: { userId },
    });

    console.log('Ответ от сервера:', response);

    if (response.success) {
      console.log('Аккаунт успешно удален');
      await router.push('/login');
    } else {
      console.error('Не удалось удалить аккаунт.');
    }
  } catch (err) {
    console.error('Ошибка при попытке удалить аккаунт:', err);
  }
};

const signOut = async () => {
  try {
    await client.auth.signOut();
    router.push('/login');
  } catch (err) {
    console.error('Ошибка при попытке выйти из аккаунта:', err);
  }
};

onMounted(() => {
  if (user.value) {
    fetchTotalSpent();
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  background-color: $cartBackgroundColor;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  font-size: 24px;
  margin-bottom: 1.5rem;
}

.user-info,
.password-change,
.total-spent {
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 16px;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.profile-button,
.signout-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile-button {
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
}

.delete-button {
  background-color: #ff4d4d;
  color: white;

  &:hover {
    background-color: #cc0000;
  }
}

.signout-button {
  background-color: #666;
  color: white;

  &:hover {
    background-color: #333;
  }
}
</style>
