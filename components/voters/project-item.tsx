'use client'

import Link from 'next/link'

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/hooks/use-realtime-projects'

interface ProjectItemProps {
  project: Project
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link href={'/voters/' + project.id}>
      <Card className="cursor-pointer transition-colors hover:bg-muted/50">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{project.name}</CardTitle>
            <Badge variant="outline">{project.status}</Badge>
          </div>
          <CardDescription>
            Created{' '}
            {new Date(project.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}