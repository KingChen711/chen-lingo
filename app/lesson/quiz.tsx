'use client'

import React, { useState } from 'react'

import { challengeOptions, challenges } from '@/database/schema'
import Header from './header'
import QuestionBubble from './question-bubble'
import Challenge from './challenge'

type Props = {
  initialLessonId: number
  initialPercentage: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
  initialHearts: number
  userSubscription: any
}

function Quiz({ initialHearts, initialLessonChallenges, initialLessonId, initialPercentage, userSubscription }: Props) {
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(67)
  const [challenges, setChallenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const challenge = challenges[activeIndex]
  const options = challenge.challengeOptions

  const title = challenge.type === 'ASSIST' ? 'Select the correct meaning' : challenge.question

  return (
    <>
      <Header hearts={hearts} percentages={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
      <div className='flex-1'>
        <div className='h-full flex items-center justify-center'>
          <div className='lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12'>
            <h1 className='text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700'>{title}</h1>
            <div>
              {challenge.type === 'ASSIST' && <QuestionBubble question={challenge.question} />}

              <Challenge
                options={options}
                onSelectOption={() => {}}
                status='none'
                selectedOption={2}
                disabled={false}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Quiz
