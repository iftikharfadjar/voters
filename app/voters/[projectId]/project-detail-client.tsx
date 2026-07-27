'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useRealtimeProjects } from '@/hooks/use-realtime-projects'
import { useRealtimeBatches } from '@/hooks/use-realtime-batches'
import { useRealtimeVotingGroups } from '@/hooks/use-realtime-voting-groups'
import { useRealtimeOptions } from '@/hooks/use-realtime-options'
import { BatchItem } from '@/components/voters/batch-item'

interface ProjectDetailClientProps {
  projectId: string
}

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return ''
    let id = localStorage.getItem('voters_session_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('voters_session_id', id)
    }
    return id
  })

  const { projects, isLoading: projectsLoading } = useRealtimeProjects()
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

  const project = projects.find((p) => p.id === projectId)
  const projectBatches = batches.filter((b) => b.project_id === projectId)

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

  const [addingBatch, setAddingBatch] = useState(false)
  const [newBatchName, setNewBatchName] = useState('')
  const [newBatchStatus, setNewBatchStatus] = useState('pending')
  const [batchLoading, setBatchLoading] = useState(false)

  async function handleAddBatch() {
    if (!newBatchName.trim()) return
    setBatchLoading(true)
    try {
      await createBatch({ project_id: projectId, name: newBatchName.trim(), status: newBatchStatus })
      setNewBatchName('')
      setNewBatchStatus('pending')
      setAddingBatch(false)
    } finally {
      setBatchLoading(false)
    }
  }

  if (projectsLoading || batchesLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <Link href="/voters" className="text-sm text-muted-foreground hover:underline">
          &larr; All Projects
        </Link>
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <Link href="/voters" className="inline-block text-sm text-muted-foreground hover:underline">
        &larr; All Projects
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <p className="text-sm text-muted-foreground">
          Status: {project.status} &middot; Created{' '}
          {new Date(project.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setAddingBatch((v) => !v)}>
          {addingBatch ? 'Cancel' : 'Add batch'}
        </Button>
      </div>

      {addingBatch && (
        <div className="flex items-end gap-2 rounded-md border p-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium">Batch name</label>
            <Input
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              placeholder="Batch name"
              disabled={batchLoading}
              className="h-8 text-sm"
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium">Status</label>
            <Input
              value={newBatchStatus}
              onChange={(e) => setNewBatchStatus(e.target.value)}
              placeholder="Status"
              disabled={batchLoading}
              className="h-8 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={handleAddBatch}
            disabled={batchLoading || !newBatchName.trim()}
            className={cn(batchLoading && 'opacity-50')}
          >
            {batchLoading ? 'Adding...' : 'Add'}
          </Button>
        </div>
      )}

      {projectBatches.length > 0 ? (
        <Accordion type="multiple">
          {projectBatches.map((batch) => (
            <BatchItem
              key={batch.id}
              batch={batch}
              onUpdate={updateBatch}
              onDelete={deleteBatch}
              groupsByBatch={groupsByBatch}
              optionsByGroup={optionsByGroup}
              castVote={castVote}
              groupsLoading={groupsLoading || optionsLoading}
              onCreateVotingGroup={createVotingGroup}
              onCreateOption={createOption}
            />
          ))}
        </Accordion>
      ) : (
        !addingBatch && <p className="text-sm text-muted-foreground">No batches yet.</p>
      )}
    </div>
  )
}