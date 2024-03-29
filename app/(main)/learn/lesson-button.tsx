'use client'

import { Button } from '@/components/ui/button'
import { cycleLength } from '@/constants'
import { cn } from '@/lib/utils'
import { Check, Crown, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'

import 'react-circular-progressbar/dist/styles.css'

type Props = {
  id: number
  index: number
  totalCount: number
  locked?: boolean
  current?: boolean
  percentage: number
  completed: boolean
}

function LessonButton({ id, index, percentage, totalCount, current, locked, completed }: Props) {
  const cycleIndex = index % cycleLength

  let indentationLevel

  if (cycleIndex <= 2) {
    indentationLevel = cycleIndex
  } else if (cycleIndex <= 6) {
    indentationLevel = 4 - cycleIndex
  } else {
    indentationLevel = cycleIndex - 8
  }

  const rightPosition = indentationLevel * 40
  const isFirst = index === 0
  const isLast = index === totalCount

  const Icon = completed ? Check : isLast ? Crown : Star

  const href = completed ? `/lesson/${id}` : '/lesson'

  return (
    <Link href={href} aria-disabled={locked} className={cn(locked && 'pointer-events-none')}>
      <div
        className={cn('relative', isFirst && !completed ? 60 : 24)}
        style={{
          right: `${rightPosition}px`
        }}
      >
        {current ? (
          <div className='h-[102px] w-[102px] relative'>
            <div className='absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10'>
              Start
              <div className='absolute left-1/2 -bottom-2 size-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2' />
            </div>

            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: {
                  stroke: '#4ade80'
                },
                trail: { stroke: '#e5e7eb' }
              }}
            >
              <Button size='rounded' variant={locked ? 'locked' : 'secondary'} className='size-[70px] border-b-8'>
                <Icon
                  className={cn(
                    'size-10',
                    locked
                      ? 'fill-neutral-400 text-neutral-400 stroke-neutral-400'
                      : 'fill-primary-foreground text-primary-foreground',
                    completed && 'fill-none stroke-[4]'
                  )}
                />
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          <Button size='rounded' variant={locked ? 'locked' : 'secondary'} className='size-[70px] border-b-8'>
            <Icon
              className={cn(
                'size-10',
                locked
                  ? 'fill-neutral-400 text-neutral-400 stroke-neutral-400'
                  : 'fill-primary-foreground text-primary-foreground',
                completed && 'fill-none stroke-[4]'
              )}
            />
          </Button>
        )}
      </div>
    </Link>
  )
}

export default LessonButton
