'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Project } from '@/hooks/use-realtime-projects'

interface CreateProjectFormProps {
  onCreate: (data: Project) => Promise<unknown>
}

export function CreateProjectForm({ onCreate }: CreateProjectFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      const ts = new Date().toISOString()
      const project: Project = {
        id: crypto.randomUUID(),
        name: name.trim(),
        status,
        created_at: ts,
        updated_at: ts,
      }
      await onCreate(project)
      router.push('/voters/' + project.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              disabled={loading}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <Input
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Status"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !name.trim()} className={cn(loading && 'opacity-50')}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
