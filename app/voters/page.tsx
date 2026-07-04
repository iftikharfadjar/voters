'use client'

import { useMemo } from 'react'

import { Accordion } from '@/components/ui/accordion'
import { useRealtimeProjects } from '@/hooks/use-realtime-projects'
import { useRealtimeBatches } from '@/hooks/use-realtime-batches'
import { CreateProjectForm } from '@/components/voters/create-project-form'
import { ProjectItem } from '@/components/voters/project-item'

export default function VotersPage() {
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

  const batchesByProject = useMemo(() => {
    const map: Record<string, typeof batches> = {}
    for (const batch of batches) {
      if (!map[batch.project_id]) map[batch.project_id] = []
      map[batch.project_id].push(batch)
    }
    return map
  }, [batches])

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
          />
        ))}
      </Accordion>
    </div>
  )
}
