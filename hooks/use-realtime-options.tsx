'use client'

import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import {
  createOption as createOptionAction,
  updateOption as updateOptionAction,
  deleteOption as deleteOptionAction,
  type Option,
} from '@/lib/actions/options'
import { castVote as castVoteAction } from '@/lib/actions/votes'

export type { Option }

const CHANNEL_NAME = 'voters_options_broadcast'

export function useRealtimeOptions(sessionId: string) {
  const supabase = createClient()
  const [options, setOptions] = useState<Option[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOptions = async () => {
      const { data } = await supabase.from('voters_options').select('*').order('created_at', { ascending: false })

      if (data) {
        setOptions(data as Option[])
      }
      setIsLoading(false)
    }

    fetchOptions()
  }, [supabase])

  useEffect(() => {
    const newChannel = supabase.channel(CHANNEL_NAME)

    newChannel
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        setOptions((current) => [payload.payload as Option, ...current])
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        const updated = payload.payload as Option
        setOptions((current) => current.map((o) => (o.id === updated.id ? updated : o)))
      })
      .on('broadcast', { event: 'DELETE' }, (payload) => {
        const deletedId = payload.payload as string
        setOptions((current) => current.filter((o) => o.id !== deletedId))
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [supabase])

  const createOption = useCallback(
    async (data: { group_id: string; name: string }) => {
      if (!channel || !isConnected) return

      const option: Option = {
        id: crypto.randomUUID(),
        group_id: data.group_id,
        name: data.name,
        total_submissions: 0,
        total_score: 0,
      }

      setOptions((current) => [option, ...current])

      await channel.send({
        type: 'broadcast',
        event: 'INSERT',
        payload: option,
      })

      void createOptionAction({ id: option.id, group_id: option.group_id, name: option.name })
    },
    [channel, isConnected],
  )

  const updateOption = useCallback(
    async (id: string, data: { name?: string }) => {
      if (!channel || !isConnected) return

      setOptions((current) => current.map((o) => (o.id === id ? { ...o, ...data } : o)))

      const updated = options.find((o) => o.id === id)
      if (!updated) return

      const patched = { ...updated, ...data } as Option

      await channel.send({
        type: 'broadcast',
        event: 'UPDATE',
        payload: patched,
      })

      void updateOptionAction(id, data)
    },
    [channel, isConnected, options],
  )

  const deleteOption = useCallback(
    async (id: string) => {
      if (!channel || !isConnected) return

      setOptions((current) => current.filter((o) => o.id !== id))

      await channel.send({
        type: 'broadcast',
        event: 'DELETE',
        payload: id,
      })

      void deleteOptionAction(id)
    },
    [channel, isConnected],
  )

  const castVote = useCallback(
    async (optionId: string, score: number) => {
      if (!channel || !isConnected) return

      const option = options.find((o) => o.id === optionId)
      if (!option) return

      const updated: Option = {
        ...option,
        total_submissions: option.total_submissions + 1,
        total_score: option.total_score + score,
      }

      setOptions((current) => current.map((o) => (o.id === optionId ? updated : o)))

      await channel.send({
        type: 'broadcast',
        event: 'UPDATE',
        payload: updated,
      })

      void castVoteAction(optionId, sessionId, score)
    },
    [channel, isConnected, options, sessionId],
  )

  return { options, createOption, updateOption, deleteOption, castVote, isConnected, isLoading }
}
