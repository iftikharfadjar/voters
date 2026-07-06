'use client'

import { useCallback, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OptionCard } from '@/components/voters/option-card'
import type { VotingGroup } from '@/hooks/use-realtime-voting-groups'
import type { Option } from '@/hooks/use-realtime-options'

interface VotingGroupCardProps {
  group: VotingGroup
  options: Option[]
  isLoading: boolean
  castVote: (optionId: string, score: number) => Promise<void>
  onCreateOption: (data: { group_id: string; name: string }) => Promise<unknown>
}

export function VotingGroupCard({ group, options, isLoading, castVote, onCreateOption }: VotingGroupCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [optionScores, setOptionScores] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [addingOption, setAddingOption] = useState(false)
  const [newOptionName, setNewOptionName] = useState('')
  const [optionLoading, setOptionLoading] = useState(false)

  const hasSelectedAny = group.interaction_type === 'VOTE' ? selectedOptionId !== null : Object.keys(optionScores).length > 0

  const handleScoreChange = useCallback((optionId: string, score: number) => {
    setOptionScores((prev) => ({ ...prev, [optionId]: score }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    try {
      if (group.interaction_type === 'VOTE' && selectedOptionId) {
        await castVote(selectedOptionId, 1)
        setSelectedOptionId(null)
      } else if (group.interaction_type === 'RATE') {
        for (const [optionId, score] of Object.entries(optionScores)) {
          await castVote(optionId, score)
        }
        setOptionScores({})
      }
    } finally {
      setSubmitting(false)
    }
  }, [group.interaction_type, selectedOptionId, optionScores, castVote])

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
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-sm">{group.name}</CardTitle>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              {group.interaction_type}
            </Badge>
            {group.interaction_type === 'RATE' && <span>Max score: {group.max_score}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {isLoading && <p className="text-xs text-muted-foreground">Loading options...</p>}
        {!isLoading && options.length === 0 && !addingOption && (
          <p className="text-xs text-muted-foreground">No options yet.</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              interactionType={group.interaction_type}
              maxScore={group.max_score}
              selected={selectedOptionId === option.id}
              selectedScore={optionScores[option.id] ?? null}
              onSelect={setSelectedOptionId}
              onScoreChange={handleScoreChange}
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

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAddingOption((v) => !v)}>
            {addingOption ? 'Cancel' : 'Add Option'}
          </Button>
          <Button
            className="flex-1"
            size="sm"
            disabled={!hasSelectedAny || submitting}
            onClick={handleSubmit}
          >
            {submitting
              ? 'Submitting...'
              : group.interaction_type === 'VOTE'
                ? 'Submit Vote'
                : 'Submit Ratings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
