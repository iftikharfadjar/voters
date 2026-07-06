'use client'

import { useState } from 'react'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Project } from '@/hooks/use-realtime-projects'
import type { Batch } from '@/hooks/use-realtime-batches'
import type { VotingGroup } from '@/hooks/use-realtime-voting-groups'
import type { Option } from '@/hooks/use-realtime-options'
import { BatchItem } from '@/components/voters/batch-item'

interface ProjectItemProps {
  project: Project
  batches: Batch[]
  onUpdateProject: (id: string, data: { name?: string; status?: string }) => Promise<unknown>
  onDeleteProject: (id: string) => Promise<void>
  onCreateBatch: (data: { project_id: string; name: string; status: string }) => Promise<unknown>
  onUpdateBatch: (id: string, data: { name?: string; status?: string }) => Promise<unknown>
  onDeleteBatch: (id: string) => Promise<void>
  groupsByBatch: Record<string, VotingGroup[]>
  optionsByGroup: Record<string, Option[]>
  castVote: (optionId: string, score: number) => Promise<void>
  groupsLoading: boolean
  onCreateVotingGroup: (data: { batch_id: string; name: string; interaction_type: string; max_score: number; require_all_options: boolean }) => Promise<unknown>
  onCreateOption: (data: { group_id: string; name: string }) => Promise<unknown>
}

export function ProjectItem({
  project,
  batches,
  onUpdateProject,
  onDeleteProject,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch,
  groupsByBatch,
  optionsByGroup,
  castVote,
  groupsLoading,
  onCreateVotingGroup,
  onCreateOption,
}: ProjectItemProps) {
  const [editingField, setEditingField] = useState<{ field: 'name' | 'status'; value: string } | null>(null)
  const [addingBatch, setAddingBatch] = useState(false)
  const [newBatchName, setNewBatchName] = useState('')
  const [newBatchStatus, setNewBatchStatus] = useState('pending')
  const [batchLoading, setBatchLoading] = useState(false)

  function startEdit(field: 'name' | 'status') {
    setEditingField({ field, value: project[field] })
  }

  function saveEdit() {
    if (!editingField) return
    onUpdateProject(project.id, { [editingField.field]: editingField.value })
    setEditingField(null)
  }

  async function handleAddBatch() {
    if (!newBatchName.trim()) return
    setBatchLoading(true)
    try {
      await onCreateBatch({ project_id: project.id, name: newBatchName.trim(), status: newBatchStatus })
      setNewBatchName('')
      setNewBatchStatus('pending')
      setAddingBatch(false)
    } finally {
      setBatchLoading(false)
    }
  }

  return (
    <AccordionItem value={project.id}>
      <AccordionTrigger className="text-base font-semibold">
        {project.name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Name:</span>
            {editingField?.field === 'name' ? (
              <Input
                value={editingField.value}
                onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit()
                  if (e.key === 'Escape') setEditingField(null)
                }}
                className="h-7 w-48 text-sm"
                autoFocus
              />
            ) : (
              <span onClick={() => startEdit('name')} className="cursor-pointer hover:underline">
                {project.name}
              </span>
            )}

            <span className="text-muted-foreground">Status:</span>
            {editingField?.field === 'status' ? (
              <Input
                value={editingField.value}
                onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit()
                  if (e.key === 'Escape') setEditingField(null)
                }}
                className="h-7 w-32 text-sm"
                autoFocus
              />
            ) : (
              <span onClick={() => startEdit('status')} className="cursor-pointer hover:underline">
                {project.status}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Created:{' '}
            {new Date(project.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddingBatch((v) => !v)}>
              {addingBatch ? 'Cancel' : 'Add batch'}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDeleteProject(project.id)}>
              Delete
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

          {batches.length > 0 && (
            <Accordion type="multiple" className="rounded-md border bg-muted/30 px-3">
              {batches.map((batch) => (
                <BatchItem
                  key={batch.id}
                  batch={batch}
                  onUpdate={onUpdateBatch}
                  onDelete={onDeleteBatch}
                  groupsByBatch={groupsByBatch}
                  optionsByGroup={optionsByGroup}
                  castVote={castVote}
                  groupsLoading={groupsLoading}
                  onCreateVotingGroup={onCreateVotingGroup}
                  onCreateOption={onCreateOption}
                />
              ))}
            </Accordion>
          )}

          {batches.length === 0 && !addingBatch && (
            <p className="text-xs text-muted-foreground">No batches yet.</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
