'use client'

import { useState } from 'react'

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Batch } from '@/hooks/use-realtime-batches'

interface BatchItemProps {
  batch: Batch
  onUpdate: (id: string, data: { name?: string; status?: string }) => Promise<unknown>
  onDelete: (id: string) => Promise<void>
}

export function BatchItem({ batch, onUpdate, onDelete }: BatchItemProps) {
  const [editingField, setEditingField] = useState<{ field: 'name' | 'status'; value: string } | null>(null)

  function startEdit(field: 'name' | 'status') {
    setEditingField({ field, value: batch[field] })
  }

  function saveEdit() {
    if (!editingField) return
    onUpdate(batch.id, { [editingField.field]: editingField.value })
    setEditingField(null)
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
            <Button variant="destructive" size="sm" onClick={() => onDelete(batch.id)}>
              Delete
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
