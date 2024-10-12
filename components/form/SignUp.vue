<template>
  <AutoForm
    :form="signUpForm"
    :schema="signUpSchema"
    :field-config="{
      password: {
        inputProps: {
          type: 'password',
        },
      },
      confirm: {
        inputProps: {
          type: 'password',
        },
      },
    }"
    @submit="signUp"
  >
    <Button type="submit" class="w-full mt-6">Create an account</Button>
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

const signUpSchema = z
  .object({
    username: z.string({ required_error: 'Username is required.' }).describe('Username'),
    email: z.string({ required_error: 'Email is required.' }).email({ message: 'Please enter a valid email address.' }).describe('Email'),
    password: z.string({ required_error: 'Password is required.' }).describe('Password'),
    confirm: z.string({ required_error: 'Password confirm is required.' }).describe('Confirm password'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords must match.',
    path: ['confirm'],
  });

const signUpForm = useForm({
  validationSchema: toTypedSchema(signUpSchema),
});

const signUp = async (values: Record<string, any>) => {
  const client = useSupabaseClient();

  try {
    const { error } = await client.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
        },
      },
    });

    if (error) {
      toast({
        title: 'Sign up error',
        description: error.message,
      });
    } else {
      toast({
        title: 'Success!',
        description: 'You are is logged in!',
      });

      return navigateTo('/');
    }
  } catch (err) {
    toast({
      title: 'Connection error',
      description: err,
    });
  }
};
</script>
