'use server'

import { createClient } from '@/lib/supabase/server'

export interface Option {
  id: string
  group_id: string
  name: string
  total_submissions: number
  total_score: number
}

export async function createOption(data: {
  id: string
  group_id: string
  name: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('voters_options').insert({
    id: data.id,
    group_id: data.group_id,
    name: data.name,
  })

  if (error) throw new Error(error.message)
}

export async function updateOption(id: string, data: { name?: string }) {
  const supabase = await createClient()

  const { data: option, error } = await supabase
    .from('voters_options')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return option as Option
}

export async function deleteOption(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('voters_options').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
