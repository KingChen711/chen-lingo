import { challengeOptions, challenges } from '@/database/schema'
import { cn } from '@/lib/utils'
import React from 'react'
import Card from './card'

type Props = {
  options: (typeof challengeOptions.$inferSelect)[]
  onSelectOption: (challengeOptionId: number) => void
  status: 'correct' | 'wrong' | 'none'
  selectedOption?: number
  disabled?: boolean
  type: (typeof challenges.$inferSelect)['type']
}

function Challenge({ disabled, onSelectOption, options, selectedOption, status, type }: Props) {
  return (
    <div
      className={cn(
        'grid gap-2',
        type === 'ASSIST' && 'grid-cols-1',
        type === 'SELECT' && 'grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]'
      )}
    >
      {options.map((option, i) => {
        return (
          <Card
            key={option.id}
            text={option.text}
            imageSrc={option.imageSrc}
            audioSrc={option.audioSrc}
            shortcut={`${i + 1}`}
            selected={selectedOption === option.id}
            onClick={() => onSelectOption(option.id)}
            status={status}
            disabled={disabled}
            type={type}
          />
        )
      })}
    </div>
  )
}

export default Challenge
