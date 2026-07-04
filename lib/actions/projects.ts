'use server'

import { createClient } from '@/lib/supabase/server'

export interface Project {
  id: string
  name: string
  status: string
  created_at: string
}

export async function createProject(data: { id: string; name: string; status: string; created_at: string }) {
  const supabase = await createClient()

  const { error } = await supabase.from('voters_projects').insert({
    id: data.id,
    name: data.name,
    status: data.status,
    created_at: data.created_at,
  })

  if (error) throw new Error(error.message)
}

export async function updateProject(id: string, data: { name?: string; status?: string }) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('voters_projects')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return project as Project
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('voters_projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
