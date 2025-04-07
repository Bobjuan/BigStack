// /src/js/signup.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://qumggiovbwzuvcjinvzo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bWdnaW92Ynd6dXZjamludnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTgyMjYsImV4cCI6MjA1OTYzNDIyNn0.yhepBMqBsDfOf1hg1ZMOTTYNIkrqP1a0qsGOlIBPvCQ'

const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('signup-form')
const message = document.getElementById('signup-message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    message.textContent = `Error: ${error.message}`
    message.classList.add('text-red-500')
  } else {
    message.textContent = 'Signup successful! Check your email to verify your account.'
    message.classList.remove('text-red-500')
    message.classList.add('text-green-400')
    form.reset()
  }
})
