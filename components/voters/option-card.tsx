'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import type { Option } from '@/hooks/use-realtime-options'

interface OptionCardProps {
  option: Option
  interactionType: 'VOTE' | 'RATE'
  maxScore: number
  selected: boolean
  selectedScore: number | null
  onSelect: (optionId: string) => void
  onScoreChange: (optionId: string, score: number) => void
}

export function OptionCard({
  option,
  interactionType,
  maxScore,
  selected,
  selectedScore,
  onSelect,
  onScoreChange,
}: OptionCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors',
        selected && interactionType === 'VOTE' && 'border-primary ring-1 ring-primary',
      )}
      onClick={() => {
        if (interactionType === 'VOTE') {
          onSelect(option.id)
        }
      }}
    >
      <CardContent className="p-3 space-y-1.5">
        {interactionType === 'RATE' ? (
          <>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>{option.total_submissions} votes</span>
              <span>Score: {option.total_score}</span>
              <span>Avg: {option.total_submissions > 0 ? (option.total_score / option.total_submissions).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1">
              <p className="md:w-2/3 text-sm font-medium break-words min-w-0">{option.name}</p>
              <div className="md:w-1/3 flex md:justify-end">
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {Array.from({ length: maxScore }, (_, i) => i + 1).map((score) => (
                    <button
                      key={score}
                      type="button"
                      className={cn(
                        'size-7 rounded text-xs font-medium transition-colors',
                        selectedScore === score
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground',
                      )}
                      onClick={() => onScoreChange(option.id, score)}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{option.name}</p>
              <div
                className={cn(
                  'size-4 rounded-full border-2 flex items-center justify-center',
                  selected && 'border-primary',
                )}
              >
                {selected && <div className="size-2 rounded-full bg-primary" />}
              </div>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>{option.total_submissions} votes</span>
              <span>Score: {option.total_score}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
