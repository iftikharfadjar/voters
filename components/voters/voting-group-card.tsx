'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OptionCard } from '@/components/voters/option-card'
import type { VotingGroup } from '@/hooks/use-realtime-voting-groups'
import type { Option } from '@/hooks/use-realtime-options'

interface VotingGroupCardProps {
  group: VotingGroup
  options: Option[]
  isLoading: boolean
  onCreateOption: (data: { group_id: string; name: string }) => Promise<unknown>
  selectedOptionId: string | null
  selectedScores: Record<string, number>
  onSelect: (optionId: string) => void
  onScoreChange: (optionId: string, score: number) => void
}

export function VotingGroupCard({ group, options, isLoading, onCreateOption, selectedOptionId, selectedScores, onSelect, onScoreChange }: VotingGroupCardProps) {
  const [addingOption, setAddingOption] = useState(false)
  const [newOptionName, setNewOptionName] = useState('')
  const [optionLoading, setOptionLoading] = useState(false)

  async function handleAddOption() {
    if (!newOptionName.trim()) return
    setOptionLoading(true)
    try {
      await onCreateOption({ group_id: group.id, name: newOptionName.trim() })
      setNewOptionName('')
      setAddingOption(false)
    } finally {
      setOptionLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-sm">{group.name}</CardTitle>
          {group.interaction_type === 'RATE' && <p className="text-xs text-muted-foreground">Max score: {group.max_score}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAddingOption((v) => !v)}>
          {addingOption ? 'Cancel' : 'Add Option'}
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {isLoading && <p className="text-xs text-muted-foreground">Loading options...</p>}
        {!isLoading && options.length === 0 && !addingOption && (
          <p className="text-xs text-muted-foreground">No options yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              interactionType={group.interaction_type}
              maxScore={group.max_score}
              selected={selectedOptionId === option.id}
              selectedScore={selectedScores[option.id] ?? null}
              onSelect={onSelect}
              onScoreChange={onScoreChange}
            />
          ))}
        </div>

        {addingOption && (
          <div className="flex items-end gap-2 rounded-md border p-2">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium">Option name</label>
              <Input
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                placeholder="Option name"
                disabled={optionLoading}
                className="h-8 text-sm"
              />
            </div>
            <Button size="sm" onClick={handleAddOption} disabled={optionLoading || !newOptionName.trim()}>
              {optionLoading ? 'Adding...' : 'Add'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAddingOption(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
