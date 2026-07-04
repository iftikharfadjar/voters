'use client'

import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import {
  createProject as createProjectAction,
  updateProject as updateProjectAction,
  deleteProject as deleteProjectAction,
  type Project,
} from '@/lib/actions/projects'

export type { Project }

const CHANNEL_NAME = 'voters_projects_broadcast'

export function useRealtimeProjects() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('voters_projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) {
        setProjects(data as Project[])
      }
      setIsLoading(false)
    }

    fetchProjects()
  }, [supabase])

  useEffect(() => {
    const newChannel = supabase.channel(CHANNEL_NAME)

    newChannel
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        setProjects((current) => [payload.payload as Project, ...current])
      })
      .on('broadcast', { event: 'UPDATE' }, (payload) => {
        const updated = payload.payload as Project
        setProjects((current) => current.map((p) => (p.id === updated.id ? updated : p)))
      })
      .on('broadcast', { event: 'DELETE' }, (payload) => {
        const deletedId = payload.payload as string
        setProjects((current) => current.filter((p) => p.id !== deletedId))
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    setChannel(newChannel)

    return () => {
      supabase.removeChannel(newChannel)
    }
  }, [supabase])

  const createProject = useCallback(
    async (data: { name: string; status: string }) => {
      if (!channel || !isConnected) return

      const project: Project = {
        id: crypto.randomUUID(),
        name: data.name,
        status: data.status,
        created_at: new Date().toISOString(),
      }

      setProjects((current) => [project, ...current])

      await channel.send({
        type: 'broadcast',
        event: 'INSERT',
        payload: project,
      })

      void createProjectAction(project)
    },
    [channel, isConnected],
  )

  const updateProject = useCallback(
    async (id: string, data: { name?: string; status?: string }) => {
      if (!channel || !isConnected) return

      setProjects((current) => current.map((p) => (p.id === id ? { ...p, ...data } : p)))

      const updated = projects.find((p) => p.id === id)
      if (!updated) return

      const patched = { ...updated, ...data } as Project

      await channel.send({
        type: 'broadcast',
        event: 'UPDATE',
        payload: patched,
      })

      void updateProjectAction(id, data)
    },
    [channel, isConnected, projects],
  )

  const deleteProject = useCallback(
    async (id: string) => {
      if (!channel || !isConnected) return

      setProjects((current) => current.filter((p) => p.id !== id))

      await channel.send({
        type: 'broadcast',
        event: 'DELETE',
        payload: id,
      })

      void deleteProjectAction(id)
    },
    [channel, isConnected],
  )

  return { projects, createProject, updateProject, deleteProject, isConnected, isLoading }
}
