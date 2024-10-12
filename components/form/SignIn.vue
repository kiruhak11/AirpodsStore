<template>
  <AutoForm
    :form="signInForm"
    :schema="signInSchema"
    :field-config="{
      password: {
        inputProps: {
          type: 'password',
        },
      },
    }"
    @submit="signIn"
  >
    <Button type="submit" class="w-full mt-6">Sign in</Button>
  </AutoForm>
</template>

<script setup lang="ts">
import * as z from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { AutoForm } from '~/components/ui/auto-form/index';
import { Button } from '@/components/ui/button/index';
import { useToast } from '@/components/ui/toast/use-toast';

const { toast } = useToast();

const signInSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).email({ message: 'Please enter a valid email address.' }).describe('Email'),
  password: z.string({ required_error: 'Password is required.' }).describe('Password'),
});

const signInForm = useForm({
  validationSchema: toTypedSchema(signInSchema),
});

const signIn = async (values: Record<string, any>) => {
  const client = useSupabaseClient();

  try {
    const { error } = await client.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast({
        title: 'Sign in error',
        description: error.message,
      });
      return;
    }
    toast({
      title: 'Success!',
      description: 'You are is logged in!',
    });

    return navigateTo('/');
  } catch (err) {
    toast({
      title: 'Connection error',
      description: `${err}`,
    });
  }
};
</script>
