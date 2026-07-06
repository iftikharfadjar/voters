'use client'

import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import {
  createVotingGroup as createVotingGroupAction,
  updateVotingGroup as updateVotingGroupAction,
  deleteVotingGroup as deleteVotingGroupAction,
  type VotingGroup,
} from '@/lib/actions/voting-groups'

export type { VotingGroup }

const CHANNEL_NAME = 'voters_voting_groups_broadcast'

export function useRealtimeVotingGroups() {
  const supabase = createClient()
  const [groups, setGroups] = useState<VotingGroup[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from('voters_voting_groups').select('*').order('created_at', { ascending: false })

      if (data) {
        setGroups(data as VotingGroup[])
      }
      setIsLoading(false)
    }

    fetchGroups()
  }, [supabase])

  useEffect(() => {
    const newChannel = supabase.channel(CHANNEL_NAME)

    newChannel
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        setGroups((current) => [payload.payload as VotingGroup, ...current])
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        const updated = payload.payload as VotingGroup
        setGroups((current) => current.map((g) => (g.id === updated.id ? updated : g)))
      })
      .on('broadcast', { event: 'DELETE' }, (payload) => {
        const deletedId = payload.payload as string
        setGroups((current) => current.filter((g) => g.id !== deletedId))
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [supabase])

  const createVotingGroup = useCallback(
    async (data: { batch_id: string; name: string; interaction_type: string; max_score: number; require_all_options: boolean }) => {
      if (!channel || !isConnected) return

      const group: VotingGroup = {
        id: crypto.randomUUID(),
        batch_id: data.batch_id,
        name: data.name,
        interaction_type: data.interaction_type as 'VOTE' | 'RATE',
        max_score: data.max_score,
        require_all_options: data.require_all_options,
        created_at: new Date().toISOString(),
      }

      setGroups((current) => [group, ...current])

      await channel.send({
        type: 'broadcast',
        event: 'INSERT',
        payload: group,
      })

      void createVotingGroupAction(group)
    },
    [channel, isConnected],
  )

  const updateVotingGroup = useCallback(
    async (id: string, data: { name?: string; max_score?: number; require_all_options?: boolean }) => {
      if (!channel || !isConnected) return

      setGroups((current) => current.map((g) => (g.id === id ? { ...g, ...data } : g)))

      const updated = groups.find((g) => g.id === id)
      if (!updated) return

      const patched = { ...updated, ...data } as VotingGroup

      await channel.send({
        type: 'broadcast',
        event: 'UPDATE',
        payload: patched,
      })

      void updateVotingGroupAction(id, data)
    },
    [channel, isConnected, groups],
  )

  const deleteVotingGroup = useCallback(
    async (id: string) => {
      if (!channel || !isConnected) return

      setGroups((current) => current.filter((g) => g.id !== id))

      await channel.send({
        type: 'broadcast',
        event: 'DELETE',
        payload: id,
      })

      void deleteVotingGroupAction(id)
    },
    [channel, isConnected],
  )

  return { groups, createVotingGroup, updateVotingGroup, deleteVotingGroup, isConnected, isLoading }
}
