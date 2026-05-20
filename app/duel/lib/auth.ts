import { supabase } from '@/lib/supabase'

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const user = await getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('id, handle, initials')
    .eq('id', user.id)
    .single()
  return data
}

export async function hasProfile() {
  const profile = await getProfile()
  return profile !== null
}
