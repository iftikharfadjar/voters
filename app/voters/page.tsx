'use client'

import { useRealtimeProjects } from '@/hooks/use-realtime-projects'
import { CreateProjectForm } from '@/components/voters/create-project-form'
import { ProjectItem } from '@/components/voters/project-item'

export default function VotersPage() {
  const { projects, createProject, isLoading } = useRealtimeProjects()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Voters Projects</h1>
      <CreateProjectForm onCreate={createProject} />
      <div className="space-y-2">
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">No projects yet. Create one above.</p>
        )}
      </div>
    </div>
  )
}