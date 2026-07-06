'use client'

import { useMemo, useState } from 'react'

import { Accordion } from '@/components/ui/accordion'
import { useRealtimeProjects } from '@/hooks/use-realtime-projects'
import { useRealtimeBatches } from '@/hooks/use-realtime-batches'
import { useRealtimeVotingGroups } from '@/hooks/use-realtime-voting-groups'
import { useRealtimeOptions } from '@/hooks/use-realtime-options'
import { CreateProjectForm } from '@/components/voters/create-project-form'
import { ProjectItem } from '@/components/voters/project-item'

export default function VotersPage() {
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return ''
    let id = localStorage.getItem('voters_session_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('voters_session_id', id)
    }
    return id
  })

  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
    isLoading: projectsLoading,
  } = useRealtimeProjects()
  const {
    batches,
    createBatch,
    updateBatch,
    deleteBatch,
    isLoading: batchesLoading,
  } = useRealtimeBatches()
  const {
    groups,
    createVotingGroup,
    isLoading: groupsLoading,
  } = useRealtimeVotingGroups()
  const {
    options,
    createOption,
    castVote,
    isLoading: optionsLoading,
  } = useRealtimeOptions(sessionId)

  const batchesByProject = useMemo(() => {
    const map: Record<string, typeof batches> = {}
    for (const batch of batches) {
      if (!map[batch.project_id]) map[batch.project_id] = []
      map[batch.project_id].push(batch)
    }
    return map
  }, [batches])

  const groupsByBatch = useMemo(() => {
    const map: Record<string, typeof groups> = {}
    for (const group of groups) {
      if (!map[group.batch_id]) map[group.batch_id] = []
      map[group.batch_id].push(group)
    }
    return map
  }, [groups])

  const optionsByGroup = useMemo(() => {
    const map: Record<string, typeof options> = {}
    for (const option of options) {
      if (!map[option.group_id]) map[option.group_id] = []
      map[option.group_id].push(option)
    }
    return map
  }, [options])

  if (projectsLoading || batchesLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Voters Projects</h1>
      <CreateProjectForm onCreate={createProject} />
      <Accordion type="multiple">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            batches={batchesByProject[project.id] ?? []}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onCreateBatch={createBatch}
            onUpdateBatch={updateBatch}
            onDeleteBatch={deleteBatch}
            groupsByBatch={groupsByBatch}
            optionsByGroup={optionsByGroup}
            castVote={castVote}
            groupsLoading={groupsLoading || optionsLoading}
            onCreateVotingGroup={createVotingGroup}
            onCreateOption={createOption}
          />
        ))}
      </Accordion>
    </div>
  )
}
