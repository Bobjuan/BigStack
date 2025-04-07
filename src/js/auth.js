import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://qumggiovbwzuvcjinvzo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bWdnaW92Ynd6dXZjamludnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTgyMjYsImV4cCI6MjA1OTYzNDIyNn0.yhepBMqBsDfOf1hg1ZMOTTYNIkrqP1a0qsGOlIBPvCQ'
)

// DOM elements
const loginTab = document.getElementById('login-tab')
const signupTab = document.getElementById('signup-tab')
const loginForm = document.getElementById('login-form')
const signupForm = document.getElementById('signup-form')
const message = document.getElementById('auth-message')

// Toggle views
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active')
  signupTab.classList.remove('active')
  loginForm.classList.remove('hidden')
  signupForm.classList.add('hidden')
  message.textContent = ''
})

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active')
  loginTab.classList.remove('active')
  signupForm.classList.remove('hidden')
  loginForm.classList.add('hidden')
  message.textContent = ''
})

// Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()
  
    const username = document.getElementById('signup-username').value.trim().toLowerCase()
    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
  
    // Validate username
    if (!username.match(/^[a-z0-9_]{3,20}$/)) {
      message.textContent = "❌ Username must be 3–20 characters, letters/numbers/underscores only."
      message.className = "text-sm text-center mt-4 text-red-500"
      return
    }
  
    // Check if username is taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()
  
    if (existing) {
      message.textContent = "❌ That username is already taken."
      message.className = "text-sm text-center mt-4 text-red-500"
      return
    }
  
    // Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
  
    if (signUpError) {
      message.textContent = `❌ ${signUpError.message}`
      message.className = "text-sm text-center mt-4 text-red-500"
      return
    }
  
    // Insert username into profiles table
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: signUpData.user.id, username })
  
    if (insertError) {
      message.textContent = "❌ Failed to save username. Try again later."
      message.className = "text-sm text-center mt-4 text-red-500"
      return
    }
  
    message.textContent = "✅ Signup complete! Check your email to verify."
    message.className = "text-sm text-center mt-4 text-green-400"
    signupForm.reset()
  })

// Log In
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    message.textContent = `Error: ${error.message}`
    message.className = 'text-sm text-center mt-4 text-red-500'
  } else {
    message.textContent = '✅ Login successful! Redirecting...'
    message.className = 'text-sm text-center mt-4 text-green-400'
    setTimeout(() => {
        window.location.href = 'dashboard.html'
      }, 1000)
      
  }
})
