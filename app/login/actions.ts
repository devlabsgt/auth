'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

interface LoginState {
  message: string;
  emailValue: string;
  passwordValue: string;
}

const defaultState: LoginState = {
  message: '',
  emailValue: '',
  passwordValue: '',
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    const errorMessage = error.message.includes('Invalid login credentials') 
      ? 'CredentialsError'
      : error.message

    return { 
      message: errorMessage,
      emailValue: data.email,
      passwordValue: data.password,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/x/account')
  
  return defaultState;
}