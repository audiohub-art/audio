'use server';

import { setAuthCookies, clearAuthCookies } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function login(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const password = formData.get('password');

  if (!name || !password) {
    return { error: 'Name and password are required' };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.message || 'Login failed' };
    }

    const data = await res.json();
    await setAuthCookies(data);

  } catch (error) {
    return { error: 'Something went wrong. Please try again later.' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function register(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const password = formData.get('password');

  if (!name || !password) {
    return { error: 'Name and password are required' };
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return { error: errorData?.message || 'Registration failed' };
    }

    const data = await res.json();
    await setAuthCookies(data);

  } catch (error) {
    return { error: 'Something went wrong. Please try again later.' };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function logout() {
  await clearAuthCookies();
  revalidatePath('/');
  redirect('/login');
}
