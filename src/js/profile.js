import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://qumggiovbwzuvcjinvzo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bWdnaW92Ynd6dXZjamludnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTgyMjYsImV4cCI6MjA1OTYzNDIyNn0.yhepBMqBsDfOf1hg1ZMOTTYNIkrqP1a0qsGOlIBPvCQ'
)

async function loadProfile() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = 'index.html'
    return
  }

  const user = session.user
  document.getElementById('profile-email').textContent = user.email

  // Fetch username from `profiles` table
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profile && profile.username) {
    document.getElementById('profile-username').textContent = profile.username
  } else {
    document.getElementById('profile-username').textContent = 'N/A'
  }
}

window.logout = async function () {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}

loadProfile()
