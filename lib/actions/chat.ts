'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveMessage(data: {
  id: string
  roomName: string
  content: string
  userName: string
  createdAt: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('test_messages').insert({
    id: data.id,
    room_name: data.roomName,
    content: data.content,
    user_name: data.userName,
    created_at: data.createdAt,
  })

  if (error) {
    console.error('Failed to save message:', error)
  }
}
