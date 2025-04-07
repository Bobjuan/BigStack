import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://qumggiovbwzuvcjinvzo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bWdnaW92Ynd6dXZjamludnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTgyMjYsImV4cCI6MjA1OTYzNDIyNn0.yhepBMqBsDfOf1hg1ZMOTTYNIkrqP1a0qsGOlIBPvCQ'
)

console.log("🧠 dashboard.js loaded")

const greetingEl = document.getElementById('dashboard-greeting')
if (!greetingEl) {
  console.error("❌ Could not find #dashboard-greeting in HTML.")
}

const { data: { session }, error: sessionError } = await supabase.auth.getSession()

console.log("🟢 Session:", session)
console.log("🔴 Session Error (if any):", sessionError)

if (!session || !session.user) {
  console.warn("⚠️ No active session — redirecting to login.")
  window.location.href = 'index.html'
} else {
  const userId = session.user.id
  console.log("👤 Logged in as user ID:", userId)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single()

  console.log("📦 Profile result:", profile)
  console.log("❌ Profile error (if any):", error)

  if (error || !profile?.username) {
    greetingEl.textContent = 'Welcome back!'
  } else {
    greetingEl.textContent = `Welcome back, ${profile.username} 👋`
  }
}

window.logout = async function () {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}
