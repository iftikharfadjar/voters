'use client'

import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import {
  createBatch as createBatchAction,
  updateBatch as updateBatchAction,
  deleteBatch as deleteBatchAction,
  type Batch,
} from '@/lib/actions/batches'

export type { Batch }

const CHANNEL_NAME = 'voters_batches_broadcast'

export function useRealtimeBatches() {
  const supabase = createClient()
  const [batches, setBatches] = useState<Batch[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBatches = async () => {
      const { data } = await supabase.from('voters_batches').select('*').order('created_at', { ascending: false })

      if (data) {
        setBatches(data as Batch[])
      }
      setIsLoading(false)
    }

    fetchBatches()
  }, [supabase])

  useEffect(() => {
    const newChannel = supabase.channel(CHANNEL_NAME)

    newChannel
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        setBatches((current) => [payload.payload as Batch, ...current])
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        const updated = payload.payload as Batch
        setBatches((current) => current.map((b) => (b.id === updated.id ? updated : b)))
      })
      .on('broadcast', { event: 'DELETE' }, (payload) => {
        const deletedId = payload.payload as string
        setBatches((current) => current.filter((b) => b.id !== deletedId))
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [supabase])

  const createBatch = useCallback(
    async (data: { project_id: string; name: string; status: string }) => {
      if (!channel || !isConnected) return

      const batch: Batch = {
        id: crypto.randomUUID(),
        project_id: data.project_id,
        name: data.name,
        status: data.status,
        created_at: new Date().toISOString(),
      }

      setBatches((current) => [batch, ...current])

      await channel.send({
        type: 'broadcast',
        event: 'INSERT',
        payload: batch,
      })

      void createBatchAction(batch)
    },
    [channel, isConnected],
  )

  const updateBatch = useCallback(
    async (id: string, data: { name?: string; status?: string }) => {
      if (!channel || !isConnected) return

      setBatches((current) => current.map((b) => (b.id === id ? { ...b, ...data } : b)))

      const updated = batches.find((b) => b.id === id)
      if (!updated) return

      const patched = { ...updated, ...data } as Batch

      await channel.send({
        type: 'broadcast',
        event: 'UPDATE',
        payload: patched,
      })

      void updateBatchAction(id, data)
    },
    [channel, isConnected, batches],
  )

  const deleteBatch = useCallback(
    async (id: string) => {
      if (!channel || !isConnected) return

      setBatches((current) => current.filter((b) => b.id !== id))

      await channel.send({
        type: 'broadcast',
        event: 'DELETE',
        payload: id,
      })

      void deleteBatchAction(id)
    },
    [channel, isConnected],
  )

  return { batches, createBatch, updateBatch, deleteBatch, isConnected, isLoading }
}
