'use client'

import { useState } from 'react'

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { VotingGroupCard } from '@/components/voters/voting-group-card'
import type { Batch } from '@/hooks/use-realtime-batches'
import type { VotingGroup } from '@/hooks/use-realtime-voting-groups'
import type { Option } from '@/hooks/use-realtime-options'

interface BatchItemProps {
  batch: Batch
  onUpdate: (id: string, data: { name?: string; status?: string }) => Promise<unknown>
  onDelete: (id: string) => Promise<void>
  groupsByBatch: Record<string, VotingGroup[]>
  optionsByGroup: Record<string, Option[]>
  castVote: (optionId: string, score: number) => Promise<void>
  groupsLoading: boolean
  onCreateVotingGroup: (data: { batch_id: string; name: string; interaction_type: string; max_score: number; require_all_options: boolean }) => Promise<unknown>
  onCreateOption: (data: { group_id: string; name: string }) => Promise<unknown>
}

export function BatchItem({ batch, onUpdate, onDelete, groupsByBatch, optionsByGroup, castVote,   groupsLoading, onCreateVotingGroup, onCreateOption }: BatchItemProps) {
  const [editingField, setEditingField] = useState<{ field: 'name' | 'status'; value: string } | null>(null)
  const [addingGroup, setAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupType, setNewGroupType] = useState<'VOTE' | 'RATE'>('VOTE')
  const [newGroupMaxScore, setNewGroupMaxScore] = useState(5)
  const [newGroupRequireAll, setNewGroupRequireAll] = useState(false)
  const [groupLoading, setGroupLoading] = useState(false)

  const groups = groupsByBatch[batch.id] ?? []

  function startEdit(field: 'name' | 'status') {
    setEditingField({ field, value: batch[field] })
  }

  function saveEdit() {
    if (!editingField) return
    onUpdate(batch.id, { [editingField.field]: editingField.value })
    setEditingField(null)
  }

  async function handleAddGroup() {
    if (!newGroupName.trim()) return
    setGroupLoading(true)
    try {
      await onCreateVotingGroup({
        batch_id: batch.id,
        name: newGroupName.trim(),
        interaction_type: newGroupType,
        max_score: newGroupMaxScore,
        require_all_options: newGroupRequireAll,
      })
      setNewGroupName('')
      setNewGroupType('VOTE')
      setNewGroupMaxScore(5)
      setNewGroupRequireAll(false)
      setAddingGroup(false)
    } finally {
      setGroupLoading(false)
    }
  }

  return (
    <AccordionItem value={batch.id} className="border-0">
      <AccordionTrigger className="py-2 text-muted-foreground hover:text-foreground">
        {editingField?.field === 'name' ? (
          <Input
            value={editingField.value}
            onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') setEditingField(null)
            }}
            className="h-7 text-sm"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span onClick={() => startEdit('name')} className="cursor-pointer hover:underline">
            {batch.name}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 pl-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Status:{' '}
              {editingField?.field === 'status' ? (
                <Input
                  value={editingField.value}
                  onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') setEditingField(null)
                  }}
                  className="inline-flex h-6 w-32 text-xs"
                  autoFocus
                />
              ) : (
                <span onClick={() => startEdit('status')} className="cursor-pointer hover:underline">
                  {batch.status}
                </span>
              )}
            </span>
            <span>·</span>
            <span>{new Date(batch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddingGroup((v) => !v)}>
              {addingGroup ? 'Cancel' : 'Add Voting Group'}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(batch.id)}>
              Delete
            </Button>
          </div>

          {addingGroup && (
            <div className="space-y-3 rounded-md border p-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Group name</Label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Group name"
                  disabled={groupLoading}
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Type</Label>
                  <select
                    value={newGroupType}
                    onChange={(e) => setNewGroupType(e.target.value as 'VOTE' | 'RATE')}
                    disabled={groupLoading}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                  >
                    <option value="VOTE">VOTE</option>
                    <option value="RATE">RATE</option>
                  </select>
                </div>
                {newGroupType === 'RATE' && (
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Max score</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newGroupMaxScore}
                      onChange={(e) => setNewGroupMaxScore(Number(e.target.value))}
                      disabled={groupLoading}
                      className="h-8 text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="require-all"
                  checked={newGroupRequireAll}
                  onCheckedChange={(v) => setNewGroupRequireAll(v === true)}
                  disabled={groupLoading}
                />
                <Label htmlFor="require-all" className="text-xs font-medium">
                  Require all options
                </Label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddGroup} disabled={groupLoading || !newGroupName.trim()}>
                  {groupLoading ? 'Adding...' : 'Add'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingGroup(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {groups.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Voting Groups</p>
              <div className="space-y-2">
                {groups.map((group) => (
                  <VotingGroupCard
                    key={group.id}
                    group={group}
                    options={optionsByGroup[group.id] ?? []}
                    isLoading={groupsLoading}
                    castVote={castVote}
                    onCreateOption={onCreateOption}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
