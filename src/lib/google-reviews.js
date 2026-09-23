import { supabase } from './supabase.js'

const REVIEWS_ERROR_MESSAGE =
  'We could not load the reviews. Please check your connection and try again.'

export async function fetchGoogleReviews() {
  const { data, error } = await supabase.functions.invoke('google-reviews', {
    method: 'POST',
  })
  if (error || !data?.ok) {
    throw new Error(data?.error || REVIEWS_ERROR_MESSAGE)
  }
  return data
}