'use server'

import { createClient } from '@/lib/supabase/server'

export async function castVote(optionId: string, sessionId: string, score: number) {
  const supabase = await createClient()

  const { error: voteError } = await supabase.from('voters_votes').insert({
    session_id: sessionId,
    option_id: optionId,
    score,
  })

  if (voteError) throw new Error(voteError.message)

  const { data: current } = await supabase
    .from('voters_options')
    .select('total_submissions, total_score')
    .eq('id', optionId)
    .single()

  const { error: updateError } = await supabase
    .from('voters_options')
    .update({
      total_submissions: (current?.total_submissions ?? 0) + 1,
      total_score: (current?.total_score ?? 0) + score,
    })
    .eq('id', optionId)

  if (updateError) throw new Error(updateError.message)
}
