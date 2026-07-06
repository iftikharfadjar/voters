'use server'

import { createClient } from '@/lib/supabase/server'

export interface VotingGroup {
  id: string
  batch_id: string
  name: string
  interaction_type: 'VOTE' | 'RATE'
  max_score: number
  require_all_options: boolean
  created_at: string
}

export async function createVotingGroup(data: {
  id: string
  batch_id: string
  name: string
  interaction_type: string
  max_score: number
  require_all_options: boolean
  created_at: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('voters_voting_groups').insert({
    id: data.id,
    batch_id: data.batch_id,
    name: data.name,
    interaction_type: data.interaction_type,
    max_score: data.max_score,
    require_all_options: data.require_all_options,
    created_at: data.created_at,
  })

  if (error) throw new Error(error.message)
}

export async function updateVotingGroup(
  id: string,
  data: { name?: string; max_score?: number; require_all_options?: boolean },
) {
  const supabase = await createClient()

  const { data: group, error } = await supabase
    .from('voters_voting_groups')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return group as VotingGroup
}

export async function deleteVotingGroup(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('voters_voting_groups').delete().eq('id', id)

  if (error) throw new Error(error.message)
}
