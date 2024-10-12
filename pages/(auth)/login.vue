<template>
  <NuxtLayout name="auth">
    <Card class="w-full max-w-sm min-w-96 transition-height">
      <CardHeader>
        <CardTitle class="text-2xl">{{ isSignInState ? 'Login' : 'Sign Up' }}</CardTitle>
        <CardDescription>
          {{ isSignInState ? 'Enter your email below to login to your account.' : 'Enter your information to create an account' }}
        </CardDescription>
      </CardHeader>
      <CardContent v-if="isSignInState" class="grid gap-4">
        <FormSignIn />
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <Button class="p-0" variant="link" @click="setSignInState(false)"> Sign up </Button>
        </div>
      </CardContent>
      <CardContent v-else class="grid gap-4">
        <FormSignUp />
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <Button class="p-0" variant="link" @click="setSignInState(true)"> Sign in </Button>
        </div>
      </CardContent>
    </Card>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/index';
import { Button } from '@/components/ui/button/index';

const isSignInState = ref<boolean>(true);

const setSignInState = (newWalue: boolean) => {
  isSignInState.value = newWalue;
};
</script>
