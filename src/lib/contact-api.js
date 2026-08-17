import { supabase } from './supabase.js'

export async function submitContactMessage({ name, email, phone, service, message }) {
  const { error } = await supabase.from('contact_messages').insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim() || null,
    service: service.trim() || null,
    message: message.trim(),
  })
  if (error) throw error
}